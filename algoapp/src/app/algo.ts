export class Algo {
  id: number;
  name: string;
  process: object;
  start: object;
  steps = [];

  constructor(id: number, name: string, process: object, start: object ) { 
    this.id = id;
    this.name = name;
    this.process = process;
    this.start = start;
  }

  next() {
    var last = this.start;
    if(this.steps.length > 0){
        last = this.steps[this.steps.length - 1];
    }

    var res = this.process(last);
    this.steps.push(res);

    this.visualize();
  }

  clear(){
    this.steps = [];
  }

  visualize() {

    var canvas = document.getElementById("algo_raster");
    var ctx = canvas.getContext("2d");

    //clear for new input
    ctx.clearRect(0,0,700,600);


    //draw dividing line
    ctx.beginPath();
    ctx.moveTo(0,200);
    ctx.lineTo(650,200);
    ctx.stroke();

    ctx.font = "20px Arial";
    var section = 0;

    if(this.steps.length >= 2){

        var step1 = this.steps[this.steps.length - 2];
        var show = step1.show;
        ctx.fillText("step "+(this.steps.length-1),10,30);

        var line = 1;
        show.forEach(function(item){
            ctx.fillText(item,10,30+line * 30);
            line++;
        });

        //make sure next part is drawn in the next canvas
        //section
        section++;
    }

    var step2 = this.steps[this.steps.length - 1];        
    var show = step2.show;
    ctx.fillText("step "+this.steps.length,10,(section * 200)+30);

    var line = 1;
    show.forEach(function(item){            
        ctx.fillText(item,10,(line * 30)+(section * 200)+30);
        line++;
    });



  }
  

}