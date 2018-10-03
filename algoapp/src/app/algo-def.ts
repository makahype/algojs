import { Algo } from './algo';
//import { test } from './algo_models/test';
import { quicksort } from './algo_models/quicksort';
import { astar } from './algo_models/astar';

//    new Algo(1 ,"Add two",test, {input: [2,4]}),
export const ALGOS: Algo[] = [
    new Algo( 2 , "Quick Sort", quicksort, {input: [[20,64,2,4,1,8,53,25,18,19]]}),
    new Algo( 3 , "A*", astar, {open:[], closed:[], cameFrom: {}, init: true,gScoreSet:[] ,fScoreSet:{}})
];



