import { Component, OnInit } from '@angular/core';
import { AlgoService } from '../algo.service';

@Component({
  selector: 'app-algo',
  templateUrl: './algo.component.html',
  styleUrls: ['./algo.component.css']
})
export class AlgoComponent implements OnInit {
  Algo: algo;
  choice = 0;
  speed = 5000;
  playHandle = null;

  constructor(private algoService: AlgoService) { 
    var algos = algoService.getAlgos();
    this.algo = algos[0];
  }

  ngOnInit() {
  }

  displayAlgo() {
    this.algo.next();
  }

  next(){
   this.algo.next();
  }

  speedup(){
    this.speed = this.speed/2;
  }

  play(){
        this.algo.next();
        var scope = this;

        //do it again depending on the speed
        var scopePlay = function(){
            scope.play();
        }
        this.playHandle = setTimeout(scopePlay, this.speed);
  }

  stop(){
    clearTimeout(this.playHandle);
  }


  ngAfterViewInit() {
      this.displayAlgo();
  }
  

}



