import { Component } from '@angular/core';
import { Algo } from './algo';
import { AlgoService } from './algo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Algo Visualize App';
  algos : Algo[];
  selectedAlgo : Algo;

  constructor (private algoService: AlgoService) {  }

  ngOnInit() {
        this.getAlgos();
        this.selectedAlgo = this.algos[0];
  }

  selectAlgo(algo: Algo): void{
    algo.clear();
    this.selectedAlgo = algo;
  }

  getAlgos(): void{

    this.algoService.getAlgos()
        .subscribe(algos => this.algos = algos);
  }


}
