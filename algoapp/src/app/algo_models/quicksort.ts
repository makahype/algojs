
export function quicksort(data){

    
    //deep cloning arrays of arrays to remove reference
    var arr = [];
    for(var i=0; i < data.input.length; i++){
        arr.push(data.input[i].concat([]));
    }


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

                var leftmark = 1;
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
    var show_arr = [];
    res.input.forEach(function(item, idx){
        show_arr = show_arr.concat(item);
    });
    var pivot_point = Math.floor(show_arr.length/2);




    res.show = [];
    res.show.push(show_arr.slice(0, pivot_point));
    res.show.push({color: 'green', val: show_arr[pivot_point]});
    res.show.push(show_arr.slice(pivot_point+1));


    return res;
}