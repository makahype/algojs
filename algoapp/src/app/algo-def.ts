
import { Algo } from './algo';



/* define  algo functions here */

var test = function(data){

    var res = {};

    if(data.curr != 0 && !data.curr) {
        res.curr = 0;
    } else {
        res.curr = data.curr + 1;
    }
    
    res.input = [];
    data.input.forEach(function(item,idx){
        res.input.push(item);
    });

    res.input[res.curr] = res.input[res.curr] + 2;
    res.show = [res.input];

    return res;
}


var quicksort = function(data){
    console.log('test');
}




export const ALGOS: Algo[] = [
    new Algo(1 ,"Add two",test, {input: [2,4]}),
    new Algo( 2 , "Quick Sort", quicksort, {input: [2,4]}),
];
