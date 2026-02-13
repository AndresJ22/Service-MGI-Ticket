import { Clock } from '../../domain/ports/clock';
import { InventoryRepository } from '../../domain/ports/inventory-repository';
import { ReservationRepository } from '../../domain/ports/reservation-repository';
import { ReservationStatus } from '../../domain/reservations/reservation-status';

export class ExpireReservationsService {
  constructor(
    private readonly reservations: ReservationRepository,
    private readonly inventory: InventoryRepository,
    private readonly clock: Clock,
  ) {}

  execute(): number {
    const now = this.clock.now();
    const expired = this.reservations.findExpired(now);

    for (const reservation of expired) {
      reservation.status = ReservationStatus.Expired;
      this.reservations.save(reservation);
      this.inventory.releaseQuantity(
        reservation.ticketTypeId,
        reservation.quantity,
      );
    }

    return expired.length;
  }
}
