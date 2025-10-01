import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { productosGuard } from './productos-guard';

describe('productosGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => productosGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
