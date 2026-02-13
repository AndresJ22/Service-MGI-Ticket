import { ReservationStatus } from './reservation-status';

export class Reservation {
  constructor(
    public readonly id: string,
    public readonly ticketTypeId: string,
    public readonly quantity: number,
    public readonly userId: string,
    public status: ReservationStatus,
    public readonly createdAt: Date,
    public expiresAt: Date,
  ) {}

  expire(now: Date): void {
    if (this.status !== ReservationStatus.Pending) {
      return;
    }
    if (now >= this.expiresAt) {
      this.status = ReservationStatus.Expired;
    }
  }
}
