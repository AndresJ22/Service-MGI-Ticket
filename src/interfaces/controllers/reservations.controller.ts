import {
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import { ExpireReservationsService } from '../../application/services/expire-reservations.service';
import { ReserveTicketsService } from '../../application/services/reserve-tickets.service';
import { Reservation } from '../../domain/reservations/reservation';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reserveTickets: ReserveTicketsService,
    private readonly expireReservations: ExpireReservationsService,
  ) {}

  @Post()
  reserve(
    @Body()
    body: {
      ticketTypeId: string;
      quantity: number;
      userId: string;
    },
  ): Reservation {
    try {
      return this.reserveTickets.execute(body);
    } catch (error) {
      if (error instanceof Error && error.message === 'INSUFFICIENT_INVENTORY') {
        throw new ConflictException('INSUFFICIENT_INVENTORY');
      }
      throw error;
    }
  }

  @Post('expire')
  expire(): { expiredCount: number } {
    const expiredCount = this.expireReservations.execute();
    return { expiredCount };
  }
}
