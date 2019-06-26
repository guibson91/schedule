import { TestBed } from '@angular/core/testing';

import { LocalTranslateService } from './local-translate.service';

describe('LocalTranslateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalTranslateService = TestBed.get(LocalTranslateService);
    expect(service).toBeTruthy();
  });
});
