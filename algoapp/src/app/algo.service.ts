import { Injectable } from '@angular/core';

import { Algo } from './algo';
import { ALGOS } from './algo-def';

@Injectable({
  providedIn: 'root',
})
export class AlgoService {

  constructor() { }

  getAlgos(): Algo[] {
    return ALGOS;
  }

}