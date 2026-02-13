import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import {
  ConfirmPaymentResult,
  ConfirmPaymentService,
} from '../../application/services/confirm-payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly confirmPayment: ConfirmPaymentService) {}

  @Post('confirm')
  confirm(
    @Body()
    body: {
      reservationId: string;
      paymentId: string;
    },
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
