import { ExpireReservationsService } from './expire-reservations.service';
import { ReserveTicketsService } from './reserve-tickets.service';
import { InMemoryInventoryRepository } from '../../infrastructure/repositories/in-memory-inventory.repository';
import { InMemoryReservationRepository } from '../../infrastructure/repositories/in-memory-reservation.repository';
import { TestClock } from '../../infrastructure/clock/test-clock';
import { ReservationStatus } from '../../domain/reservations/reservation-status';

describe('ReserveTicketsService', () => {
  it('reserves tickets and decreases inventory', () => {
    const clock = new TestClock(new Date('2026-02-11T10:00:00.000Z'));
    const inventory = new InMemoryInventoryRepository();
    const reservations = new InMemoryReservationRepository();
    inventory.seed('tt-1', 10);

    const service = new ReserveTicketsService(
      reservations,
      inventory,
      clock,
      5 * 60 * 1000,
    );

    const reservation = service.execute({
      ticketTypeId: 'tt-1',
      quantity: 2,
      userId: 'user-1',
    });

    expect(reservation.status).toBe(ReservationStatus.Pending);
    expect(inventory.getAvailable('tt-1')).toBe(8);
  });

  it('rejects when there is no availability', () => {
    const clock = new TestClock(new Date('2026-02-11T10:00:00.000Z'));
    const inventory = new InMemoryInventoryRepository();
    const reservations = new InMemoryReservationRepository();
    inventory.seed('tt-1', 1);

    const service = new ReserveTicketsService(
      reservations,
      inventory,
      clock,
      5 * 60 * 1000,
    );

    expect(() =>
      service.execute({
        ticketTypeId: 'tt-1',
        quantity: 2,
        userId: 'user-1',
      }),
    ).toThrow('INSUFFICIENT_INVENTORY');

    expect(inventory.getAvailable('tt-1')).toBe(1);
  });

  it('expires reservations and releases inventory', () => {
    const clock = new TestClock(new Date('2026-02-11T10:00:00.000Z'));
    const inventory = new InMemoryInventoryRepository();
    const reservations = new InMemoryReservationRepository();
    inventory.seed('tt-1', 2);

    const reserveService = new ReserveTicketsService(
      reservations,
      inventory,
      clock,
      1 * 60 * 1000,
    );

    reserveService.execute({
      ticketTypeId: 'tt-1',
      quantity: 2,
      userId: 'user-1',
    });

    expect(inventory.getAvailable('tt-1')).toBe(0);

    clock.advanceBy(2 * 60 * 1000);
    const expireService = new ExpireReservationsService(
      reservations,
      inventory,
      clock,
    );

    const expiredCount = expireService.execute();
    expect(expiredCount).toBe(1);
    expect(inventory.getAvailable('tt-1')).toBe(2);
  });
});
