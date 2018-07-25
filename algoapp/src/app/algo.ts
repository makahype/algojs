export class Algo {
  id: number;
  name: string;
  process: object;
  current: object;
  step: 0;

  showCurrent(){    
    var res = this.process(this.step,this.current); 
    this.current = res;
    this.visualize(res);
  }

  next(){
    this.step = this.step + 1;
  }

  visualize(data) {
    console.log(data);
  }
  

}