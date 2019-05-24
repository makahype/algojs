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

  //canvas global variables
  cav_hg = 400;
  cav_wd = 700;
  font = "20px Arial";

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
    ctx.font = this.font;
 
    //setup blank display
    ctx.clearRect(0, 0, this.cav_wd, this.cav_hg);
    this.cavDrawLine(ctx, {x: 350,y: 50,x_to: 350, y_to: 300, clr: 'black'});


    //if its the first process then we will  not require
    //output in the second section
    var line = 1;
    var color = "black";
    var section = 0;
    var newest_steps = this.steps.reverse();//display the newest info

    if(this.steps.length >= 2){
        var step2 = newest_steps[1];
        var show = step2.show;
        this.cavDrawText(ctx, {text:"step "+(this.steps.length-1) , x: 10, y: 30, clr: 'black'});

        show.forEach(item => {

            //its a string or an object
            if(!item.color){
                color = "black";
            }else{
                color = item.color;
                item = item.val;
            }

            this.cavDrawText(ctx, {text:item , x: 10, y: (30 * line) + 30, clr: item.color});
            line++;
        });
    }

    //make sure next part is drawn in the next canvas
    //section
    section++;
    line = 1;
    var step1 = newest_steps[0];
    var show = step1.show;
    this.cavDrawText(ctx, {text:"step "+this.steps.length,x: 10,y: (section * 200)+30, clr: "black"});

    show.forEach(item => {

        //its a string or an object
        if(!item.color){
            color = "black";
        }else{
            color = item.color;
            item = item.val;
        }

        this.cavDrawText(ctx, {text:item , x: 10, y: (line * 30)+(section * 200)+30, clr: item.color});
        line++;
    });

  }

  //process to show visual representation of state
  showGraph(){

    var canvas : any = document.getElementById("algo_raster");
    var ctx = canvas.getContext("2d");

    var lines = this.steps[this.steps.length - 1].graph.lines;
    for(var l = 0; l < lines.length; l++){
        
        this.cavDrawLine(ctx, {x: lines[l].to.x,y: lines[l].to.y,
            x_to: lines[l].from.x, y_to: lines[l].from.y, clr: 'black'});

    }

    var dots = this.steps[this.steps.length - 1].graph.dots;
    for(var d = 0; d < dots.length; d++){
    
        this.cavDrawDot(ctx, {x: dots[d].x, y: dots[d].y , color: dots[d].color ,size: dots[d].size});

    }

    var rects = this.steps[this.steps.length - 1].graph.rects;
    for(var s = 0; s < rects.length; s++){

        this.cavDrawSquare(ctx, {x: rects[s].x, y: rects[s].y,
             sizex: rects[s].sizex, sizey: rects[s].sizey, color: rects[s].color});

    }

    var text = this.steps[this.steps.length - 1].graph.text;
    for(var s = 0; s < text.length; s++){

        this.cavDrawText(ctx, {text:text[s].phrase , x: text[s].x,
            size: text[s].size+"px Arial",  y: text[s].y, clr: text[s].color});

    }

  }

  //======generic canvas helper functions 
  cavDrawLine(ctx: any, data: any){

    ctx.fillStyle = data.clr;
    ctx.beginPath();
    ctx.moveTo(data.x,data.y);
    ctx.lineTo(data.x_to,data.y_to);
    ctx.stroke();

    //fixes canvas style applying bug
    ctx.beginPath();
    ctx.closePath();

  }

  cavDrawDot(ctx: any, data: any){

    ctx.beginPath();
    ctx.fillStyle = data.color;        
    ctx.arc(data.x,data.y,data.size,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();

    //fixes canvas style applying bug
    ctx.beginPath();
    ctx.closePath();

  }

  cavDrawSquare(ctx: any, data: any){
    ctx.fillStyle = data.color;
    ctx.rect(data.x,data.y,data.sizex,data.sizey);
    ctx.fill();

    //fixes canvas style applying bug
    ctx.beginPath();
    ctx.closePath();
  }


  cavDrawText(ctx: any, data: any){
    
    if(data.size){
        ctx.font = data.size+"px Arial";
    }else{
        ctx.font = "20px Arial";    
    }

    ctx.fillStyle = data.clr;
    ctx.fillText(data.text,data.x,data.y);

  }


}