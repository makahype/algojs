import { Component } from '@angular/core';
import { AlgoService } from './algo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Algo Visualize App';
  algos = [];

  constructor (private algoService: AlgoService) {
    this.algos = algoService.getAlgos();
  }
}
