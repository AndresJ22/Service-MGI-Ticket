export class TicketType {
  constructor(
    public readonly id: string,
    public readonly eventId: string,
    public readonly name: string,
    public readonly capacity: number,
  ) {}
}
