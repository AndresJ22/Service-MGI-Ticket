import { Clock } from '../../domain/ports/clock';
import { PaymentRepository } from '../../domain/ports/payment-repository';
import { ReservationRepository } from '../../domain/ports/reservation-repository';
import { ReservationStatus } from '../../domain/reservations/reservation-status';

export type ConfirmPaymentResult = 'CONFIRMED' | 'ALREADY_PROCESSED';

export class ConfirmPaymentService {
  constructor(
    private readonly reservations: ReservationRepository,
    private readonly payments: PaymentRepository,
    private readonly clock: Clock,
  ) {}

  execute(input: {
    reservationId: string;
    paymentId: string;
  }): ConfirmPaymentResult {
    const reservation = this.reservations.findById(input.reservationId);

    if (!reservation) {
      throw new Error('RESERVATION_NOT_FOUND');
    }

    if (reservation.status === ReservationStatus.Confirmed) {
      return 'ALREADY_PROCESSED';
    }

    if (reservation.status !== ReservationStatus.Pending) {
      throw new Error('RESERVATION_NOT_PENDING');
    }

    const now = this.clock.now();
    if (reservation.expiresAt <= now) {
      throw new Error('RESERVATION_EXPIRED');
    }

    const recorded = this.payments.record(input.paymentId, reservation.id);
    if (!recorded) {
      return 'ALREADY_PROCESSED';
    }

    reservation.status = ReservationStatus.Confirmed;
    this.reservations.save(reservation);
    return 'CONFIRMED';
  }
}
