
// world is a 2d array of integers (eg world[10][15] = 0)
// pathStart and pathEnd are arrays like [5,10]
function findPath(world, pathStart, pathEnd)
{
	// shortcuts for speed
    /*
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;
    */

	// the world data are integers:
	// anything higher than this number is considered blocked
	// this is handy is you use numbered sprites, more than one
	// of which is walkable road, grass, mud, etc
	var maxWalkableTileNum = 0;

	// keep track of the world dimensions
    // Note that this A-star implementation expects the world array to be square: 
	// it must have equal height and width. If your game world is rectangular, 
	// just fill the array with dummy values to pad the empty space.
	var worldWidth = world[0].length;
	var worldHeight = world.length;
	var worldSize =	worldWidth * worldHeight;

	// which heuristic should we use?
	// default: no diagonals (Manhattan)
	var distanceFunction = ManhattanDistance;
	var findNeighbours = function(){}; // empty

	/*

	// alternate heuristics, depending on your game:

	// diagonals allowed but no sqeezing through cracks:
	var distanceFunction = DiagonalDistance;
	var findNeighbours = DiagonalNeighbours;

	// diagonals and squeezing through cracks allowed:
	var distanceFunction = DiagonalDistance;
	var findNeighbours = DiagonalNeighboursFree;

	// euclidean but no squeezing through cracks:
	var distanceFunction = EuclideanDistance;
	var findNeighbours = DiagonalNeighbours;

	// euclidean and squeezing through cracks allowed:
	var distanceFunction = EuclideanDistance;
	var findNeighbours = DiagonalNeighboursFree;

	*/

	// distanceFunction functions
	// these return how far away a point is to another

	function ManhattanDistance(Point, Goal)
	{	// linear movement - no diagonals - just cardinal directions (NSEW)
		return Math.abs(Point.x - Goal.x) + Math.abs(Point.y - Goal.y);
	}

	function DiagonalDistance(Point, Goal)
	{	// diagonal movement - assumes diag dist is 1, same as cardinals
		return Math.max( Math.abs(Point.x - Goal.x), Math.abs(Point.y - Goal.y));
	}

	function EuclideanDistance(Point, Goal)
	{	// diagonals are considered a little farther than cardinal directions
		// diagonal movement using Euclide (AC = sqrt(AB^2 + BC^2))
		// where AB = x2 - x1 and BC = y2 - y1 and AC will be [x3, y3]
		return Math.sqrt( Math.pow(Point.x - Goal.x, 2) + Math.pow(Point.y - Goal.y, 2));
	}

	// Neighbours functions, used by findNeighbours function
	// to locate adjacent available cells that aren't blocked

	// Returns every available North, South, East or West
	// cell that is empty. No diagonals,
	// unless distanceFunction function is not Manhattan
	function Neighbours(x, y)
	{
		var	N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < worldHeight && canWalkHere(x, S),
		myE = E < worldWidth && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
		if(myN)
		result.push({x:x, y:N});
		if(myE)
		result.push({x:E, y:y});
		if(myS)
		result.push({x:x, y:S});
		if(myW)
		result.push({x:W, y:y});
		findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
		return result;
	}

	// returns every available North East, South East,
	// South West or North West cell - no squeezing through
	// "cracks" between two diagonals
	function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result)
	{
		if(myN)
		{
			if(myE && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myW && canWalkHere(W, N))
			result.push({x:W, y:N});
		}
		if(myS)
		{
			if(myE && canWalkHere(E, S))
			result.push({x:E, y:S});
			if(myW && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	// returns every available North East, South East,
	// South West or North West cell including the times that
	// you would be squeezing through a "crack"
	function DiagonalNeighboursFree(myN, myS, myE, myW, N, S, E, W, result)
	{
		myN = N > -1;
		myS = S < worldHeight;
		myE = E < worldWidth;
		myW = W > -1;
		if(myE)
		{
			if(myN && canWalkHere(E, N))
			result.push({x:E, y:N});
			if(myS && canWalkHere(E, S))
			result.push({x:E, y:S});
		}
		if(myW)
		{
			if(myN && canWalkHere(W, N))
			result.push({x:W, y:N});
			if(myS && canWalkHere(W, S))
			result.push({x:W, y:S});
		}
	}

	// returns boolean value (world cell is available and open)
	function canWalkHere(x, y)
	{
		return ((world[y] != null) &&
			(world[y][x] != null) &&
			(world[y][x] <= maxWalkableTileNum));
	};

	// Node function, returns a new object with Node properties
	// Used in the calculatePath function to store route costs, etc.
	function Node(Parent, Point)
	{
		var newNode = {
			// pointer to another Node object
			Parent:Parent,
			// array index of this Node in the world linear array
			value:Point.x + (Point.y * worldWidth),
			// the location coordinates of this Node
			x:Point.x,
			y:Point.y,
			// the heuristic estimated cost
			// of an entire path using this node
			f:0,
			// the distanceFunction cost to get
			// from the starting point to this node
			g:0
		};

		return newNode;
	}

	// Path function, executes AStar algorithm operations
	function calculatePath()
	{
		// create Nodes from the Start and End x,y coordinates
		var	mypathStart = Node(null, {x:pathStart[0], y:pathStart[1]});
		var mypathEnd = Node(null, {x:pathEnd[0], y:pathEnd[1]});
		// create an array that will contain all world cells
		var AStar = new Array(worldSize);
		// list of currently open Nodes
		var Open = [mypathStart];
		// list of closed Nodes
		var Closed = [];
		// list of the final output array
		var result = [];
		// reference to a Node (that is nearby)
		var myNeighbours;
		// reference to a Node (that we are considering now)
		var myNode;
		// reference to a Node (that starts a path in question)
		var myPath;
		// temp integer variables used in the calculations
		var length, max, min, i, j;
		// iterate through the open list until none are left
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			// grab the next node and remove it from Open array
			myNode = Open.splice(min, 1)[0];
			// is it the destination node?
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push([myPath.x, myPath.y]);
				}
				while (myPath = myPath.Parent);
				// clear the working arrays
				AStar = Closed = Open = [];
				// we want to return start to finish
				result.reverse();
			}
			else // not the destination
			{
				// find which nearby nodes are walkable
				myNeighbours = Neighbours(myNode.x, myNode.y);
				// test each one that hasn't been tried already
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						// estimated cost of this particular route so far
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						// estimated cost of entire guessed route to the destination
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						// remember this new path for testing above
						Open.push(myPath);
						// mark this node in the world graph as visited
						AStar[myPath.value] = true;
					}
				}
				// remember this route as having no more untested options
				Closed.push(myNode);
			}
		} // keep iterating until the Open list is empty
		return result;
	}

	// actually calculate the a-star path!
	// this returns an array of coordinates
	// that is empty if no path is possible
	return calculatePath();

} // end of findPath() function








// ====================================================================================
//                                  HOW TO RUN THIS
// ====================================================================================
// Call:
// "node Client.js -h [host] -p [port] -k [key] -l [logFilename]"
//
// If no argument given, it'll be 127.0.0.1:3011
// key is a secret string that authenticate the bot identity
// it is not required when testing
// ====================================================================================
// ====================================================================================
//       THE CONSTANT. YOU'RE GONNA NEED THIS. MARK THIS FOR LATER REFERENCE
// ====================================================================================
var STATE_WAITING_FOR_PLAYERS = 0;
var STATE_TANK_PLACEMENT = 1;
var STATE_ACTION = 2;
var STATE_SUDDEN_DEATH = 3;
var STATE_FINISHED = 4;

var TEAM_1 = 1;
var TEAM_2 = 2;

var MAP_W = 22;
var MAP_H = 22;

var BLOCK_GROUND = 0;
var BLOCK_WATER = 1;
var BLOCK_HARD_OBSTACLE = 2;
var BLOCK_SOFT_OBSTACLE = 3;
var BLOCK_BASE = 4;

var BLOCK_TANK = 5;
var BLOCKS = ["BLOCK_GROUND", "BLOCK_WATER", "BLOCK_HARD_OBSTACLE", "BLOCK_SOFT_OBSTACLE", "BLOCK_BASE", "TANK", "block 6"];

var TANK_LIGHT = 1;
var TANK_MEDIUM = 2;
var TANK_HEAVY = 3;

var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 3;
var DIRECTION_LEFT = 4;

var DIRECTIONS = ["0", "DIRECTION_UP", "DIRECTION_RIGHT", "DIRECTION_DOWN", "DIRECTION_LEFT"];

var NUMBER_OF_TANK = 4;

var BASE_MAIN = 1;
var BASE_SIDE = 2;


var MATCH_RESULT_NOT_FINISH = 0;
var MATCH_RESULT_TEAM_1_WIN = 1;
var MATCH_RESULT_TEAM_2_WIN = 2;
var MATCH_RESULT_DRAW = 3;
var MATCH_RESULT_BAD_DRAW = 4;

var POWERUP_AIRSTRIKE = 1;
var POWERUP_EMP = 2;

//object sizes
var TANK_SIZE = 1;
var BASE_SIZE = 2;


// Init My Tank
$INITED = false;

// ====================================================================================
//                        BEHIND THE SCENE. YOU CAN SAFELY SKIP THIS
//                  Note: Don't try to modify this. It can ruin your life.
// ====================================================================================

// =============================================
// Get the host and port from argurment
// =============================================

// Logger
var Logger;
try
{
    Logger = require("./NodeWS/Logger");
}
catch (e)
{
    Logger = require("./../NodeWS/Logger");
}
var logger = new Logger();

var host = "127.0.0.1";
var port = 3011;
var key = 0;

for (var i = 0; i < process.argv.length; i++)
{
    if (process.argv[i] == "-h")
    {
        host = process.argv[i + 1];
    }
    else if (process.argv[i] == "-p")
    {
        port = process.argv[i + 1];
    }
    else if (process.argv[i] == "-k")
    {
        key = process.argv[i + 1];
    }
    else if (process.argv[i] == "-l")
    {
        logger.startLogfile(process.argv[i + 1]);
    }
}
if (host === null) host = "127.0.0.1";
if (port === null) port = 3011;
if (key === null) key = 0;

// =============================================
// Some helping function
// =============================================
var EncodeInt8 = function(number)
{
    var arr = new Int8Array(1);
    arr[0] = number;
    return String.fromCharCode(arr[0]);
};
var EncodeInt16 = function(number)
{
    var arr = new Int16Array(1);
    var char = new Int8Array(arr.buffer);
    arr[0] = number;
    return String.fromCharCode(char[0], char[1]);
};
var EncodeUInt8 = function(number)
{
    var arr = new Uint8Array(1);
    arr[0] = number;
    return String.fromCharCode(arr[0]);
};
var EncodeUInt16 = function(number)
{
    var arr = new Uint16Array(1);
    var char = new Uint8Array(arr.buffer);
    arr[0] = number;
    return String.fromCharCode(char[0], char[1]);
};
var EncodeFloat32 = function(number)
{
    var arr = new Float32Array(1);
    var char = new Uint8Array(arr.buffer);

    arr[0] = number;
    return String.fromCharCode(char[0], char[1], char[2], char[3]);
};
var DecodeInt8 = function(string, offset)
{
    var arr = new Int8Array(1);
    var char = new Int8Array(arr.buffer);
    arr[0] = string.charCodeAt(offset);
    return char[0];
};
var DecodeInt16 = function(string, offset)
{
    var arr = new Int16Array(1);
    var char = new Int8Array(arr.buffer);

    for (var i = 0; i < 2; ++i)
    {
        char[i] = string.charCodeAt(offset + i);
    }
    return arr[0];
};
var DecodeUInt8 = function(string, offset)
{
    return string.charCodeAt(offset);
};
var DecodeUInt16 = function(string, offset)
{
    var arr = new Uint16Array(1);
    var char = new Uint8Array(arr.buffer);

    for (var i = 0; i < 2; ++i)
    {
        char[i] = string.charCodeAt(offset + i);
    }
    return arr[0];
};
var DecodeFloat32 = function(string, offset)
{
    var arr = new Float32Array(1);
    var char = new Uint8Array(arr.buffer);

    for (var i = 0; i < 4; ++i)
    {
        char[i] = string.charCodeAt(offset + i);
    }
    return arr[0];
};

// =============================================
// Game objects
// =============================================


function printf(o)
{
    // hg
    //if(0)
    {
        //var d = new Date();
        //console.log("**** " + d.getMinutes() + ":" + d.getSeconds() + ", " + d.getMilliseconds());
        console.log(o);
    }
}

function GetDistance(point1, point2)
{
    return Math.hypot(point2[0] - point1[0], point2[1] - point1[1]);
}

function Obstacle()
{
    this.m_id = 0;
    this.m_x = 0;
    this.m_y = 0;
    this.m_HP = 0;
    this.m_destructible = true;
}

function Base()
{
    this.m_id = 0;
    this.m_team = 0;
    this.m_type = 0;
    this.m_HP = 0;
    this.m_x = 0;
    this.m_y = 0;
}

function Block(x , y , block_type)
{
    this.x = x || 0;
    this.y = y || 0;
    this.type = block_type || BLOCK_GROUND;
}


function fixNumber(x)
{
        // Round up on a square, because, in javascript, sometimes:
        // 0.2 + 0.2 + 0.2 + 0.2 + 0.2 = 0.9999999...
        // Lol... ^^
        if (x % 1 < 0.05)
            x = (x >> 0);
        if (x % 1 > 0.95)
            x = (x >> 0) + 1;
        return x;
}



function Tank()
{
    this.m_id = 0;
    this.m_x = 0;
    this.m_y = 0;
    this.m_team = TEAM_1;
    this.m_type = TANK_LIGHT;
    this.m_HP = 0;
    this.m_direction = DIRECTION_UP;
    this.m_speed = 0;
    this.m_rateOfFire = 0;
    this.m_coolDown = 0;
    this.m_damage = 0;
    this.m_disabled = 0;
    
    //My Feild
    //this.path = [[1, 7], [6, 7], [6, 15]].reverse();
    this.path = [];
    this.busy = 0;
    this.inited = false;
    this.target = [];
    this.lastX = -1;
    this.lastY = -1;
    this.T = 0;
    
    var shooting = false;
    var moving = false;
    
    //Getter
    this.getX = function(){ return this.m_x; };
    this.getY = function(){ return this.m_y; };
    this.getTeam = function(){ return m_team; };
    this.getHP = function(){ return m_HP; };
    this.getDirection = function(){ return this.m_direction; };
    this.setDirection = function(dir){ this.m_direction = dir; };
    
    /* Send request to server */
    this.sendCommand = function()
    {
        // Store state before move
        this.lastX = this.m_x;
        this.lastY = this.m_y;
        
        //Send command to server
        CommandTank(this.m_id, this.m_direction, moving, shooting);
        
        //Reset
        shooting = false;
        moving   = false;
    };
    
    
    //
    this.goForward = function()
    {
        moving = true;
    };
    
    this.goBackward = function()
    {
        var L = [DIRECTION_UP, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_DOWN];
        this.setDirection(L.reverse()[L.indexOf(this.m_direction)]);
        moving = true;
    };
    
    this.getTileLeft = function()
    {
        return GetTileAt(this.m_x - 1, this.m_y, this.m_id);
    };
    
    this.getTileUp = function()
    {
        return GetTileAt(this.m_x, this.m_y - 1, this.m_id);
    };
    
    this.getTileRight = function()
    {
        return GetTileAt(this.m_x + 1, this.m_y, this.m_id);
    };
    
    this.getTileDown = function()
    {
        return GetTileAt(this.m_x, this.m_y + 1, this.m_id);
    };
    
    this.getTileForward = function()
    {
        if(this.m_direction === DIRECTION_LEFT)
        {
            return this.getTileLeft();
        }
        if(this.m_direction === DIRECTION_UP)
        {
            return this.getTileUp();
        }
        if(this.m_direction === DIRECTION_RIGHT)
        {
            return this.getTileRight();
        }
        if(this.m_direction === DIRECTION_DOWN)
        {
            return this.getTileDown();
        }
        return -1;
    };
    
    /* Look DIRECTION_UP to see something */
    this.lookLeft = function()
    {
        var tile;
        for(var i = this.m_x; i >= 0; i--)
        {
            tile = GetTileAt(i, this.m_y, this.m_id);
            if(tile !== BLOCK_GROUND)
            {
                break;
            }
        }
        return tile;
    };
    
    /* Look at Map top to see something */
    this.lookTop = function()
    {
        var tile;
        for(var j = this.m_y; j >= 0; j--)
        {
            tile = GetTileAt(this.m_x, j, this.m_id);
            if(tile != BLOCK_GROUND)
            {
                break;
            }
        }
        return tile;
    };
    
    /* Look at right to see something */
    this.lookRight = function()
    {
        var tile;
        for(var i = this.m_x; i < MAP_W; i++)
        {
            tile = GetTileAt(i, this.m_y, this.m_id);
            if(tile != BLOCK_GROUND)
            {
                break;
            }
        }
        return tile;
    }
    
    /* Look at Map Bottom to see something */
    this.lookBottom = function()
    {
        var tile;
        for(var j = this.m_y; j < MAP_H; j++)
        {
            tile = GetTileAt(this.m_x, j, this.m_id);
            if(tile != BLOCK_GROUND)
            {
                break;
            }
        }
        return tile;
    }
    
    /* Look at something forward */
    this.lookForward = function()
    {
        //printf("Direction: " + direction + ", " + DIRECTIONS[direction]);
        var d = this.m_direction % 4; // [left, top, right, bottom][d]
        //printf("d = " + d);
        var vertical = d%2;
        
        var tile, i, x0 = this.m_x + 0.5 | 0, y0 = this.m_y + 0.5 | 0;
        var begin = vertical ? y0 : x0;
        var end   = vertical ? MAP_H : MAP_W;

        
        //printf("vertical = " + vertical + ", For i = " + begin + ", delta =" + L[d][vertical]);
        for(i = begin; 0 <= i && i < end; i += [[-1, 0], [0, -1], [1, 0], [0, 1]][d][vertical])
        {
            tile = !vertical ? GetTileAt(i, y0, this.m_id) : GetTileAt(x0, i, this.m_id);
            //check for enemy tank

            //printf("tile[" + (vertical ? x0 : i) + "][" + (vertical ? i : y0) + "] = " + tile + ", " + BLOCKS[tile]);
            if(tile != BLOCK_GROUND)
            {
                break;
            }
        }
        return !vertical ? new Block( i, y0, tile) : new Block( x0, i, tile);
    };
    
    /* Whose is base ? */
    this.isMyBaseAt = function(x, y)
    {
        return (GetMyTeam() == TEAM_1 && x <= 11) || (GetMyTeam() == TEAM_2 && x >= 12);
    };
    
    // Chạy đến một trị trí cùng nằm trên một đường thẳng nằm ngang, hoặc thẳng đứng
    this.jumpTo = function(x, y)
    {
    	//Không làm gì nếu điểm đến là điểm đang đứng
        if((this.m_x == x && this.m_y == y))
        {
        	printf(">> Tank " + this.m_id + ": [x0, y0] == [x, y]. Skip to next point.");
            return false;
        }
        
        // Chia làm 2 đường thẳng nếu đường đi là đường chéo
        if( (x - this.m_x)*(y - this.m_y) != 0)
        {
            printf("\n");
            printf("View here: ");
            printf("path: ");
            printf(this.path);
            var p = this.path.pop();
            printf("Tank " + this.m_id + " is at [" + this.m_x + ", " + this.m_y + "]  to [" + x + ", " + y + "] ");
            printf(">> Split path: Tank" + this.m_id + " , p = [" + p.toString() + "]");
            if( this.CheckForCollision(this.m_x, p[1]))
            {
                this.path.push([p[0], p[1]]);
                this.path.push([this.m_x, p[1]]);
                printf("Path X selected.");
                printf(this.path);
            }
            else
            if( this.CheckForCollision(p[0], this.m_y))
            {
                this.path.push([p[0], p[1]]);
                this.path.push([p[0], this.m_y]);
                printf("Path Y selected.");
                printf(this.path);

            }
            else
            {
                this.path.push(p);
                printf("No path can be selected.");
            }
            printf("End view.\n");
            return;
        }
        
        
         
        //printf(this.m_x + "," + this.m_y + "," + this.lastX + "," + this.lastY + "\n");
        //Update path if tank can not move with old path
        //printf(`GetTileAt(${x}, ${y}) = ` + BLOCKS[GetTileAt(x, y)]);

        //calculate direction
        var dir = this.calcLineDirectionTo(x, y);

        if(dir > -1)
        {
            //if( this.m_id == 3)
            //printf("inside Tank " + this.m_id + " is at [" + this.m_x + ", " + this.m_y + "], and will jump to [" + x + ", " + y + "] ");
            this.setDirection(dir);
	        if(this.m_x >= 19 && this.m_id == 0)
	        {
	        	printf(">> Tank " + this.m_id + " calculate dir = " + DIRECTIONS[this.getDirection()]);
	    	}
            this.goForward();
        }
        else
        {
            printf(" >>> Tank " + this.m_id + " stop.");
            this.stop();
        }
        
        //var tile = this.getTileForward();
        if( this.m_id == 0)
        {
            printf(">>> Tank " + this.m_id + " is at [" + this.m_x + ", " + this.m_y + "], and will jump to [" + x + ", " + y + "] ");
        }
        //printf(`Tank${this.m_id}.getTileForward = ` + BLOCKS[this.getTileForward()] + ", dir=" + DIRECTIONS[this.m_direction]);
        
        
        
        
        // Move the tank to an imaginary position first
        var newX = this.m_x;
        var newY = this.m_y;
        var newPositionOK = false;
        if (this.m_direction == DIRECTION_UP)
        {
            newY = this.m_y - this.m_speed;
        }
        else if (this.m_direction == DIRECTION_DOWN)
        {
            newY = this.m_y + this.m_speed;
        }
        else if (this.m_direction == DIRECTION_LEFT)
        {
            newX = this.m_x - this.m_speed;
        }
        else if (this.m_direction == DIRECTION_RIGHT)
        {
            newX = this.m_x + this.m_speed;
        }


        newX = fixNumber(newX);
        newY = fixNumber(newY);

        // Check to see if that position is valid (no collision)
        newPositionOK = this.CheckForCollision(newX, newY) ;


        if( !(this.m_x == x && this.m_y == y) && !newPositionOK)
        {
            printf("Tank["+this.m_id+"] updated path because collision.");
            this.updatePath();
            printf(this.path);
        }
        
    };
    
    // Tính toán lại hướng cần di chuyển đến
    this.calcLineDirectionTo = function(x, y)
    {
        //calculate direction
        var dx = x - this.m_x;
        var dy = y - this.m_y;

        return dx > 0 ? DIRECTION_RIGHT : dx < 0 ? DIRECTION_LEFT : dy > 0 ? DIRECTION_DOWN : dy < 0 ? DIRECTION_UP : -1;
    };
    
    // Đi đến một vị trí bất kì.
    this.goTo = function(x, y)
    {
        x = Math.ceil(x);
        y = Math.ceil(y);
        
        this.target = [x, y];
        
        //printf(">>> findPath(, x, y)");
        //printf(findPath(GetMap(), [this.m_x | 0, this.m_y | 0], [x, y]).reverse());
        
        var path = findPath(GetMap(this.m_id), [this.m_x >> 0, this.m_y >> 0], [x, y]);

        this.path = path.reverse();

        // remove start position
        this.path.pop();
        
        //printf(`>>> Tank ${this.m_id} Find path from  = [${this.m_x | 0}, ${this.m_y | 0}] to [${x}, ${y}]`);
        //printf(this.path);
        //printf(GetMap());
    };
    
    this.updatePath = function()
    {
    	printf("\n\n");
    	printf("Tank " + this.m_id + " -> updatePath();");
        if( !this.target)
        {
            printf("Tank " + this.m_id + " :  Target is null. Not update");
            return false;
        }
        
        printf("Tank " + this.m_id + " :  ");
        //printf(this.path);
        
        var x = this.target[0], y = this.target[1];
        
        // Try to goto target
        this.goTo(x, y);
        
        var k = -1;
        while( this.path.length == 0 && ++k < $point_gold[GetMyTeam()].length)
        {
            //printf("Point gold length: " + $point_gold[GetMyTeam()].length);
            
            //var new_target = $point_gold[GetMyTeam()][ ($point_gold[GetMyTeam()].length - 1) * Math.random() | 0];
            var new_target = $point_gold[GetMyTeam()][k];
            printf(" Can not move to target [" + this.target[0] + ", "+this.target[1]+"] , chose other target [" + new_target[0] + ", "+new_target[1]+"]. ");
            
            this.goTo(new_target[0], new_target[1]);

            if(this.path.length > 0)
            {
            	printf("Target found. It is [" + this.target.toString() + "]");
            }
        }

        if(this.path.length == 0)
        {
        	printf("Update fail.");
        }
        
        printf("Tank " + this.m_id + " -> updatePath() finish.\n\n");
        
        
        
    };
    
    this.stop = function()
    {
        moving = false;
    };
    
    this.shoot = function(b)
    {
        shooting = true;
    };
    
    this.setPath = function(p)
    {
       this.path = p.reverse(); 
    };
    
    
    
	this.CheckForCollision = function (newX, newY)
    {


		// Check landscape
		var roundedX = newX >> 0;
		var roundedY = newY >> 0;
		var squareNeedToCheckX = new Array();
		var squareNeedToCheckY = new Array();
		
		// Find the square the tank occupy (even part of)
		if (newX == roundedX && newY == roundedY)
        {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
		}
		else if (newX != roundedX && newY == roundedY)
        {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY);
		}
		else if (newX == roundedX && newY != roundedY)
        {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY+1);
		}
		else if (newX != roundedX && newY != roundedY)
        {
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY);
			squareNeedToCheckX.push (roundedX); squareNeedToCheckY.push (roundedY+1);
			squareNeedToCheckX.push (roundedX+1); squareNeedToCheckY.push (roundedY+1);
		}
		
		// Check if that square is invalid
		for (var i=0; i<squareNeedToCheckX.length; i++)
        {
			var x = squareNeedToCheckX[i];
			var y = squareNeedToCheckY[i];
			if (g_map[y * MAP_W + x] == BLOCK_WATER
			||  g_map[y * MAP_W + x] == BLOCK_HARD_OBSTACLE
			||  g_map[y * MAP_W + x] == BLOCK_SOFT_OBSTACLE
			||  g_map[y * MAP_W + x] == BLOCK_BASE)
            {
                printf("... square is invalid... g["+y+"][ "+ x +" ] = " + BLOCKS[g_map[y * MAP_W + x]]);
                printf("newX = " +  newX + ", newY = " + newY);
				return false;
			}
		}
		
        
     
        
        
		// If landscape is valid, time to check collision with other tanks.
        var TT = [TEAM_1, TEAM_2]; 
        for(var k in TT)
        {
            var e = TT[k];
            for (var i=0; i < g_tanks[e].length; i++)
            {
                if (this.m_team == e && this.m_id == i)
                {
                    continue;
                }
                var tempTank = g_tanks[e][i];
                if (Math.abs(newX - tempTank.m_x) < 0.99999 && Math.abs(newY - tempTank.m_y) < 0.99999)
                {
                    //if(g_team == e)
                    {
                        printf("... tank " + this.m_id + " collision with tank "+ tempTank.m_id + ",  direction = " + DIRECTIONS[tempTank.m_direction] + ",  " + DIRECTIONS[this.m_direction]);
                        printf("[X, Y] = [" + this.m_x + ", " + this.m_y + "]");
                        printf("[NewX, NewY] = [" + newX + ", " + newY + "] , [tempTank.m_x, tempTank.m_y] = [" + tempTank.m_x + ", " + tempTank.m_y + "]");
                    }
                    return false;
                }
            }
        }
        
		
		return true;
	};
    
    
    this.update = function()
    {
        printf("\n\n");
        printf("Tank "+this.m_id+" -> update();");
        
        // go to enemy base
        if( this.path.length == 0 && this.target.length && !( this.m_x == this.target[0] && this.m_y == this.target[1]) )
        {
        	//printf("path is empty. try go to target to get path.");
            this.goTo( this.target[0], this.target[1]);
            //printf("path is: ");
            //printf(this.path);
        }

        
        if(this.m_id == 2)
        {
            //printf(">>>> Tank 2: path.length: " + this.path.length + ", x = " + this.m_x + ", y = " + this.m_y + ", tx=" + this.target[0] + ", ty="+ this.target[1]);
            //rintf(this.path);
        }


       /**********************************
        **            MOVE              **
        **********************************/        
        //console.log("target[0] = " + target[0] + ", target[1] = " + target[1] + ", t.getX() = " + t.getX() + ", t.getY() = " + t.getY());
        while(this.path.length > 0)
        {
            // get next position
            var next = this.path[this.path.length-1];
            // Get next position is current is my position
            if(next[0] == this.getX() && next[1] == this.getY())
            {
                this.path.pop();
                //get next target
                next = this.path[this.path.length-1];
            }
            else
            {
                this.jumpTo(next[0], next[1]);
                break;
            }
        }
        
       
       
       /**********************************
        **            SHOOT             **
        **********************************/
       
       // Shoot any where , but my base
       var my_base = $base_main[GetMyTeam()];
       if( this.m_x !== my_base[0])
       {
           this.shoot();
       }

       /* Look around, if dectect dangerous, shoot */
       

       
       // shoot at your base
       var your_base = $base_main[GetOpponentTeam()];
       if( this.m_x === your_base[0])
       {
       	  // bug: override direction cause wrong to move to target
           this.setDirection( this.calcLineDirectionTo(your_base[0], your_base[1]));
           this.shoot();
       }

       printf("Tank "+this.m_id+" -> update() finished.\n\n");
       
    };
    
   
}


function GetMyTeamList()
{
    var l = [];
    for(var i = 0; i < NUMBER_OF_TANK; i++)
    {
        l.push( GetMyTank(i));
    }
    return l;
}
function GetEnemyList()
{
    var l = [];
    for(var i = 0; i < NUMBER_OF_TANK; i++)
    {
        l.push(GetEnemyTank(i));
    }
    return l;
}


function GetMap(tank_id)
{
    // Chuyển map 1 chiều thành map 2 chiều
    var l = [];
    for(var i = 0; i < MAP_H; i++)
    {
        l[i] = [];
        for(var j = 0; j < MAP_W; j++)
        {
            l[i][j] = g_map[i*MAP_W + j];
        }
    }
    
    //Đặt những vị trí tank đang chiếm giữ
    var h = GetEnemyList().concat( GetMyTeamList());
    for(var k in h)
    {
        var e = h[k];
        // Bỏ qua trị trí mà nó đang đứng
        if( e.m_id != tank_id)
        {
	        var t_x = e.getX(), t_y = e.getY();
	        l[Math.floor(t_y)][Math.floor(t_x)] = BLOCK_TANK;
	        l[Math.ceil(t_y)][Math.ceil(t_x)] = BLOCK_TANK;
	        l[Math.floor(t_y)][Math.ceil(t_x)] = BLOCK_TANK;
	        l[Math.ceil(t_y)][Math.floor(t_x)] = BLOCK_TANK;
    	}
    }
    
    //printf(l);
    
    return l;
}


function Bullet()
{
    this.m_id = 0;
    this.m_x = 0;
    this.m_y = 0;
    this.m_team = TEAM_1;
    this.m_type = TANK_MEDIUM;
    this.m_direction = DIRECTION_UP;
    this.m_speed = 0;
    this.m_damage = 0;
    this.m_live = false;
}

function Strike()
{
    this.m_id = 0;
    this.m_x = 0;
    this.m_y = 0;
    this.m_team = TEAM_1;
    this.m_type = POWERUP_AIRSTRIKE;
    this.m_countDown = 0;
    this.m_live = false;
}

function PowerUp()
{
    this.m_id = 0;
    this.m_active = 0;
    this.m_type = 0;
    this.m_x = 0;
    this.m_y = 0;
}
var g_team = -1;
var g_state = STATE_WAITING_FOR_PLAYERS;
var g_map = [];
var g_obstacles = [];
var g_tanks = [];
g_tanks[TEAM_1] = [];
g_tanks[TEAM_2] = [];
var g_bullets = [];
g_bullets[TEAM_1] = [];
g_bullets[TEAM_2] = [];
var g_bases = [];
g_bases[TEAM_1] = [];
g_bases[TEAM_2] = [];
var g_powerUps = [];
var g_strikes = [];
g_strikes[TEAM_1] = [];
g_strikes[TEAM_2] = [];

var g_matchResult;
var g_inventory = [];
g_inventory[TEAM_1] = [];
g_inventory[TEAM_2] = [];

var g_timeLeft = 0;

// =============================================
// Protocol - Sending and updating
// =============================================
var WebSocket;
try
{
    WebSocket = require("./NodeWS");
}
catch (e)
{
    WebSocket = require("./../NodeWS");
}

var SOCKET_IDLE = 0;
var SOCKET_CONNECTING = 1;
var SOCKET_CONNECTED = 2;

var COMMAND_PING = 0;
var COMMAND_SEND_KEY = 1;
var COMMAND_SEND_TEAM = 2;
var COMMAND_UPDATE_STATE = 3;
var COMMAND_UPDATE_MAP = 4;
var COMMAND_UPDATE_TANK = 5;
var COMMAND_UPDATE_BULLET = 6;
var COMMAND_UPDATE_OBSTACLE = 7;
var COMMAND_UPDATE_BASE = 8;
var COMMAND_REQUEST_CONTROL = 9;
var COMMAND_CONTROL_PLACE = 10;
var COMMAND_CONTROL_UPDATE = 11;
var COMMAND_UPDATE_POWERUP = 12;
var COMMAND_MATCH_RESULT = 13;
var COMMAND_UPDATE_INVENTORY = 14;
var COMMAND_UPDATE_TIME = 15;
var COMMAND_CONTROL_USE_POWERUP = 16;
var COMMAND_UPDATE_STRIKE = 17;


var socket = null;
var socketStatus = SOCKET_IDLE;


socket = WebSocket.connect("ws://" + host + ":" + port, [], function()
{
    logger.print("Socket connected");
    socketStatus = SOCKET_CONNECTED;
    SendKey();
});
socket.on("error", function(code, reason)
{
    socketStatus = SOCKET_IDLE;
    logger.print("Socket error: " + code);
});
socket.on("text", function(data)
{
    OnMessage(data);
});
socketStatus = SOCKET_CONNECTING;


function Send(data)
{
    //console.log ("Socket send: " + PacketToString(data));
    socket.sendText(data);
}

function OnMessage(data)
{
    // console.log ("Data received: " + PacketToString(data));

    var readOffset = 0;

    while (true)
    {
        var command = DecodeUInt8(data, readOffset);
        readOffset++;

        if (command == COMMAND_SEND_TEAM)
        {
            g_team = DecodeUInt8(data, readOffset);
            readOffset++;
        }
        else if (command == COMMAND_UPDATE_STATE)
        {
            state = DecodeUInt8(data, readOffset);
            readOffset++;

            if (g_state == STATE_WAITING_FOR_PLAYERS && state == STATE_TANK_PLACEMENT)
            {
                g_state = state;
                setTimeout(OnPlaceTankRequest, 100);
            }
        }
        else if (command == COMMAND_UPDATE_MAP)
        {
            g_hardObstacles = [];
            for (var i = 0; i < MAP_W; i++)
            {
                for (var j = 0; j < MAP_H; j++)
                {
                    g_map[j * MAP_W + i] = DecodeUInt8(data, readOffset);
                    readOffset += 1;
					if (g_map[j * MAP_W + i] == BLOCK_HARD_OBSTACLE)
					{
						var temp = new Obstacle();
						temp.m_id = -1;
						temp.m_x = i;
						temp.m_y = j;
						temp.m_HP = 9999;
						temp.m_destructible = false;
						g_hardObstacles.push (temp);
					}
                }
            }
        }
        else if (command == COMMAND_UPDATE_TIME)
        {
            g_timeLeft = DecodeInt16(data, readOffset);
            readOffset += 2;
        }
        else if (command == COMMAND_UPDATE_OBSTACLE)
        {
            readOffset += ProcessUpdateObstacleCommand(data, readOffset);
        }
        else if (command == COMMAND_UPDATE_TANK)
        {
            readOffset += ProcessUpdateTankCommand(data, readOffset);
        }
        else if (command == COMMAND_UPDATE_BULLET)
        {
            readOffset += ProcessUpdateBulletCommand(data, readOffset);
        }
        else if (command == COMMAND_UPDATE_BASE)
        {
            readOffset += ProcessUpdateBaseCommand(data, readOffset);
        }
        else if (command == COMMAND_MATCH_RESULT)
        {
            readOffset += ProcessMatchResultCommand(data, readOffset);
        }
        else if (command == COMMAND_UPDATE_POWERUP)
        {
            readOffset += ProcessUpdatePowerUpCommand(data, readOffset);
        }
        else if (command == COMMAND_UPDATE_STRIKE)
        {
            readOffset += ProcessUpdateStrikeCommand(data, readOffset);
        }
        else if (command == COMMAND_UPDATE_INVENTORY)
        {
            readOffset += ProcessUpdateInventoryCommand(data, readOffset);
        }
        else if (command == COMMAND_REQUEST_CONTROL)
        {
            Update();
        }
        else
        {
            readOffset++;
            logger.print("Invalid command id: " + command);
        }

        if (readOffset >= data.length)
        {
            break;
        }
    }
}

function SendKey()
{
    if (socketStatus == SOCKET_CONNECTED)
    {
        var packet = "";
        packet += EncodeUInt8(COMMAND_SEND_KEY);
        packet += EncodeInt8(key);
        Send(packet);
    }
}



function ProcessUpdateObstacleCommand(data, originalOffset)
{
    var offset = originalOffset;
    var id = DecodeUInt8(data, offset);
    offset++;
    var x = DecodeUInt8(data, offset);
    offset++;
    var y = DecodeUInt8(data, offset);
    offset++;
    var HP = DecodeUInt8(data, offset);
    offset++;

    if (g_obstacles[id] == null)
    {
        g_obstacles[id] = new Obstacle();
    }
    g_obstacles[id].m_id = id;
    g_obstacles[id].m_x = x;
    g_obstacles[id].m_y = y;
    g_obstacles[id].m_HP = HP;

    return offset - originalOffset;
}

function ProcessUpdateTankCommand(data, originalOffset)
{
    var offset = originalOffset;
    var id = DecodeUInt8(data, offset);
    offset++;
    var team = DecodeUInt8(data, offset);
    offset++;
    var type = DecodeUInt8(data, offset);
    offset++;
    var HP = DecodeUInt16(data, offset);
    offset += 2;
    var dir = DecodeUInt8(data, offset);
    offset++;
    var speed = DecodeFloat32(data, offset);
    offset += 4;
    var ROF = DecodeUInt8(data, offset);
    offset++;
    var cooldown = DecodeUInt8(data, offset);
    offset++;
    var damage = DecodeUInt8(data, offset);
    offset++;
    var disabled = DecodeUInt8(data, offset);
    offset++;
    var x = DecodeFloat32(data, offset);
    offset += 4;
    var y = DecodeFloat32(data, offset);
    offset += 4;

    if (g_tanks[team][id] == null)
    {
        g_tanks[team][id] = new Tank();
    }
    g_tanks[team][id].m_id = id;
    g_tanks[team][id].m_team = team;
    g_tanks[team][id].m_type = type;
    g_tanks[team][id].m_HP = HP;
    g_tanks[team][id].m_direction = dir;
    g_tanks[team][id].m_speed = speed;
    g_tanks[team][id].m_rateOfFire = ROF;
    g_tanks[team][id].m_coolDown = cooldown;
    g_tanks[team][id].m_damage = damage;
    g_tanks[team][id].m_disabled = disabled;
    g_tanks[team][id].m_x = x;
    g_tanks[team][id].m_y = y;

    return offset - originalOffset;
}

function ProcessUpdateBulletCommand(data, originalOffset)
{
    var offset = originalOffset;
    var id = DecodeUInt8(data, offset);
    offset++;
    var live = DecodeUInt8(data, offset);
    offset++;
    var team = DecodeUInt8(data, offset);
    offset++;
    var type = DecodeUInt8(data, offset);
    offset++;
    var dir = DecodeUInt8(data, offset);
    offset++;
    var speed = DecodeFloat32(data, offset);
    offset += 4;
    var damage = DecodeUInt8(data, offset);
    offset++;
    var hit = DecodeUInt8(data, offset);
    offset++; // not used 
    var x = DecodeFloat32(data, offset);
    offset += 4;
    var y = DecodeFloat32(data, offset);
    offset += 4;

    if (g_bullets[team][id] == null)
    {
        g_bullets[team][id] = new Bullet();
    }
    g_bullets[team][id].m_id = id;
    g_bullets[team][id].m_live = live;
    g_bullets[team][id].m_team = team;
    g_bullets[team][id].m_type = type;
    g_bullets[team][id].m_direction = dir;
    g_bullets[team][id].m_speed = speed;
    g_bullets[team][id].m_damage = damage;
    g_bullets[team][id].m_x = x;
    g_bullets[team][id].m_y = y;

    return offset - originalOffset;
}

function ProcessUpdatePowerUpCommand(data, originalOffset)
{
    var offset = originalOffset;
    var id = DecodeUInt8(data, offset);
    offset++;
    var active = DecodeUInt8(data, offset);
    offset++;
    var type = DecodeUInt8(data, offset);
    offset++;
    var x = DecodeFloat32(data, offset);
    offset += 4;
    var y = DecodeFloat32(data, offset);
    offset += 4;

    if (g_powerUps[id] == null)
    {
        g_powerUps[id] = new PowerUp();
    }
    g_powerUps[id].m_id = id;
    g_powerUps[id].m_active = active;
    g_powerUps[id].m_type = type;
    g_powerUps[id].m_x = x;
    g_powerUps[id].m_y = y;

    return offset - originalOffset;
}

function ProcessUpdateBaseCommand(data, originalOffset)
{
    var offset = originalOffset;
    var id = DecodeUInt8(data, offset);
    offset++;
    var team = DecodeUInt8(data, offset);
    offset++;
    var type = DecodeUInt8(data, offset);
    offset++;
    var HP = DecodeUInt16(data, offset);
    offset += 2;
    var x = DecodeFloat32(data, offset);
    offset += 4;
    var y = DecodeFloat32(data, offset);
    offset += 4;

    if (g_bases[team][id] == null)
    {
        g_bases[team][id] = new Base();
    }
    g_bases[team][id].m_id = id;
    g_bases[team][id].m_team = team;
    g_bases[team][id].m_type = type;
    g_bases[team][id].m_HP = HP;
    g_bases[team][id].m_x = x;
    g_bases[team][id].m_y = y;

    return offset - originalOffset;
}

function ProcessUpdateInventoryCommand(data, originalOffset)
{
    g_inventory[TEAM_1] = new Array();
    g_inventory[TEAM_2] = new Array();

    var offset = originalOffset;
    var number1 = DecodeUInt8(data, offset);
    offset++;
    for (var i = 0; i < number1; i++)
    {
        g_inventory[TEAM_1][i] = DecodeUInt8(data, offset);
        offset++;
    }
    var number2 = DecodeUInt8(data, offset);
    offset++;
    for (var i = 0; i < number2; i++)
    {
        g_inventory[TEAM_2][i] = DecodeUInt8(data, offset);
        offset++;
    }

    return offset - originalOffset;
}

function ProcessUpdateStrikeCommand(data, originalOffset)
{
    var offset = originalOffset;
    var id = DecodeUInt8(data, offset);
    offset++;
    var team = DecodeUInt8(data, offset);
    offset++;
    var type = DecodeUInt8(data, offset);
    offset++;
    var live = DecodeUInt8(data, offset);
    offset++;
    var countDown = DecodeUInt8(data, offset);
    offset++;
    var x = DecodeFloat32(data, offset);
    offset += 4;
    var y = DecodeFloat32(data, offset);
    offset += 4;

    if (g_strikes[team][id] == null)
    {
        g_strikes[team][id] = new Strike();
    }
    g_strikes[team][id].m_id = id;
    g_strikes[team][id].m_live = live;
    g_strikes[team][id].m_team = team;
    g_strikes[team][id].m_type = type;
    g_strikes[team][id].m_countDown = countDown;
    g_strikes[team][id].m_x = x;
    g_strikes[team][id].m_y = y;

    return offset - originalOffset;
}

function ProcessMatchResultCommand(data, originalOffset)
{
    var offset = originalOffset;
    g_matchResult = DecodeUInt8(data, offset);
    offset++;
    g_state = STATE_FINISHED; //update state for safety, server should also send a msg update state

    return offset - originalOffset;
}

// An object to hold the command, waiting for process
function ClientCommand()
{
    var g_direction = 0;
    var g_path = "";
    var g_move = false;
    var g_shoot = false;
    var g_dirty = false;
}
var clientCommands = new Array();
for (var i = 0; i < NUMBER_OF_TANK; i++)
{
    clientCommands.push(new ClientCommand());
}

// Pending command as a string.
var g_commandToBeSent = "";

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
//                                    GAME RULES                                    //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
// - The game is played on a map of 20x20 blocks where [x,y] is referred as the     //
// block at column x and row y.                                                     //
// - Each team has 1 main base, 2 side bases and 4 tanks.                           //
// - At the beginning of a game, each player will choose 4 tanks and place them     //
// on the map (not on any bases/obstacles/tanks).                                   //
// - The game is played in real-time mode. Each player will control 4 tanks in      //
// order to defend their bases and at the same time, try to destroy their enemy’s   //
// bases.                                                                           //
// -Your tank bullets or cannon shells will pass other allied tank (not friendly    //
// fire), but will damage your own bases, so watch where you firing.                //
// -A destroyed tank will allow bullet to pass through it, but still not allow      //
// other tanks to pass through.                                                     //
// - When the game starts (and after each 30 seconds) , a random power-up will be   //
// spawn at 1 of 3 bridges (if there are still space) at location:                  //
// [10.5, 1.5], [10.5, 10.5], [10.5, 19.5].                                         //
// - Power-ups are friendly-fired and have area of effect (AOE) damage. All units   //
// near the struck location will be affected. Use them wisely.                      //
// - The game is over when:                                                         //
//   + The main base of 1 team is destroyed. The other team is the winner.          //
//   + If all tanks of a team are destroyed, the other team is the winner.          //
//   + After 120 seconds, if both main bases are not destroyed, the team with more  //
//   side bases remaining is the winner.                                            //
//   + If both team have the same bases remaining, the game will change to “Sudden  //
//   Death” mode. In Sudden Death mode:                                             //
//     * 2 teams will play for extra 30 seconds.                                    //
//     * All destructible obstacles are removed.                                    //
//     * If 1 team can destroy any base, they are the winner.                       //
//     * After Sudden Death mode is over, the team has more tanks remaining is the  //
//     winner.                                                                      //
//   + The time is over. If it’s an active game (i.e. Some tanks and/or bases are   // 
//   destroyed), the result is a DRAW. If nothing is destroyed, it’s a BAD_DRAW.    //
//                                                                                  //
// Please read the detailed rule on our web site at:                                //
//   http://han-ai-contest2016.gameloft.com                                         //
//////////////////////////////////////////////////////////////////////////////////////

// ====================================================================================
//                                       NOTE:
// ====================================================================================
// Do not modify the code above, you won't be able to 'hack',
// all data sent to server is double checked there.
// Further more, if you cause any damage to the server or
// wrong match result, you'll be disqualified right away.
//
// 
//
// That's pretty much about it. Now, let's start coding.
// ====================================================================================




// ====================================================================================
// COMMAND FUNCTIONS: THESE ARE FUNCTIONS THAT HELP YOU TO CONTROL YOUR LITTLE ARMY
// ====================================================================================

// You call this function inside OnPlaceTankRequest() 4 times, to pick and place your tank.
// First param is the tank you want to use: TANK_LIGHT, TANK_MEDIUM or TANK_HEAVY.
// Then the coordinate you want to place. Must be integer.
function PlaceTank(type, x, y)
{
    g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_PLACE);
    g_commandToBeSent += EncodeUInt8(type);
    g_commandToBeSent += EncodeUInt8(x >> 0);
    g_commandToBeSent += EncodeUInt8(y >> 0);
}

// You call this function inside Update(). This function will help you control your tank.
// - First parameter is the id of your tank (0 to 3), in your creation order when you placed your tank
// - Second parameter is the direction you want to turn your tank into. I can be DIRECTION_UP, DIRECTION_LEFT, DIRECTION_DOWN or DIRECTION_RIGHT.
// If you leave this param null, the tank will keep on its current direction.
// - Third parameter: True / False, whether to move your tank forward, or stay till.
// - Fourth parameter: True / False, whether to use your tank's main cannon. aka. Pew pew pew! Careful about the cooldown though.
function CommandTank(id, turn, move, shoot)
{
    // Save to a list of command, and send later
    // This is to prevent player to send duplicate command.
    // Duplicate command will overwrite the previous one.
    // We just send one.
    // Turn can be null, it won't change a tank direction.
    if (turn != null)
    {
        clientCommands[id].m_direction = turn;
    }
    else
    {
        clientCommands[id].m_direction = g_tanks[g_team][id].m_direction;
    }

    clientCommands[id].m_move = move;
    clientCommands[id].m_shoot = shoot;
    
    clientCommands[id].m_dirty = true;
    //clientCommands[id].m_path = JSON.stringify(g_tanks[g_team][id].path);
}


// You call this function to use the Airstrike powerup on a position
// Param is coordination. Can be float or integer.
// WARNING: ALL POWERUP ARE FRIENDLY-FIRE ENABLED.
// YOUR TANK OR YOUR BASE CAN BE HARM IF IT'S INSIDE THE AOE OF THE STRIKE
function UseAirstrike(x, y)
{
    if (HasAirstrike())
    {
        g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_USE_POWERUP);
        g_commandToBeSent += EncodeUInt8(POWERUP_AIRSTRIKE);
        g_commandToBeSent += EncodeFloat32(x);
        g_commandToBeSent += EncodeFloat32(y);
    }
}
// Same as above, but EMP instead of Airstrike.
function UseEMP(x, y)
{
    if (HasEMP())
    {
        g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_USE_POWERUP);
        g_commandToBeSent += EncodeUInt8(POWERUP_EMP);
        g_commandToBeSent += EncodeFloat32(x);
        g_commandToBeSent += EncodeFloat32(y);
    }
}

// This function is called at the end of the function Update or OnPlaceTankRequest.
// I've already called it for you, don't delete it.
function SendCommand()
{
    // Send all pending command
    for (var i = 0; i < NUMBER_OF_TANK; i++)
    {
        if (clientCommands[i].m_dirty == true)
        {
            g_commandToBeSent += EncodeUInt8(COMMAND_CONTROL_UPDATE);
            g_commandToBeSent += EncodeUInt8(i);
            g_commandToBeSent += EncodeUInt8(clientCommands[i].m_direction);
            g_commandToBeSent += EncodeUInt8(clientCommands[i].m_move);
            g_commandToBeSent += EncodeUInt8(clientCommands[i].m_shoot);
            //g_commandToBeSent += clientCommands[i].m_path;

            clientCommands.m_dirty = false;
        }
    }
    Send(g_commandToBeSent);
    g_commandToBeSent = "";
}

// ====================================================================================
// HELPING FUNCTIONS: THESE ARE FUNCTIONS THAT HELP YOU RETRIEVE GAME VARIABLES
// ====================================================================================
function GetTileAt(x, y)
{
    // This function return landscape type of the tile block on the map
    // It'll return the following value:
    // BLOCK_GROUND
    // BLOCK_WATER
    // BLOCK_HARD_OBSTACLE
    // BLOCK_SOFT_OBSTACLE
    // BLOCK_BASE
    
    //var l = g_map.concat();
    //return l[Math.ceil(y) * MAP_W + Math.ceil(x)];
    return GetMap()[y][x];
}
function GetObstacleList() {
	// Return the obstacle list, both destructible, and the non destructible
	// This does not return water type tile.
	var list = [];
	for (var i=0; i<g_obstacles.length; i++) {
		list.push (g_obstacles);
	}
	for (var i=0; i<g_hardObstacles.length; i++) {
		list.push (g_hardObstacles);
	}
	return list;
}

function GetMyTeam()
{
    // This function return your current team.
    // It can be either TEAM_1 or TEAM_2
    // Obviously, your opponent is the other team.
    return g_team;
}

function GetOpponentTeam()
{
    if (g_team == TEAM_1)
        return TEAM_2;
    else
        return TEAM_1;
}

function GetMyTank(id)
{
    // Return your tank, just give the id.
    return g_tanks[g_team][id];
}

function GetEnemyTank(id)
{
    // Return enemy tank, just give the id.
    return g_tanks[(TEAM_1 + TEAM_2) - g_team][id];
}

function GetPowerUpList()
{
    // Return active powerup list
    var powerUp = [];
    for (var i = 0; i < g_powerUps.length; i++)
    {
        if (g_powerUps[i].m_active)
        {
            powerUp.push(g_powerUps[i]);
        }
    }

    return powerUp;
}

function HasAirstrike()
{
    // Call this function to see if you have airstrike powerup.
    for (var i = 0; i < g_inventory[g_team].length; i++)
    {
        if (g_inventory[g_team][i] == POWERUP_AIRSTRIKE)
        {
            return true;
        }
    }
    return false;
}

function HasEMP()
{
    // Call this function to see if you have EMP powerup.
    for (var i = 0; i < g_inventory[g_team].length; i++)
    {
        if (g_inventory[g_team][i] == POWERUP_EMP)
        {
            return true;
        }
    }
    return false;
}

function GetIncomingStrike()
{
    var incoming = [];

    for (var i = 0; i < g_strikes[TEAM_1].length; i++)
    {
        if (g_strikes[TEAM_1][i].m_live)
        {
            incoming.push(g_strikes[TEAM_1][i]);
        }
    }
    for (var i = 0; i < g_strikes[TEAM_2].length; i++)
    {
        if (g_strikes[TEAM_2][i].m_live)
        {
            incoming.push(g_strikes[TEAM_2][i]);
        }
    }

    return incoming;
}

// ====================================================================================
// YOUR FUNCTIONS. YOU IMPLEMENT YOUR STUFF HERE.
// ====================================================================================

function GetOpposite(L)
{
    var L1 = [];
    for(i in L)
    {
        L1[i] = [21 - L[i][0], 21 - L[i][1]];
    }
    return L1;
}

function OnPlaceTankRequest()
{
    // This function is called at the start of the game. You place your tank according
    // to your strategy here.
    
    //var map1 = [[1, 1], [2, 1], [3, 1], [4, 1]].reverse();
    
    
    // hg
    printf("The team " + g_team);
    
    //Lite to heavy
    var W = [TANK_LIGHT, TANK_MEDIUM, TANK_HEAVY, TANK_HEAVY];
    
    $place = {};
    //$place[TEAM_1] = [[7, 1], [6, 1], [5, 1], [4, 1]];
    $place[TEAM_1] = [[7, 1], [5, 1], [7, 20], [5, 20]];
    $place[TEAM_2] = GetOpposite($place[TEAM_1]);
    
    $target = {};
    $target[TEAM_1] = [[20, 4], [20, 3], [20, 18], [20, 19]];
    $target[TEAM_2] = GetOpposite($target[TEAM_1]);
    
    $base_main = {};
    $base_main[TEAM_1] = [01, 11];
    $base_main[TEAM_2] = [20, 11];
    
    $path = {};
    $path[TEAM_1] = [];
    $path[TEAM_1][0] = [[20,  1]];
    $path[TEAM_1][1] = [[20,  1]];
    $path[TEAM_1][2] = [[20, 20]];
    $path[TEAM_1][3] = [[19, 20], [18, 20], [20, 20]];
    
    $path[TEAM_2] = [];
    for(var i = 0; i <  $path[TEAM_1].length; i++)
    {
         $path[TEAM_2][i] = GetOpposite( $path[TEAM_1][i]);
    }
    
    $point_gold = {};
    $point_gold[TEAM_1] = [[20, 4], [20, 5], [20, 6], [20, 7], [20, 8]];
    $point_gold[TEAM_1].concat([[20, 13], [20, 14], [20, 15], [20, 16], [20, 17], [20, 18], [20, 19]]);
    $point_gold[TEAM_2] = GetOpposite($point_gold[TEAM_1]);

   
    for(var i = 0; i < NUMBER_OF_TANK; i++)
    {
        //printf($place[g_team][i]);
        PlaceTank(W[i], $place[g_team][i][0], $place[g_team][i][1]);
    }

    

    // Leave this here, don't remove it.
    // This command will send all of your tank command to server
    SendCommand();
}

function Update()
{
    
    //printf(">>> Update(): ");
    
    //printf(GetMap());
    
    //INIT
    if( !$INITED )
    {
        for(var i = 0; i < NUMBER_OF_TANK; i++)
        {
            var t = GetMyTank(i);
            t.setPath($path[GetMyTeam()][i]);
            t.target = $target[GetMyTeam()][i];
        }
        
        $INITED = true;
    }
    
    // =========================================================================================================
    // Do nothing if the match is ended
    // You should keep this. Removing it probably won't affect much, but just keep it.
    // =========================================================================================================
    if (g_state == STATE_FINISHED)
    {
        if (((g_matchResult == MATCH_RESULT_TEAM_1_WIN) && (GetMyTeam() == TEAM_1)) || ((g_matchResult == MATCH_RESULT_TEAM_2_WIN) && (GetMyTeam() == TEAM_2)))
        {
            console.log("I WON. I WON. I'M THE BEST!!!");
        }
        else if (((g_matchResult == MATCH_RESULT_TEAM_2_WIN) && (GetMyTeam() == TEAM_1)) || ((g_matchResult == MATCH_RESULT_TEAM_1_WIN) && (GetMyTeam() == TEAM_2)))
        {
            console.log("DAMN, I LOST. THAT GUY WAS JUST LUCKY!!!");
        }
        else
        {
            console.log("DRAW.. BORING!");
        }
        return;
    }




    // =========================================================================================================
    // Check if there will be any airstrike or EMP
    // The GetIncomingStrike() function will return an array of strike object. Both called by your team
    // or enemy team.
    // =========================================================================================================
    var strike = GetIncomingStrike();
    for (var i = 0; i < strike.length; i++)
    {
        var x = strike[i].m_x;
        var y = strike[i].m_y;
        var count = strike[i].m_countDown; // Delay (in server loop) before the strike reach the battlefield.
        var type = strike[i].m_type;

        if (type == POWERUP_AIRSTRIKE)
        {
            // You may want to do something here, like moving your tank away if the strike is on top of your tank.
            
        }
        else if (type == POWERUP_EMP)
        {
            // Run... RUN!!!!
        }
        //console.log(">>> GetIncomingStrike Event.");
        //GetMyTank(i).goTo(x, y);
    }




    // =========================================================================================================
    // Get power up list on the map. You may want to move your tank there and secure it before your enemy
    // does it. You can get coordination, and type from this object
    // =========================================================================================================
    var powerUp = GetPowerUpList();
    for (var i = 0; i < powerUp.length; i++)
    {
        var x = powerUp[i].m_x;
        var y = powerUp[i].m_y;
        var type = powerUp[i].m_type;
        if (type == POWERUP_AIRSTRIKE)
        {
           
            // You may want to move your tank to this position to secure this power up.
        }
        else if (type == POWERUP_EMP)
        {

        }
       // console.log(">>> GetPowerUpList Event.");
        /*
        var myTank = GetMyTank(i);
        if( !myTank.busy)
        {
            console.log("Tank[" + i + "] going to Power up Item at ( " + x + ", " + y + ").");
            myTank.goTo(x, y);
            myTank.busy = 1;
        }
        */
        
    }



    // =========================================================================================================
    // This is an example on how you command your tanks.
    // In this example, I go through all of my "still intact" tanks, and give them random commands.
    // =========================================================================================================
    // Loop through all tank (if not dead yet)

    for (var i = 0; i < NUMBER_OF_TANK; i++)
    {
        var t = GetMyTank(i);

        // Don't waste effort if tank was dead
        if (t && t.m_HP > 0)
        {
            //console.log(`Tank ${t.m_id} : path.length: ${t.path.length}`);
            //console.log("t.path.length: " + t.path.length);
            //
            t.update();
  
            //send request
            t.sendCommand();
        }


    }
    


    // =========================================================================================================
    // This is an example on how you use your power up if you acquire one.
    // If you have airstrike or EMP, you may use them anytime.
    // I just give a primitive example here: I strike on the first enemy tank, as soon as I acquire power up
    // =========================================================================================================
    if (HasAirstrike())
    {
        //drop into your main base
        var your_team = GetOpponentTeam();
        UseAirstrike( $base_main[your_team][0], $base_main[your_team][1]);
        
    }
    if (HasEMP())
    {

        // get your team list and sort by HP
        var L = GetEnemyList().sort(function(e1, e2){ e2.m_HP - e1.m_HP;});
        // drop into tank have the most HP 
        UseEMP( L[0].getX(), L[0].getY());

    }

    // Leave this here, don't remove it.
    // This command will send all of your tank command to server
    SendCommand();
}