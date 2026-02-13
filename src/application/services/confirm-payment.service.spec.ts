import { ConfirmPaymentService } from './confirm-payment.service';
import { ReserveTicketsService } from './reserve-tickets.service';
import { InMemoryInventoryRepository } from '../../infrastructure/repositories/in-memory-inventory.repository';
import { InMemoryReservationRepository } from '../../infrastructure/repositories/in-memory-reservation.repository';
import { InMemoryPaymentRepository } from '../../infrastructure/repositories/in-memory-payment.repository';
import { TestClock } from '../../infrastructure/clock/test-clock';
import { ReservationStatus } from '../../domain/reservations/reservation-status';

describe('ConfirmPaymentService', () => {
  it('confirms a pending reservation', () => {
    const clock = new TestClock(new Date('2026-02-11T10:00:00.000Z'));
    const inventory = new InMemoryInventoryRepository();
    const reservations = new InMemoryReservationRepository();
    const payments = new InMemoryPaymentRepository();
    inventory.seed('tt-1', 2);

    const reserveService = new ReserveTicketsService(
      reservations,
      inventory,
      clock,
      5 * 60 * 1000,
    );

    const reservation = reserveService.execute({
      ticketTypeId: 'tt-1',
      quantity: 1,
      userId: 'user-1',
    });

    const confirmService = new ConfirmPaymentService(
      reservations,
      payments,
      clock,
    );

    const result = confirmService.execute({
      reservationId: reservation.id,
      paymentId: 'pay-1',
    });

    expect(result).toBe('CONFIRMED');
    expect(reservation.status).toBe(ReservationStatus.Confirmed);
  });

  it('is idempotent for duplicated payment ids', () => {
    const clock = new TestClock(new Date('2026-02-11T10:00:00.000Z'));
    const inventory = new InMemoryInventoryRepository();
    const reservations = new InMemoryReservationRepository();
    const payments = new InMemoryPaymentRepository();
    inventory.seed('tt-1', 2);

    const reserveService = new ReserveTicketsService(
      reservations,
      inventory,
      clock,
      5 * 60 * 1000,
    );

    const reservation = reserveService.execute({
      ticketTypeId: 'tt-1',
      quantity: 1,
      userId: 'user-1',
    });

    const confirmService = new ConfirmPaymentService(
      reservations,
      payments,
      clock,
    );

    const first = confirmService.execute({
      reservationId: reservation.id,
      paymentId: 'pay-1',
    });
    const second = confirmService.execute({
      reservationId: reservation.id,
      paymentId: 'pay-1',
    });

    expect(first).toBe('CONFIRMED');
    expect(second).toBe('ALREADY_PROCESSED');
  });
});
