"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdooClient = void 0;
const xmlrpc = __importStar(require("xmlrpc"));
class OdooClient {
    constructor(url, db, username, apiKey) {
        this.url = url;
        this.db = db;
        this.username = username;
        this.apiKey = apiKey;
        this.uid = null;
    }
    call(endpoint, method, params) {
        const client = xmlrpc.createSecureClient(`${this.url}/xmlrpc/2/${endpoint}`);
        return new Promise((resolve, reject) => {
            client.methodCall(method, params, (error, value) => {
                if (error)
                    reject(error);
                else
                    resolve(value);
            });
        });
    }
    async authenticate() {
        if (this.uid)
            return this.uid;
        this.uid = await this.call('common', 'authenticate', [
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
    async executeKw(model, method, args, kwargs = {}) {
        const uid = await this.authenticate();
        return this.call('object', 'execute_kw', [this.db, uid, this.apiKey, model, method, args, kwargs]);
    }
    async findOrCreatePartner(name, phone, email) {
        const existing = await this.executeKw('res.partner', 'search', [[['phone', '=', phone]]]);
        if (existing.length > 0)
            return existing[0];
        return this.executeKw('res.partner', 'create', [
            [{ name, phone, email: email || false }],
        ]);
    }
    async createInvoice(params) {
        const invoiceId = await this.executeKw('account.move', 'create', [
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
    async readEtimsResult(invoiceId) {
        const [record] = await this.executeKw('account.move', 'read', [
            [invoiceId],
            ['l10n_ke_cu_invoice_number', 'l10n_ke_cu_qr_url'],
        ]);
        return {
            controlNumber: record?.l10n_ke_cu_invoice_number || null,
            qrCodeUrl: record?.l10n_ke_cu_qr_url || null,
        };
    }
}
exports.OdooClient = OdooClient;
//# sourceMappingURL=odoo-client.js.map