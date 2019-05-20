/****
    This is a very general structure , a shell to take in 
    any algorithm and interface with the rest of the application
    by supplying different data representations and a way to step 
    through the algorithm
****/

type GenericAlgo = {
    algo: any;  //make algorithm calculations
    done: any;  //determine if algorithm is finished
    show: any; //show state data
    graph: any; //generate graph representation
}

export class Algodata {
    state : object = {}; //current process state
    context : object = {}; //environment
    processes : GenericAlgo = {
        show  : function(){},
        graph : function(){},
        algo  : function(){},
        done  : function(){}
    };

    constructor(state: object, processes: GenericAlgo, context: object ) { 
        this.state = state;
        this.processes = processes;
        this.context = context;
    }

    setState(state){
        this.state = state;
    }

    processState(){
        this.state = this.processes.algo(this.state, this.context);

        //generate state representation
        var res : any = {};
        res.show = this.processes.show(this.state, this.context);
        res.graph = this.processes.graph(this.state, this.context);

        return res;
    }

    isComplete(){
        return this.processes.done(this.state);
    }

}