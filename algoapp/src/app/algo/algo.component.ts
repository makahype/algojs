import { Component, OnInit, Input } from '@angular/core';
import { Algo } from '../algo';


@Component({
  selector: 'app-algo',
  templateUrl: './algo.component.html',
  styleUrls: ['./algo.component.css']
})
export class AlgoComponent implements OnInit {
  @Input() algo: Algo;
  choice = 0;
  speed = 5000;
  playHandle = null;
  algos = [];

  constructor() {
  }

  ngOnInit(){
  }

  ngOnChanges(){
    this.algo.next();
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
  

}



