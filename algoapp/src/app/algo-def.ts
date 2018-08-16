
import { Algo } from './algo';



/* define  algo functions here */

var test = function(data){

    var val = data.input;
    if(!data.curr) {
        data.curr = 0
    } else {
        data.curr = data.curr + 1;
    }

    data.input[data.curr] = data.input[data.curr] + 2; 
    data.show = [data.input];

    return data;
}


var quicksort = function(data){
    console.log('test');
}




export const ALGOS: Algo[] = [
    new Algo(1 ,"Add two",test, {input: [2,4]}),
    new Algo( 2 , "Quick Sort", quicksort, {input: [2,4]}),
];
