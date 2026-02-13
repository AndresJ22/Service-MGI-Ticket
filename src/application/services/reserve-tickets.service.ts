import { randomUUID } from 'crypto';
import { Reservation } from '../../domain/reservations/reservation';
import { ReservationStatus } from '../../domain/reservations/reservation-status';
import { Clock } from '../../domain/ports/clock';
import { InventoryRepository } from '../../domain/ports/inventory-repository';
import { ReservationRepository } from '../../domain/ports/reservation-repository';

export class ReserveTicketsService {
  constructor(
    private readonly reservations: ReservationRepository,
    private readonly inventory: InventoryRepository,
    private readonly clock: Clock,
    private readonly ttlMs: number,
  ) {}

  execute(input: {
    ticketTypeId: string;
    quantity: number;
    userId: string;
  }): Reservation {
    if (input.quantity <= 0) {
      throw new Error('INVALID_QUANTITY');
    }

    const reserved = this.inventory.reserveQuantity(
      input.ticketTypeId,
      input.quantity,
    );

    if (!reserved) {
      throw new Error('INSUFFICIENT_INVENTORY');
    }

    const now = this.clock.now();
    const reservation = new Reservation(
      randomUUID(),
      input.ticketTypeId,
      input.quantity,
      input.userId,
      ReservationStatus.Pending,
      now,
      new Date(now.getTime() + this.ttlMs),
    );

    this.reservations.save(reservation);
    return reservation;
  }
}
