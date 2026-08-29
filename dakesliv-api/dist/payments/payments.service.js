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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const intasend_node_1 = __importDefault(require("intasend-node"));
const payment_entity_1 = require("./payment.entity");
const invoicing_service_1 = require("../invoicing/invoicing.service");
const foundation_service_1 = require("../foundation/foundation.service");
const FOUNDATION_PERCENTAGE = 0.03;
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(payments, invoicing, foundation) {
        this.payments = payments;
        this.invoicing = invoicing;
        this.foundation = foundation;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.client = null;
    }
    getClient() {
        const { INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY } = process.env;
        if (!INTASEND_PUBLISHABLE_KEY || !INTASEND_SECRET_KEY) {
            throw new Error("IntaSend isn't configured — set INTASEND_PUBLISHABLE_KEY and INTASEND_SECRET_KEY in .env.");
        }
        if (!this.client) {
            this.client = new intasend_node_1.default(INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY, process.env.NODE_ENV !== 'production');
        }
        return this.client;
    }
    async initiate(booking, amount, method) {
        const payment = this.payments.create({
            booking,
            amount,
            method,
            status: payment_entity_1.PaymentStatus.PENDING,
        });
        const saved = await this.payments.save(payment);
        if (method === payment_entity_1.PaymentMethod.CASH) {
            return this.confirm(saved.id);
        }
        if (method === payment_entity_1.PaymentMethod.MPESA) {
            try {
                const [firstName, ...rest] = (booking.user.name || 'Dakesliv Customer').split(' ');
                await this.getClient().collection().mpesaStkPush({
                    first_name: firstName,
                    last_name: rest.join(' ') || 'Customer',
                    email: booking.user.email || undefined,
                    amount: Number(amount),
                    phone_number: booking.user.phone.replace('+', ''),
                    api_ref: saved.id,
                });
            }
            catch (err) {
                this.logger.error(`M-Pesa STK push failed for payment ${saved.id}`, err);
                saved.status = payment_entity_1.PaymentStatus.FAILED;
                await this.payments.save(saved);
                throw new common_1.BadGatewayException('Could not start the M-Pesa payment. Please check the number and try again.');
            }
            return saved;
        }
        if (method === payment_entity_1.PaymentMethod.CARD) {
            throw new Error('Card payments are not wired up yet — use M-Pesa or cash for now.');
        }
        return saved;
    }
    async confirm(paymentId) {
        const payment = await this.payments.findOneByOrFail({ id: paymentId });
        payment.status = payment_entity_1.PaymentStatus.CONFIRMED;
        await this.payments.save(payment);
        await this.invoicing.createFromPayment(payment);
        await this.foundation.allocateFromPayment(payment, FOUNDATION_PERCENTAGE);
        return payment;
    }
    async markFailed(paymentId) {
        await this.payments.update({ id: paymentId }, { status: payment_entity_1.PaymentStatus.FAILED });
    }
    findOne(paymentId) {
        return this.payments.findOneByOrFail({ id: paymentId });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        invoicing_service_1.InvoicingService,
        foundation_service_1.FoundationService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map