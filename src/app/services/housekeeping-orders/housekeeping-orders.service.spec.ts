import { TestBed } from '@angular/core/testing';

import { HousekeepingOrdersService } from './housekeeping-orders.service';

describe('HousekeepingOrdersService', () => {
  let service: HousekeepingOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousekeepingOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
