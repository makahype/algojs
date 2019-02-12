import { Algodata } from './algodata';


/* algorithim sub processes*/
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

    return yval + xval;
}

//check if item is in the set
var isInSet = function(set, item){
    return (set['r'+item.row+'c'+item.col]);
}

//get cells next to this cell
var getNeighbors = function(cell,context){

    //set default rows and columns
    var columns = context.columns;
    var rows = context.rows;
    var obstacles = context.obstacles_check;
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




/* algorithim context*/
var astar_config : any = {};
astar_config.columns = 14;
astar_config.rows = 14;
astar_config.goal = {row: 10, col: 12};
astar_config.start = {row: 0, col: 0};
astar_config.obstacles = [];
astar_config.obstacles.push({row: 3, col: 8});
astar_config.obstacles.push({row: 4, col: 8});
astar_config.obstacles.push({row: 5, col: 8});
astar_config.obstacles.push({row: 6, col: 8});
astar_config.obstacles.push({row: 7, col: 8});
astar_config.obstacles.push({row: 8, col: 8});

//generate obstacle data for different check system
astar_config.obstacles_check = {};
astar_config.obstacles.forEach(function(item){
    astar_config.obstacles_check[item.row+''+item.col]=true;
});




/* algorithim processes*/
var astar : any = {};

astar.graph = function(data,context){

    var columns = context.columns;
    var rows = context.rows;
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

    //open
    data.open.forEach(function(item){
        dots.push({x: (410 + (item.col*20)), y: ( 60 + (item.row*20)), size: 8, color: 'green'});
    });

    //path
    data.path.forEach(function(item){
        dots.push({x: (410 + (item.col*20)), y: ( 60 + (item.row*20)), size: 8, color: 'black'});
    });

    //goal
    dots.push({x: (410 + (context.goal.col*20)), y: ( 60 + (context.goal.row*20)), size: 8, color: 'blue'});

    var obstacles = context.obstacles;
    var squares = [];
    obstacles.forEach(function(item){
        squares.push({x: 401+(20*item.col), y: 51+(20*item.row), sizex: 17,sizey: 17, color: 'red'});
    });

    var text = [];
    for(var c = 0; c < columns; c++){
        text.push({phrase: c, x: 400 + (c * 20) , y: 40 , size: 12, color: 'black'});
    }

    for(var r = 0; r < rows; r++){
        text.push({phrase: r, x: 380 , y: 65 + (r * 20) , size: 12, color: 'black'});
    }

    return {dots:dots, lines:lines, rects:squares, text:text};
}

astar.show = function(data,context){
    var res = [];
    
    var row = '';
    var idx = 0;
    for( var key in data.fScoreSet){
        if(idx == 2){
            idx = 0;
            res.push(row);            
            row = key + ": " + data.fScoreSet[key] + ", ";
        }else{
            idx++;
            row = row + key + ": " + data.fScoreSet[key] + ", ";
        }
    }
    res.push(row);

    var res_fmt = res.slice(-3);
    res_fmt.unshift('row[val]column[val]: estimate score');
    return res_fmt;
}

astar.algo = function(data,context){

    //graph is a set of nodes and a set of verticies
    var open = data.open;
    var closed = data.closed;
    var goal = context.goal;
    var cameFrom = data.cameFrom;
    var gScoreSet = data.gScoreSet;
    var fScoreSet = data.fScoreSet;
    var done = false;

    //only do for first run
    //**TODO** add init function to all algorithms
    if(data.init){
        var start = context.start;
        open.push(start);
        gScoreSet['r'+start.row+'c'+start.col] = 0;
        fScoreSet['r'+start.row+'c'+start.col] = heuristicCostEstimate(start, goal);        
    }

    var res : any = [];
    
    if(open.length > 0){

        var current = lowestF(open, goal);
        if(current.row == goal.row && current.col == goal.col){
            res = reconstructPath(cameFrom, current);

            //end the loop
            open = [];
            done = true;
        }else{

            open = removeFromSet(open, current);
            closed = addToSet(closed, current);
            var neighbors = getNeighbors(current,context);

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

    res = {};
    res.path = reconstructPath(cameFrom, current);
    res.open = open;
    res.closed = closed;
    res.cameFrom = cameFrom;
    res.init = false;
    res.gScoreSet = gScoreSet;
    res.fScoreSet = fScoreSet;
    res.end = done;

    return res;
}

astar.done = function(data){
    return false;
}


var astar_process =  new Algodata({},astar,astar_config);
export {astar_process}