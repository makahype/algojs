export class Algo {
  id: number;
  name: string;
  process: object;
  start: object;
  steps = [];
  end = false;

  constructor(id: number, name: string, process: object, start: object ) { 
    this.id = id;
    this.name = name;
    this.process = process;
    this.start = start;
    this.end = false;
  }

  isDone(){
    return this.end;
  }

  next() {

    //either use data from last process run or use the
    //start data set
    if(this.steps.length > 0){
        var last = this.steps[this.steps.length - 1];
    }else{
        var last = this.start;
    }
    
    //run the process for one step and 
    //store the result
    var res = this.process(last);
    this.end = res.end;
    this.steps.push(res);

    //display current state
    this.visualize();
  }

  clear(){
    this.steps = [];
  }

  visualize() {
    this.showStructure();
    this.showGraph();
  }

  //process to display data structure and data
  showStructure() {

    var canvas = document.getElementById("algo_raster");
    var ctx = canvas.getContext("2d");

    //clear for new input
    ctx.clearRect(0,0,700,600);

    //draw dividing line
    ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(350,200);
    ctx.stroke();
    ctx.font = "20px Arial";

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
    
    //**TODO** standardize visual api for graph representation
    //of algorithm

    //var last_graph = this.steps[this.steps.length-1].graph;
    //var canvas = document.getElementById("algo_raster");
    //var ctx = canvas.getContext("2d");
    //ctx.beginPath();
    //ctx.arc(450,100,50,0,2*Math.PI);
    //ctx.stroke();

    //for(var d = 0; d < last_graph.dots.length; d++){
    //}



    var canvas = document.getElementById("algo_raster");
    var ctx = canvas.getContext("2d");

    var lines = this.steps[this.steps.length - 1].graph.lines;
    console.log(lines);


    for(var l = 0; l < lines.length; l++){

        ctx.beginPath();
        ctx.moveTo(lines[l].to.x,lines[l].to.y);
        ctx.lineTo(lines[l].from.x,lines[l].from.y);
        ctx.stroke();
        
    }


  }

}