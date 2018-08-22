import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Algo } from './algo';
import { ALGOS } from './algo-def';

@Injectable({
  providedIn: 'root',
})
export class AlgoService {
  current = 0;

  constructor() { 
  }

  getAlgos(): Observable<Algo[]> {
    return of(ALGOS);
  }


}