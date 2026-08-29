"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InvoicingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./invoice.entity");
const odoo_client_1 = require("./odoo-client");
const VAT_RATE = 0.16;
let InvoicingService = InvoicingService_1 = class InvoicingService {
    constructor(invoices) {
        this.invoices = invoices;
        this.logger = new common_1.Logger(InvoicingService_1.name);
        this.odoo = null;
    }
    getOdoo() {
        const { ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY } = process.env;
        if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_API_KEY) {
            throw new Error("Odoo isn't configured — set ODOO_URL, ODOO_DB, ODOO_USERNAME and ODOO_API_KEY in .env.");
        }
        if (!this.odoo) {
            this.odoo = new odoo_client_1.OdooClient(ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY);
        }
        return this.odoo;
    }
    async createFromPayment(payment) {
        const vatAmount = (parseFloat(payment.amount) * VAT_RATE).toFixed(2);
        const invoice = this.invoices.create({
            payment,
            vatAmount,
            status: invoice_entity_1.InvoiceStatus.PENDING_ETIMS,
        });
        await this.invoices.save(invoice);
        this.transmitToOdoo(invoice).catch((err) => this.logger.error(`eTIMS transmission failed for invoice ${invoice.id}`, err));
        return invoice;
    }
    async transmitToOdoo(invoice) {
        const { ODOO_VAT_TAX_ID } = process.env;
        if (!ODOO_VAT_TAX_ID) {
            throw new Error('ODOO_VAT_TAX_ID is not set — find the 16% VAT tax id in Odoo Accounting → Configuration → Taxes.');
        }
        const odoo = this.getOdoo();
        const { payment } = invoice;
        const { booking } = payment;
        const { user, service } = booking;
        try {
            const partnerId = await odoo.findOrCreatePartner(user.name, user.phone, user.email);
            const odooInvoiceId = await odoo.createInvoice({
                partnerId,
                description: `${service.name} — DAKESLIV ${service.businessUnit.name}`,
                amount: parseFloat(payment.amount),
                vatTaxId: Number(ODOO_VAT_TAX_ID),
            });
            const { controlNumber, qrCodeUrl } = await odoo.readEtimsResult(odooInvoiceId);
            invoice.kraControlNumber = controlNumber ?? undefined;
            invoice.qrCodeUrl = qrCodeUrl ?? undefined;
            invoice.status = controlNumber ? invoice_entity_1.InvoiceStatus.ISSUED : invoice_entity_1.InvoiceStatus.PENDING_ETIMS;
            await this.invoices.save(invoice);
        }
        catch (err) {
            invoice.status = invoice_entity_1.InvoiceStatus.FAILED;
            await this.invoices.save(invoice);
            throw err;
        }
    }
    async findPendingRetries() {
        return this.invoices.find({ where: { status: invoice_entity_1.InvoiceStatus.PENDING_ETIMS } });
    }
};
exports.InvoicingService = InvoicingService;
exports.InvoicingService = InvoicingService = InvoicingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvoicingService);
//# sourceMappingURL=invoicing.service.js.map