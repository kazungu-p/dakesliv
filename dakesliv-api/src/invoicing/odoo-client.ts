import * as xmlrpc from 'xmlrpc';

/**
 * Thin wrapper around Odoo's external API (XML-RPC), which is stable and
 * well-documented regardless of which specific eTIMS module Odoo Kenya
 * localization installs on top of it.
 *
 * What this class CAN do confidently: authenticate, create a draft customer
 * invoice (account.move), and post it (action_post) — this part of Odoo's
 * API hasn't changed in years and is the same for every installation.
 *
 * What it CANNOT do confidently: read back the KRA control number and QR
 * code after eTIMS transmission. Different Odoo eTIMS modules (the native
 * Odoo 17+ Kenya localization vs. third-party apps like eTIMS_OSCU or
 * htsk_tims_connector) store this under different field names, and some
 * require an extra explicit action (e.g. clicking "Send to eTIMS") rather
 * than transmitting automatically on posting. See ODOO_ETIMS_* env vars
 * below and the comment on readEtimsResult() — this needs a short session
 * with your actual Odoo instance (Settings → Technical → Database
 * Structure → Fields, on the account.move model) to fill in correctly.
 */
export class OdooClient {
  private uid: number | null = null;

  constructor(
    private readonly url: string,
    private readonly db: string,
    private readonly username: string,
    private readonly apiKey: string,
  ) {}

  private call<T>(endpoint: 'common' | 'object', method: string, params: unknown[]): Promise<T> {
    const client = xmlrpc.createSecureClient(`${this.url}/xmlrpc/2/${endpoint}`);
    return new Promise((resolve, reject) => {
      client.methodCall(method, params, (error, value) => {
        if (error) reject(error);
        else resolve(value as T);
      });
    });
  }

  private async authenticate(): Promise<number> {
    if (this.uid) return this.uid;
    // Odoo accepts an API key in place of a password here (Odoo 14+).
    this.uid = await this.call<number>('common', 'authenticate', [
      this.db,
      this.username,
      this.apiKey,
      {},
    ]);
    if (!this.uid) {
      throw new Error('Odoo authentication failed — check ODOO_DB/ODOO_USERNAME/ODOO_API_KEY.');
    }
    return this.uid;
  }

  private async executeKw<T>(model: string, method: string, args: unknown[], kwargs: object = {}): Promise<T> {
    const uid = await this.authenticate();
    return this.call<T>('object', 'execute_kw', [this.db, uid, this.apiKey, model, method, args, kwargs]);
  }

  /** Finds an existing customer by phone, or creates one. */
  async findOrCreatePartner(name: string, phone: string, email?: string): Promise<number> {
    const existing = await this.executeKw<number[]>('res.partner', 'search', [[['phone', '=', phone]]]);
    if (existing.length > 0) return existing[0];

    return this.executeKw<number>('res.partner', 'create', [
      [{ name, phone, email: email || false }],
    ]);
  }

  /**
   * Creates and posts a customer invoice for one line item. Returns the
   * Odoo invoice (account.move) id — use this with readEtimsResult() once
   * that method is filled in for your specific eTIMS module.
   */
  async createInvoice(params: {
    partnerId: number;
    description: string;
    amount: number;
    vatTaxId: number;
  }): Promise<number> {
    const invoiceId = await this.executeKw<number>('account.move', 'create', [
      [
        {
          move_type: 'out_invoice',
          partner_id: params.partnerId,
          invoice_line_ids: [
            [
              0,
              0,
              {
                name: params.description,
                quantity: 1,
                price_unit: params.amount,
                tax_ids: [[6, 0, [params.vatTaxId]]],
              },
            ],
          ],
        },
      ],
    ]);

    await this.executeKw('account.move', 'action_post', [[invoiceId]]);
    return invoiceId;
  }

  /**
   * TODO: this is the one part of the integration that needs to be
   * confirmed against your actual Odoo instance, not guessed from docs.
   *
   * Once you have Odoo running with its Kenya eTIMS module installed:
   *  1. Post a real invoice through the Odoo UI and click "Send to eTIMS"
   *     (or confirm it fires automatically on posting, which some modules do)
   *  2. Enable Developer Mode, open that invoice, and use
   *     Settings → Technical → Database Structure → Fields (filtered to
   *     model account.move) to find the actual field names holding the
   *     KRA control number and QR code image/URL
   *  3. Replace the two field names below with the real ones
   *
   * Until this is filled in, invoices will post successfully in Odoo but
   * this app won't be able to show the client their KRA control
   * number/QR — they'll need to be pulled from Odoo directly in the
   * meantime.
   */
  async readEtimsResult(invoiceId: number): Promise<{ controlNumber: string | null; qrCodeUrl: string | null }> {
    const [record] = await this.executeKw<Array<Record<string, unknown>>>('account.move', 'read', [
      [invoiceId],
      // Placeholder field names — see the TODO above.
      ['l10n_ke_cu_invoice_number', 'l10n_ke_cu_qr_url'],
    ]);

    return {
      controlNumber: (record?.l10n_ke_cu_invoice_number as string) || null,
      qrCodeUrl: (record?.l10n_ke_cu_qr_url as string) || null,
    };
  }
}
