import { Algo } from './algo';
import { quicksort_process } from './algo_models/quicksort';
import { astar_process } from './algo_models/astar';

export const ALGOS: Algo[] = [
    new Algo( 2 , "Quick Sort", quicksort_process, {input: [[20,64,22,4,42,8,53,25,2,10,14,32,19,38,50,27,9,45]]}),
    new Algo( 3 , "A*", astar_process, {open:[], closed:[], cameFrom: {}, gScoreSet:[] ,fScoreSet:{}})
];
