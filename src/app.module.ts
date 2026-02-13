import { Module } from '@nestjs/common';
import { ConfirmPaymentService } from './application/services/confirm-payment.service';
import { ExpireReservationsService } from './application/services/expire-reservations.service';
import { ReserveTicketsService } from './application/services/reserve-tickets.service';
import { SystemClock } from './infrastructure/clock/system-clock';
import { InMemoryInventoryRepository } from './infrastructure/repositories/in-memory-inventory.repository';
import { InMemoryPaymentRepository } from './infrastructure/repositories/in-memory-payment.repository';
import { InMemoryReservationRepository } from './infrastructure/repositories/in-memory-reservation.repository';
import { PaymentsController } from './interfaces/controllers/payments.controller';
import { ReservationsController } from './interfaces/controllers/reservations.controller';

@Module({
  imports: [],
  controllers: [ReservationsController, PaymentsController],
  providers: [
    InMemoryReservationRepository,
    InMemoryPaymentRepository,
    SystemClock,
    {
      provide: InMemoryInventoryRepository,
      useFactory: () => {
        const inventory = new InMemoryInventoryRepository();
        inventory.seed('tt-1', 100);
        return inventory;
      },
    },
    {
      provide: ReserveTicketsService,
      useFactory: (
        reservations: InMemoryReservationRepository,
        inventory: InMemoryInventoryRepository,
        clock: SystemClock,
      ) => new ReserveTicketsService(reservations, inventory, clock, 5 * 60 * 1000),
      inject: [
        InMemoryReservationRepository,
        InMemoryInventoryRepository,
        SystemClock,
      ],
    },
    {
      provide: ExpireReservationsService,
      useFactory: (
        reservations: InMemoryReservationRepository,
        inventory: InMemoryInventoryRepository,
        clock: SystemClock,
      ) => new ExpireReservationsService(reservations, inventory, clock),
      inject: [
        InMemoryReservationRepository,
        InMemoryInventoryRepository,
        SystemClock,
      ],
    },
    {
      provide: ConfirmPaymentService,
      useFactory: (
        reservations: InMemoryReservationRepository,
        payments: InMemoryPaymentRepository,
        clock: SystemClock,
      ) => new ConfirmPaymentService(reservations, payments, clock),
      inject: [
        InMemoryReservationRepository,
        InMemoryPaymentRepository,
        SystemClock,
      ],
    },
  ],
})
export class AppModule {}
