import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'ID de la reserva a confirmar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  reservationId: string;

  @ApiProperty({
    description: 'ID del pago del proveedor (debe ser único)',
    example: 'pay-123',
  })
  paymentId: string;
}
