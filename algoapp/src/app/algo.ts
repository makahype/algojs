import { Algodata } from './algo_models/algodata';

type AlgoStepState = {
    show: any; //show state data
    graph: any; //generate graph representation
}


export class Algo {
  id: number;
  name: string;
  process: Algodata;
  start: object;
  steps : Array<AlgoStepState>= [];
  end = false;

  constructor(id: number, name: string, process: Algodata, start: object ) { 
    this.id = id;
    this.name = name;
    this.process = process;
    this.start = start;
    this.process.setState(start);
    this.end = false;
  }

  isDone() {
    return this.end;
  }

  next() {
    var res = this.process.processState();
    this.end = this.process.isComplete();
    this.steps.push(res);

    //display current state
    this.visualize();
  }

  clear() {
    this.steps = [];
    this.process.setState(this.start);
  }

  visualize() {
    this.showStructure();
    this.showGraph();
  }

  //process to display data structure and data
  showStructure() {

    var canvas : any = document.getElementById("algo_raster");
    var ctx = canvas.getContext("2d");

    //clear for new input
    ctx.clearRect(0,0,700,600);

    //draw dividing line
    ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(350,200);
    ctx.stroke();
    ctx.font = "20px Arial";
    ctx.fillStyle = 'black';

    var line = 1;
    var section = 0;

    //if its the first process then we will  not require
    //output in the second section
    if(this.steps.length >= 2){

        var step2 = this.steps[this.steps.length - 2];
        var show = step2.show;
        ctx.fillText("step "+(this.steps.length-1),10,30);

        show.forEach(function(item){

            //assign options if set
            if(item.color){
                ctx.fillStyle =item.color;
                item = item.val;
            }
            ctx.fillText(item,10,30+line * 30);

            //reset
            ctx.fillStyle = 'black';
            line++;
        });

        //make sure next part is drawn in the next canvas
        //section
        section++;
    }

    //display state for previous or first step
    var step1 = this.steps[this.steps.length - 1];
    var show = step1.show;
    ctx.fillText("step "+this.steps.length,10,(section * 200)+30);

    line = 1;
    show.forEach(function(item){

        //assign options if set
        if(item.color){
            ctx.fillStyle = item.color;
            item = item.val;
        }
        ctx.fillText(item,10,(line * 30)+(section * 200)+30);

        ctx.fillStyle = 'black';
        line++;
    });
  }

  //process to show visual representation of state
  showGraph(){

    var canvas : any = document.getElementById("algo_raster");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'black';

    var lines = this.steps[this.steps.length - 1].graph.lines;
    for(var l = 0; l < lines.length; l++){

        ctx.beginPath();
        ctx.moveTo(lines[l].to.x,lines[l].to.y);
        ctx.lineTo(lines[l].from.x,lines[l].from.y);
        ctx.stroke();

        //fixes canvas style applying bug
        ctx.beginPath();
        ctx.closePath();
    }

    var dots = this.steps[this.steps.length - 1].graph.dots;
    for(var d = 0; d < dots.length; d++){
        ctx.beginPath();
        ctx.fillStyle = dots[d].color;        
        ctx.arc(dots[d].x,dots[d].y,dots[d].size,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        //fixes canvas style applying bug
        ctx.beginPath();
        ctx.closePath();
    }

    var rects = this.steps[this.steps.length - 1].graph.rects;
    for(var s = 0; s < rects.length; s++){
        ctx.fillStyle = rects[s].color;
        ctx.rect(rects[s].x,rects[s].y,rects[s].sizex,rects[s].sizey);
        ctx.fill();

        //fixes canvas style applying bug
        ctx.beginPath();
        ctx.closePath();
    }

    var text = this.steps[this.steps.length - 1].graph.text;
    for(var s = 0; s < text.length; s++){
        ctx.fillStyle = text[s].color;
        ctx.font = text[s].size+"px Arial";
        ctx.fillText(text[s].phrase,text[s].x,text[s].y);

        //fixes canvas style applying bug
        ctx.beginPath();
        ctx.closePath();
    }

  }

}