import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'tt-1' })
  ticketTypeId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 'user-123' })
  userId: string;

  @ApiProperty({ enum: ['PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED'] })
  status: string;

  @ApiProperty({ example: '2026-02-13T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-13T10:05:00.000Z' })
  expiresAt: Date;
}

export class ExpireResponseDto {
  @ApiProperty({ example: 3 })
  expiredCount: number;
}

export class ConfirmPaymentResponseDto {
  @ApiProperty({ enum: ['CONFIRMED', 'ALREADY_PROCESSED'] })
  status: string;
}
