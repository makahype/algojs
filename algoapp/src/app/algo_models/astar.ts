var astar_graph = function(data){

    var columns = 7;
    var rows = 7;

    var lines = [];

    //setup grid as lines
    for(var c = 0; c < columns; c++){
        lines.push({to:{x: 400+ (c * 40), y: 50},
            from: {x: 400+ (c * 40), y: 350}});
    }

    for(var r = 0; r < rows; r++){
        lines.push({to:{x: 400, y: 50 + (r * 40)},
            from: {x: 680, y: 50 + (r * 40)}});
    }

    return {dots:[], lines:lines, squares:[]};
}

//build path
var reconstructPath = function(result_set, current){
    
    var res = [];
    var curr;
    var dups = {};


    for(var key in result_set){
        curr = result_set[key];
        
        //prevent duplicates
        if(!dups['r'+curr.row+'c'+curr.col]){
           res.push(curr);
           dups['r'+curr.row+'c'+curr.col] = true;
        }

    }
    
    //and place the goal at the end
    res.push(current);

    return res;
}


//eight way heuristic diagonal
var heuristicCostEstimate = function(curr, goal){

    var xval = Math.abs(curr.row - goal.row);
    var yval = Math.abs(curr.col - goal.col);

    if(xval > yval){
        return xval;
    }
    return yval;
}

//check if item is in the set
var isInSet = function(set, item){
    return (set['r'+item.row+'c'+item.col];
}

//get cells next to this cell
var getNeighbors = function(cell){
    //set default rows and columns
    var columns = 10;
    var rows = 8;

    var res = [];
    //create cell if in bounds then add to array
    if(cell.row + 1 < rows){
        res.push({row: cell.row + 1, col: cell.col});
    }
    
    if(cell.col + 1 < columns){
        res.push({row: cell.row , col: cell.col + 1});
    }

    if(cell.row - 1 >= 0){
        res.push({row: cell.row - 1, col: cell.col});
    }

    if(cell.col - 1 >= 0){
        res.push({row: cell.row, col: cell.col - 1});
    }

    //diagonals
    if((cell.row + 1 < rows) && (cell.col + 1 < columns)){
        res.push({row: cell.row + 1, col: cell.col + 1});
    }

    if((cell.row + 1 < rows) && (cell.col - 1 >= 0)){
        res.push({row: cell.row + 1, col: cell.col -1});
    }

    if((cell.row - 1 >= 0) && (cell.col + 1 < columns)){
        res.push({row: cell.row - 1, col: cell.col + 1});
    }

    if((cell.row - 1 >= 0) && (cell.col - 1 >= 0)){
        res.push({row: cell.row - 1, col: cell.col - 1});
    }

    return res;
}

//get the item with the lowest cost estimate to the goal
var lowestF = function(openset,goal){

    var minval = 100000;
    var res = openset[0];
    openset.forEach(function(item){
        if(minval > heuristicCostEstimate(item, goal)){
            minval = heuristicCostEstimate(item, goal);
            res = item;
        }
    });

    return res;
}

//remove an item from the set
var removeFromSet = function(set, remove_item){

    var res = [];
    set.forEach(function(item){
        if(item.row == remove_item.row && item.col == remove_item.col){
            //dont add
        }else{
           res.push(item);
        }
    });

    return res;
}

//add an item to the set
var addToSet = function(set, item){
    set.push(item);
    return set;
}


export function astar(data){


    //graph is a set of nodes and a set of verticies
    var columns = 10;
    var rows = 8;
    var obstacles = [[{row: 4, col: 7}, {row: 5, col:7}, {row: 6, col:7} ],
                [{row: 5 , col:10},{row: 5, col:11}],
                [{row: 2, col:4},{row: 2, col:5}]];


    var open = [];//data.input.open;
    var closed = [];//data.input.closed;
    var goal = {row: 7, col: 9};
    var start = {row: 0, col: 0};

    var cameFrom = {};
    var gScoreSet = {};
    var fScoreSet = {};
    open.push(start);

    var res = [];

    //initialize set for start point
    gScoreSet['r'+start.row+'c'+start.col] = 0;
    fScoreSet['r'+start.row+'c'+start.col] = heuristicCostEstimate(start, goal);
    
    while(open.length > 0){

        var current = lowestF(open, goal);
        if(current.row == goal.row && current.col == goal.col){
            res = reconstructPath(cameFrom, current);

            //end the loop
            open = [];
        }else{

            open = removeFromSet(open, current);
            closed = addToSet(closed, current);
            var neighbors = getNeighbors(current);

            neighbors.forEach(function(item){

                //if it is in the closed set then do nothing
                if(!isInSet(closed, item)){

                    var gScore = gScoreSet['r'+current.row+'c'+current.col] + 1;

                    if(!isInSet(open, item)){

                       open =  addToSet(open, item);

                    }else if(gScoreSet['r'+item.row+'c'+item.col] && (gScore >= gScoreSet['r'+item.row+'c'+item.col])){

                        //do nothing , seems like going back to a previous neighbor
                    }

                    //either gScore has not been set for this neighbor or 
                    //it is a value that seems to be efficient, store it
                    if(!gScoreSet['r'+item.row+'c'+item.col] || (gScore < gScoreSet['r'+item.row+'c'+item.col])){
                        cameFrom['r'+item.row+'c'+item.col] = current;
                        gScoreSet['r'+item.row+'c'+item.col] = gScore;
                        fScoreSet['r'+item.row+'c'+item.col] = gScoreSet['r'+item.row+'c'+item.col] + heuristicCostEstimate(item, goal);
                    }
                }
            });


        }
    }

    
    console.log(res);

    res.input =  res;
    res.graph = astar_graph(res);
    res.show = res; 

    //currently only one pass
    res.end = true;


    return res;
}