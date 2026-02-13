import {
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ExpireReservationsService } from '../../application/services/expire-reservations.service';
import { ReserveTicketsService } from '../../application/services/reserve-tickets.service';
import { Reservation } from '../../domain/reservations/reservation';
import { ReserveTicketsDto } from './dto/reserve-tickets.dto';
import {
  ReservationResponseDto,
  ExpireResponseDto,
} from './dto/responses.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reserveTickets: ReserveTicketsService,
    private readonly expireReservations: ExpireReservationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Reservar entradas temporalmente' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
    type: ReservationResponseDto,
  })
  @ApiConflictResponse({
    description: 'No hay inventario suficiente',
  })
  reserve(@Body() body: ReserveTicketsDto): Reservation {
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
  @ApiOperation({ summary: 'Expirar reservas vencidas manualmente' })
  @ApiResponse({
    status: 201,
    description: 'Reservas expiradas y stock liberado',
    type: ExpireResponseDto,
  })
  expire(): { expiredCount: number } {
    const expiredCount = this.expireReservations.execute();
    return { expiredCount };
  }
}
