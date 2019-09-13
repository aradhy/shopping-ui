import { TestBed } from '@angular/core/testing';

import { BucketViewServiceService } from './bucket-view-service.service';

describe('BucketViewServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BucketViewServiceService = TestBed.get(BucketViewServiceService);
    expect(service).toBeTruthy();
  });
});
