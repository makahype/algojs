import { Component, OnInit } from '@angular/core';
import { AlgoService } from '../algo.service';

@Component({
  selector: 'app-algo',
  templateUrl: './algo.component.html',
  styleUrls: ['./algo.component.css']
})
export class AlgoComponent implements OnInit {

  constructor(private algoService: AlgoService) { }

  ngOnInit() {
  }

  displayAlgo() {
    var c = document.getElementById("algo_raster");
    var ctx = c.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke();
  }


  ngAfterViewInit() {
      this.displayAlgo();
  }
  

}



