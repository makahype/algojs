import { Algodata } from './algodata';

//***********
// helper functions
//***********

var deep_clone = function(data){

    var partitions = [];
    for(var i=0; i < data.input.length; i++){
        partitions.push(data.input[i].concat([]));
    }

    return partitions;

}

//perform a simple swap updating result
var simple_swap = function(partition, swaps, res_arr){

   var res_end = true;

   if(partition[0] > partition[1]){

        swaps.push(partition[0]+' -> '+partition[1]);
        partition = partition.reverse();

        res_end = false; //swap occured not done
    }

    res_arr.push(partition);
    return res_end;

}


//perform a swap that requires selecting a piviot and creating
//a new partition
var complex_swap = function(partition, swaps, res_arr ){

    var pivot = partition[0];//first in array is the pivot point
    var arr_len = partition.length;
    var leftmark = 1;
    var rightmark = arr_len - 1;
    var creating_partition = true;
    var res_end = true;

    //move the pointers
    while(creating_partition){

        //swap occured not done
        res_end = false;

        //condition for comparing and moving markers
        while(leftmark <= rightmark && partition[leftmark] <= pivot){
            leftmark = leftmark + 1;
        }

        while(partition[rightmark] >= pivot && rightmark >= leftmark){
            rightmark = rightmark - 1;
        }

        //if marks cross then end process
        if(rightmark < leftmark){

            //place pivot in correct location
            partition[0] = partition[rightmark];
            partition[rightmark] = pivot;

            creating_partition = false;
            swaps.push('(pivot '+pivot+') ');

        }else{
            swaps.push(partition[leftmark]+' -> '+partition[rightmark]);

            //swap based on above comparison
            var hold = partition[leftmark];
            partition[leftmark] = partition[rightmark];
            partition[rightmark] = hold;
        }
    }

    //prepare for next partitioning
    res_arr.push(partition.slice(0, rightmark));
    res_arr.push([partition[rightmark]]);
    res_arr.push(partition.slice(rightmark+1));

    return res_end;
}


//***********
// algo context/environment
//***********

//none


//***********
// Algo Core
//***********


var quicksort : any = {};

quicksort.algo = function(data, context){
    
    //deep cloning arrays of arrays to remove reference edits
    var partitions = deep_clone(data);
    
    var swaps = [];//record the swaps that occured
    var res_arr = [];
    var res_obj : any = {};
    var end = true;

    for(var i = 0; i < partitions.length; i++){

        if(partitions[i].length <= 1){

           res_arr.push(partitions[i]);

        }else{

            //swap and update end status
            if(partitions[i].length == 2){

                end = simple_swap(partitions[i], swaps, res_arr);

            }else{

                end = complex_swap(partitions[i], swaps, res_arr);

            }
        }
    }

    res_obj.input = [];
    res_obj.swaps = swaps;
    res_obj.end = end;

    //do not keep empty arrays
    for(var i = 0; i < res_arr.length; i++){
        if(res_arr[i].length > 0){
            res_obj.input.push(res_arr[i]);
        }
    }

    return res_obj;
}


quicksort.show  = function(data, context){

    var res = [];
    var row = '';
    var idx = 0;
    data.swaps.forEach(function(item){
        if(idx == 3){
            idx = 0;
            res.push(row);
            row = item;
        }else{
            idx++;
            row = row + item + ", ";
        }
    });
    res.push(row);
    return res;
}

quicksort.graph = function(data, context){

    var rects_items = [];
    data.input.forEach(function(item, idx){
        rects_items = rects_items.concat(item);
    });

    var rects = [];
    var line = 0;
    rects_items.forEach(function(item, idx){

        //if this is a time that the value becomes a pivot
        //display it at green
        if( data.swaps.includes('(pivot '+item+') ')){
            var color = 'green';
        }else{
            var color = 'blue';
        }

        rects.push({x: 420, y: 20 + (line * 15), sizex: (Number.parseInt(item) * 3) , sizey: 10, color: color});

        line++;
    });


    var text = [];
    line = 0;
    rects_items.forEach(function(item, idx){

        text.push({phrase: item, x: 400, y: 30 + (line * 15), size: 12,  color: 'black'});
        line++;
    });    

    return {dots:[], lines:[], rects: rects, text:text};
}


quicksort.done = function(data){
    return data.end;
}

//encapsulate specific context and process
var quicksort_process =  new Algodata({},quicksort,{});
export {quicksort_process}