import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import {
  ConfirmPaymentResult,
  ConfirmPaymentService,
} from '../../application/services/confirm-payment.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { ConfirmPaymentResponseDto } from './dto/responses.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly confirmPayment: ConfirmPaymentService) {}

  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar pago y finalizar reserva' })
  @ApiResponse({
    status: 201,
    description: 'Pago confirmado exitosamente',
    type: ConfirmPaymentResponseDto,
  })
  @ApiConflictResponse({
    description: 'La reserva ha expirado o no está en estado válido',
  })
  confirm(
    @Body() body: ConfirmPaymentDto,
  ): { status: ConfirmPaymentResult } {
    try {
      const status = this.confirmPayment.execute(body);
      return { status };
    } catch (error) {
      if (error instanceof Error && error.message === 'RESERVATION_EXPIRED') {
        throw new ConflictException('RESERVATION_EXPIRED');
      }
      throw error;
    }
  }
}
