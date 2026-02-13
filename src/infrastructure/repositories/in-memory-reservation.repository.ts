import { Reservation } from '../../domain/reservations/reservation';
import { ReservationStatus } from '../../domain/reservations/reservation-status';
import { ReservationRepository } from '../../domain/ports/reservation-repository';

export class InMemoryReservationRepository implements ReservationRepository {
  private readonly items = new Map<string, Reservation>();

  save(reservation: Reservation): void {
    this.items.set(reservation.id, reservation);
  }

  findById(id: string): Reservation | null {
    return this.items.get(id) ?? null;
  }

  findExpired(now: Date): Reservation[] {
    return Array.from(this.items.values()).filter((reservation) => {
      return (
        reservation.status === ReservationStatus.Pending &&
        reservation.expiresAt <= now
      );
    });
  }
}
