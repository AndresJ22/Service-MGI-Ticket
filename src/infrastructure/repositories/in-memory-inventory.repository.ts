import { InventoryRepository } from '../../domain/ports/inventory-repository';

export class InMemoryInventoryRepository implements InventoryRepository {
  private readonly availableByType = new Map<string, number>();

  seed(ticketTypeId: string, quantity: number): void {
    this.availableByType.set(ticketTypeId, quantity);
  }

  reserveQuantity(ticketTypeId: string, quantity: number): boolean {
    const available = this.getAvailable(ticketTypeId);
    if (available < quantity) {
      return false;
    }
    this.availableByType.set(ticketTypeId, available - quantity);
    return true;
  }

  releaseQuantity(ticketTypeId: string, quantity: number): void {
    const available = this.getAvailable(ticketTypeId);
    this.availableByType.set(ticketTypeId, available + quantity);
  }

  getAvailable(ticketTypeId: string): number {
    return this.availableByType.get(ticketTypeId) ?? 0;
  }
}
