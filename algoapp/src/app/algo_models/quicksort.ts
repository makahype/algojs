

var quicksort_graph = function(data){

    var rects_items = [];
    data.input.forEach(function(item, idx){
        rects_items = rects_items.concat(item);
    });

    var rects = [];
    var line = 0;
    rects_items.forEach(function(item, idx){

        rects.push({x: 410, y: 60 + (line * 15), sizex: (Number.parseInt(item) * 3) , sizey: 10, color: 'blue'});
        line++;
    });    

    return {dots:[], lines:[], rects: rects};
}

export function quicksort(data){
    
    //deep cloning arrays of arrays to remove reference
    var partitions = [];
    for(var i=0; i < data.input.length; i++){
        partitions.push(data.input[i].concat([]));
    }
    
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

                        //place pivot in correct location
                        partitions[i][0] = partitions[i][rightmark];
                        partitions[i][rightmark] = pivot;

                    }else{
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

    //format so its not too long
    var show_arr = [];
    res.input.forEach(function(item, idx){
        show_arr = show_arr.concat(item);
    });
    var pivot_point = Math.floor(show_arr.length/2);

    res.graph = quicksort_graph(res);

    //always display current middle number as global pivot point
    res.show = [];
    res.show.push(show_arr.slice(0, pivot_point));
    res.show.push({color: 'green', val: show_arr[pivot_point]});
    res.show.push(show_arr.slice(pivot_point+1));

    res.end = end;

    //return current state
    return res;
}