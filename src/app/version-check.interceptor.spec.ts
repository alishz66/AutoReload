import { TestBed } from '@angular/core/testing';

import { VersionCheckInterceptor } from './version-check.interceptor';

describe('VersionCheckInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      VersionCheckInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: VersionCheckInterceptor = TestBed.inject(VersionCheckInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
