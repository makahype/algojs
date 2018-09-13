var astar_config = {};
astar_config.columns = 14;
astar_config.rows = 14;
astar_config.goal = {row: 10, col: 12};
astar_config.start = {row: 0, col: 0};
astar_config.obstacles = [];
astar_config.obstacles.push({row: 3, col: 8});
astar_config.obstacles.push({row: 4, col: 8});
astar_config.obstacles.push({row: 5, col: 8});
astar_config.obstacles.push({row: 6, col: 8});

astar_config.obstacles_check = {};
astar_config.obstacles_check['38']=true;
astar_config.obstacles_check['48']=true;
astar_config.obstacles_check['58']=true;
astar_config.obstacles_check['68']=true;

var astar_graph = function(data){

    var columns = astar_config.columns;
    var rows = astar_config.rows;
    var lines = [];

    //setup grid as lines
    for(var c = 0; c <= columns; c++){
        lines.push({to:{x: 400+ (c * 20), y: 50},
            from: {x: 400+ (c * 20), y: 330}});
    }

    for(var r = 0; r <= rows; r++){
        lines.push({to:{x: 400, y: 50 + (r * 20)},
            from: {x: 680, y: 50 + (r * 20)}});
    }

    var dots = [];
    data.forEach(function(item){
        dots.push({x: (410 + (item.col*20)), y: ( 60 + (item.row*20)), size: 8, color: 'black'});
    });
    
    var obstacles = astar_config.obstacles;
    var squares = [];
    obstacles.forEach(function(item){
        squares.push({x: 401+(20*item.col), y: 51+(20*item.row), size: 17, color: 'red'});
    });

    return {dots:dots, lines:lines, squares:squares};
}

var astar_showstructure = function(data){
    var res = [];
    data.forEach(function(item){
        res.push('row:'+item.row+" column:"+item.col);
    });
    return res;
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
    var columns = astar_config.columns;
    var rows = astar_config.rows;
    var obstacles = astar_config.obstacles_check;
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

    //remove obstacles
    var no_obstacles = [];
    res.forEach(function(item){
        if(obstacles[item.row+""+item.col]){
            //dont add it to the result 
            //is a cell with an obstacle
        }else{
            no_obstacles.push(item);
        }
    });
    
    return no_obstacles;
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
    var open = [];
    var closed = [];
    var goal = astar_config.goal;
    var start = astar_config.start;
    var cameFrom = {};
    var gScoreSet = {};
    var fScoreSet = {};

    open.push(start);
    gScoreSet['r'+start.row+'c'+start.col] = 0;
    fScoreSet['r'+start.row+'c'+start.col] = heuristicCostEstimate(start, goal);
    var res = [];
    
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

    res.input =  res;
    res.graph = astar_graph(res);
    res.show = astar_showstructure(res);

    //**TODO**currently only one pass
    res.end = true;

    return res;
}