import { Clock } from '../../domain/ports/clock';

export class TestClock implements Clock {
  private current: Date;

  constructor(startAt: Date) {
    this.current = startAt;
  }

  now(): Date {
    return new Date(this.current.getTime());
  }

  advanceBy(ms: number): void {
    this.current = new Date(this.current.getTime() + ms);
  }
}
