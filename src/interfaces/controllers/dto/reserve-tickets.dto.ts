import { ApiProperty } from '@nestjs/swagger';

export class ReserveTicketsDto {
  @ApiProperty({
    description: 'ID del tipo de entrada',
    example: 'tt-1',
  })
  ticketTypeId: string;

  @ApiProperty({
    description: 'Cantidad de entradas a reservar',
    example: 2,
    minimum: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'ID del usuario que realiza la reserva',
    example: 'user-123',
  })
  userId: string;
}
