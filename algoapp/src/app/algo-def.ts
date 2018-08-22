
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

    var arr = data.input;
    var res_arr = [];
    for(var i = 0; i < arr.length; i++){

        if(arr[i].length > 1){

            if(arr[i].length == 2){

                if(arr[i][0] > arr[i][1]){

                    var hold = arr[i][0];
                    arr[i][0] = arr[i][1];
                    arr[i][1] = hold;
                }

                res_arr.push(arr[i]);

            }else{

                var pivot = arr[i][0];
                var arr_len = arr[i].length;

                var leftmark = 1
                var rightmark = arr_len - 1;

                //move the pointers
                var creating_partition = true;
                while(creating_partition){

                    while(leftmark <= rightmark && arr[i][leftmark] <= pivot){
                        leftmark = leftmark + 1;
                    }

                    while(arr[i][rightmark] >= pivot && rightmark >= leftmark){
                        rightmark = rightmark - 1;
                    }


                    if(rightmark < leftmark){

                        creating_partition = false;

                        //place pivot in correct location
                        arr[i][0] = arr[i][rightmark];
                        arr[i][rightmark] = pivot;

                    }else{

                        var hold = arr[i][leftmark];
                        arr[i][leftmark] = arr[i][rightmark];
                        arr[i][rightmark] = hold;

                    }
                }

                //prepare for next partitioning
                res_arr.push(arr[i].slice(0, rightmark));
                res_arr.push([arr[i][rightmark]]);
                res_arr.push(arr[i].slice(rightmark+1));
            }
        }else{
           res_arr.push(arr[i]);        
        }
    }

    var res = {};
    res.input = [];
    //remove empty arrays
    for(var i = 0; i < res_arr.length; i++){
        if(res_arr[i].length > 0){
            res.input.push(res_arr[i]);
        }
    }

    //format so its not too long
    var pivot_point = Math.floor(res.input.length/2);
    res.show = [];
    res.show.push(res.input.slice(0, pivot_point).concat());
    res.show.push(res.input[pivot_point]);
    res.show.push(res.input.slice(pivot_point+1).concat());


    return res;
}


export const ALGOS: Algo[] = [
    new Algo(1 ,"Add two",test, {input: [2,4]}),
    new Algo( 2 , "Quick Sort", quicksort, {input: [[20,64,2,4,1,8,53,25,18,19]]}),
];
