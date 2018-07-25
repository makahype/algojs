
import { Algo } from './algo';



/* define  algo functions here */

var test = function(step,data){

    var res = data;
    for(var i=0; i < data.length; i++){
        
        res[i] = data[i] + 2;
        if((step-1) == i){
            return res;
        }

    }

}


var quicksort = function(step,data){
    console.log('test');
}




export const ALGOS: Algo[] = [
    {id: 1 , name: "Add two", process: test, current:[2,4]},
    {id: 2 , name: "Quick Sort", process: quicksort, current:[2,4]},
];
