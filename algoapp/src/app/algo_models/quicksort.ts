import { Algodata } from './algodata';


var quicksort = {};
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

        rects.push({x: 420, y: 20 + (line * 15), sizex: (Number.parseInt(item) * 3) , sizey: 10, color: 'blue'});
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


quicksort.algo = function(data, context){
    
    //deep cloning arrays of arrays to remove reference
    var partitions = [];
    for(var i=0; i < data.input.length; i++){
        partitions.push(data.input[i].concat([]));
    }
    
    //record the swaps that occured
    var swaps = [];

    
    var res_arr = [];
    var end = true;
    for(var i = 0; i < partitions.length; i++){

        //no need to step through array if 
        //it only has one value
        if(partitions[i].length > 1){

            if(partitions[i].length == 2){
                
                //seems that below process will not work for
                //array of length two , should try to implement
                // more general solution
                if(partitions[i][0] > partitions[i][1]){

                    swaps.push(partitions[i][0]+' -> '+partitions[i][1]);

                    var hold = partitions[i][0];
                    partitions[i][0] = partitions[i][1];
                    partitions[i][1] = hold;
                    
                    //swap occured not done
                    end = false;
                }

                res_arr.push(partitions[i]);

            }else{

                //first in array is the pivot point
                var pivot = partitions[i][0];
                var arr_len = partitions[i].length;
                var leftmark = 1;
                var rightmark = arr_len - 1;
                var creating_partition = true;

                //move the pointers
                while(creating_partition){

                    //swap occured not done
                    end = false;

                    //condition for comparing and moving markers
                    while(leftmark <= rightmark && partitions[i][leftmark] <= pivot){
                        leftmark = leftmark + 1;
                    }

                    while(partitions[i][rightmark] >= pivot && rightmark >= leftmark){
                        rightmark = rightmark - 1;
                    }

                    //if marks cross then end process
                    if(rightmark < leftmark){

                        creating_partition = false;
                        swaps.push('(pivot '+pivot+') ');

                        //place pivot in correct location
                        partitions[i][0] = partitions[i][rightmark];
                        partitions[i][rightmark] = pivot;

                    }else{
                        swaps.push(partitions[i][leftmark]+' -> '+partitions[i][rightmark]);

                        //swap based on above comparison
                        var hold = partitions[i][leftmark];
                        partitions[i][leftmark] = partitions[i][rightmark];
                        partitions[i][rightmark] = hold;
                    }
                }

                //prepare for next partitioning
                res_arr.push(partitions[i].slice(0, rightmark));
                res_arr.push([partitions[i][rightmark]]);
                res_arr.push(partitions[i].slice(rightmark+1));
            }
        }else{
           res_arr.push(partitions[i]);
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

    //res.graph = quicksort_graph(res);
    res.swaps = swaps;
    res.end = end;

    //return current state
    return res;
}


quicksort.done = function(data){
    return data.end;
}

var quicksort_process =  new Algodata({},quicksort,{});
export {quicksort_process}