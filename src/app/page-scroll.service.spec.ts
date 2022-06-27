import { TestBed } from '@angular/core/testing';

import { PageScrollService } from './page-scroll.service';

describe('PageScrollService', () => {
  let service: PageScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
