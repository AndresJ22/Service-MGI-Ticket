import { PaymentRepository } from '../../domain/ports/payment-repository';

export class InMemoryPaymentRepository implements PaymentRepository {
  private readonly payments = new Map<string, string>();

  record(paymentId: string, reservationId: string): boolean {
    if (this.payments.has(paymentId)) {
      return false;
    }
    this.payments.set(paymentId, reservationId);
    return true;
  }
}
