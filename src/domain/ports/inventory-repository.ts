export interface InventoryRepository {
  reserveQuantity(ticketTypeId: string, quantity: number): boolean;
  releaseQuantity(ticketTypeId: string, quantity: number): void;
  getAvailable(ticketTypeId: string): number;
}
