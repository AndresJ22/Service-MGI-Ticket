export interface PaymentRepository {
  record(paymentId: string, reservationId: string): boolean;
}
