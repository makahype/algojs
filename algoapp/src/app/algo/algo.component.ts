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
  speed = 5;
  playHandle = null;
  playMode = false;

  constructor() {
  }

  ngOnInit(){
  }

  ngOnChanges(){
    this.algo.clear();
    this.algo.next();
  }


  next(){
   this.algo.next();
  }

  speedup(){
    var speed_obj = {5: 3, 3: 1, 1: 5};
    this.speed = speed_obj[this.speed];
  }

  play(){
        this.playMode = true;
        this.algo.next();
        var scope = this;

        //do it again depending on the speed
        var scopePlay = function(){
            scope.play();
        }
        this.playHandle = setTimeout(scopePlay, (this.speed*1000));
  }

  stop(){
    this.playMode = false;
    clearTimeout(this.playHandle);
  }
  

}



