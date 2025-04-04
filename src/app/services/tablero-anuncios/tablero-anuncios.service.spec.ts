import { TestBed } from '@angular/core/testing';

import { TableroAnunciosService } from './tablero-anuncios.service';

describe('TableroAnunciosService', () => {
  let service: TableroAnunciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableroAnunciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
