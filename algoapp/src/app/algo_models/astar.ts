import { Algodata } from './algodata';


//***********
// helper functions
//***********

//build the path that has currently been traveled with no duplicates
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
    var id = 'r' + item.row + 'c' + item.col;
    return (set[id]);
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

    //remove obstacles form list
    var no_obstacles = [];
    res.forEach(function(item){
        if(!obstacles[item.row+""+item.col]){
            no_obstacles.push(item);
        }
    });
    
    return no_obstacles;
}

//get the cell with the lowest cost estimate to the goal
var lowestF = function(openset, goal){
    
    var minval = 100000;//a generic bounding value 
    var current_val;
    var res :any = {};

    openset.forEach(function(item){
        //calculate cost for the current item
        current_val = heuristicCostEstimate(item, goal);

        //if smallest value then make this the cell
        if(minval > current_val){
            minval = current_val;
            res = item;
        }
    });

    return res;
}

//remove an item from the set
var removeFromSet = function(set, remove_item){

    var res = [];
    set.forEach(function(item){
        if(!(item.row == remove_item.row && item.col == remove_item.col)){
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




//***********
// algo context/environment
//***********
var astar_env : any = {};
astar_env.columns = 14;
astar_env.rows = 14;
astar_env.goal = {row: 10, col: 12};
astar_env.start = {row: 0, col: 0};
astar_env.obstacles = [];
astar_env.obstacles.push({row: 3, col: 8});
astar_env.obstacles.push({row: 4, col: 8});
astar_env.obstacles.push({row: 5, col: 8});
astar_env.obstacles.push({row: 6, col: 8});
astar_env.obstacles.push({row: 7, col: 8});
astar_env.obstacles.push({row: 8, col: 8});

//format obstacle data for the check system
astar_env.obstacles_check = {};
astar_env.obstacles.forEach(function(item){
    astar_env.obstacles_check[item.row+''+item.col]=true;
});




//***********
// Algo Core
//***********
var astar : any = {};

astar.algo = function(data, context){

    //graph is a set of nodes and a set of verticies
    var open = data.open;
    var closed = data.closed;
    var goal = context.goal;
    var cameFrom = data.cameFrom;
    var gScoreSet = data.gScoreSet;
    var fScoreSet = data.fScoreSet;
    var done = false;

    //no open cells, only do for first run
    if(open.length == 0){
        var start = context.start;
        open.push(start);
        gScoreSet['r'+start.row+'c'+start.col] = 0;
        fScoreSet['r'+start.row+'c'+start.col] = heuristicCostEstimate(start, goal);        
    }

   
    //if cell with lowest estimate is the goal then we are done
    var current = lowestF(open, goal);

    if(current.row == goal.row && current.col == goal.col){
        res = reconstructPath(cameFrom, current);

        //end the loop
        done = true;
    }else{

        //remove from visited set and add to closed set
        //so we dont attempt to revisit
        open = removeFromSet(open, current);
        closed = addToSet(closed, current);

        //get neighbors of currently visited cell
        var neighbors = getNeighbors(current,context);
        neighbors.forEach(function(cell){

            //if it is in the closed set then we do not want to 
            //estimate the score again
            if(!isInSet(closed, cell)){

                var cell_id = 'r'+cell.row+'c'+cell.col;
                var gScore = gScoreSet['r'+current.row+'c'+current.col] + 1;

                if(!isInSet(open, cell)){

                   open =  addToSet(open, cell);

                }else if(gScoreSet[cell_id] && (gScore >= gScoreSet[cell_id])){

                    //do nothing , seems like going back to a previous neighbor
                    //TODO: confusing part of algorithm as removing this part does nothing
                    //should investigate
                }

                //either gScore has not been set for this neighbor or 
                //it is a value that seems to be efficient, store it
                if(!gScoreSet[cell_id] || (gScore < gScoreSet[cell_id])){
                    cameFrom[cell_id] = current;
                    gScoreSet[cell_id] = gScore;
                    fScoreSet[cell_id] = gScoreSet[cell_id] + heuristicCostEstimate(cell, goal);
                }
            }
        });

    }

    //build and return new state
    var res : any = {};
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
    return data.done;
}

astar.graph = function(data,context){
    //graph 400 x 700
    var x_start = 400;
    var x_end = 680;
    var y_start = 50;
    var y_end = 330;

    //result sets
    var lines = [];
    var dots = [];
    var squares = [];
    var text = [];

    //grid , vertical and horizontal lines
    var columns = context.columns;
    var rows = context.rows;

    var line_obj = {};
    for(var c = 0; c <= columns; c++){
        line_obj = {to: {x: x_start + (c * 20), y: y_start},
                    from: {x: x_start + (c * 20), y: y_end}
                    };
        lines.push(line_obj);
    }

    for(var r = 0; r <= rows; r++){
        line_obj = {to: {x: x_start, y: y_start + (r * 20)},
                    from: {x: x_end, y: y_start + (r * 20)}
                    };
        lines.push(line_obj);
    }

    //circles representing position
    var dot_x_offset = 10 + x_start;
    var dot_y_offset = 10 + y_start;
    
    //open
    data.open.forEach(function(item){
        dots.push({x: (dot_x_offset + (item.col*20)), 
                y: ( dot_y_offset + (item.row*20)), 
                size: 8, 
                color: 'green'});
    });

    //path
    data.path.forEach(function(item){
        dots.push({x: (dot_x_offset + (item.col*20)), 
                    y: ( dot_y_offset + (item.row*20)),
                    size: 8, 
                    color: 'black'});
    });

    //goal
    dots.push({x: (dot_x_offset + (context.goal.col*20)), 
                y: ( dot_y_offset + (context.goal.row*20)), 
                size: 8, 
                color: 'blue'});

    //obstacles
    var obc_x_offset = 1 + x_start;
    var obc_y_offset = 1 + y_start;
    var obstacles = context.obstacles;
    obstacles.forEach(function(item){
        squares.push({x: obc_x_offset+(20*item.col),
                    y: obc_y_offset+(20*item.row), 
                    sizex: 17,
                    sizey: 17, 
                    color: 'red'});
    });

    //grid key
    for(var c = 0; c < columns; c++){
        text.push({phrase: c, x: 400 + (c * 20) , y: 40 , size: 12, color: 'black'});
    }

    for(var r = 0; r < rows; r++){
        text.push({phrase: r, x: 380 , y: 65 + (r * 20) , size: 12, color: 'black'});
    }

    return {dots: dots, lines: lines, rects: squares, text: text};
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



//encapsulate specific context and process
var astar_process =  new Algodata({},astar,astar_env);
export {astar_process}