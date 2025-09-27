import { TestBed } from '@angular/core/testing';

import { LoginA } from './login-a';

describe('LoginA', () => {
  let service: LoginA;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginA);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
