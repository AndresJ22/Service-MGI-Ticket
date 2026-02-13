import { Reservation } from '../reservations/reservation';

export interface ReservationRepository {
  save(reservation: Reservation): void;
  findById(id: string): Reservation | null;
  findExpired(now: Date): Reservation[];
}
