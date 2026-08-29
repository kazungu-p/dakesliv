import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundationAllocation, FoundationCategory } from './foundation-allocation.entity';
import { Payment } from '../payments/payment.entity';

@Injectable()
export class FoundationService {
  constructor(
    @InjectRepository(FoundationAllocation)
    private readonly allocations: Repository<FoundationAllocation>,
  ) {}

  /**
   * Called from PaymentsService.confirm() for every confirmed payment,
   * online or walk-in. Category is fixed to SCHOLARSHIPS for now — once the
   * client decides how allocations should be split across the Foundation's
   * five categories, replace this with real rules (e.g. rotate by unit, or
   * a fixed split percentage per category).
   */
  async allocateFromPayment(payment: Payment, percentage: number): Promise<FoundationAllocation> {
    const amount = (parseFloat(payment.amount) * percentage).toFixed(2);

    const allocation = this.allocations.create({
      payment,
      amount,
      category: FoundationCategory.SCHOLARSHIPS,
    });
    return this.allocations.save(allocation);
  }

  /** Powers the public Impact page: total raised, and a breakdown by category. */
  async getImpactSummary() {
    const rows = await this.allocations.find();
    const total = rows.reduce((sum, r) => sum + parseFloat(r.amount), 0);

    const byCategory: Record<string, number> = {};
    for (const r of rows) {
      byCategory[r.category] = (byCategory[r.category] ?? 0) + parseFloat(r.amount);
    }

    return { total: total.toFixed(2), byCategory };
  }
}
