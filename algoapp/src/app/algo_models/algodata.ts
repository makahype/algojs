export class Algodata {
    state = {};
    processes : any = {
            show  :function(){},
            graph :function(){},
            algo  : function(){}
    };
    context = {};

    constructor(state: object, processes: object, context: object ) { 
        this.state = state;
        this.processes = processes;
        this.context = context;
    }

    setState(state){
        this.state = state;
    }

    processState(){
        this.state = this.processes.algo(this.state, this.context);

        var res : any = {};
        res.show = this.processes.show(this.state, this.context);
        res.graph = this.processes.graph(this.state, this.context);
        return res;
    }

    isComplete(){
        return this.processes.done(this.state);
    }

}