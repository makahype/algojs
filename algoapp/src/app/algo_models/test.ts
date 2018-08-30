
export function test(data){

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