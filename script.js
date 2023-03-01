
/**
 * 
 * Node:
 *  - #x
 *  - #y
 *  - #next
 *  - #prev
 *  - constructor
 *  - getPosition() : [this.#x, this.#y]
 *  - setPosition(number, number)
 *  - next() : this.#next
 *  - prev() : this.#prev
 * 
 * Snake:
 *  - #nodes[] : Node
 *  - #direction : Number           // 0=up 1=right 2=down 3=left
 *  - #head
 *  - #tail
 *  - constructor
 *  - move()                        // moves one cell, depending on the direction
 *  - addNode()                     // push new node on food eat
 *  - changeDirection(Number)       // works in conjunction with getInput()
 *  - getDireciton() : number
 *  - getNodes() : [] :Node
 *  - getHead() : Node;
 *  - getTail() : Node
 * 
 *  snake nodes visualization:
 *      [H][0][0][T]
 *       0  1  2  3
 *  0 is always head; (nodes.length - 1) is always the tail; 
 *  we always push to the end of the array
 *        
 *  Game:
 *  - #renderer : HtmlRenderer
 *  - #food : Node
 *  - #snake : Snake
 *  - start()
 *  - update()
 *  - spawnFood()
 *  - getInput() : String           // KeyCode on KeyDown
 *  + methods to check conditions
 * 
 *  HtmlRenderer:
    *  maybe place stuff like
    *    const GRID_HEIGHT = 15;
    *    const GRID_WIDTH = 30;
    *    const CELL_SIZE = 5;
    *  here? there is no need for it to be anywhere else, all calculations can be done in terms of grid cells
    *  then in order to dender it. just multiply by constants?
    * TODO: how to define world borders? maybe in [+ methods to check conditions]
 *
 *  - initWorld()                   // render the grid, draw the snake and food 
 *  - renderGrid()
 *  - rednerSnake()
 *  - renderFood()
 */

class Node{
    #x;
    #y;
    constructor(x, y){
        this.#x = x;
        this.#y = y;
    }
    getX() { return this.#x; }
    getY() { return this.#y; }
    setPosition(newX, newY){
        this.#x = newX;
        this.#y = newY
    }
}

class Snake{
    #nodes = [];
    #direction = [0, -1];

    constructor(headNodeX, headNodeY){
        for(let i = 0; i < 3; i++){
            this.#nodes.push(new Node(headNodeX, headNodeY));
            headNodeY += 1;
        }
    }
    step(){
        // TODO: check this later
        // direction only affects the position of the head node (this.#nodes[0]).
        // every other node's position is set based on the position of the node before.
        // завдяки цьому ноди йдуть строго по траєкторії хед ноду.
        let prevX = this.#nodes[0].getX();
        let prevY = this.#nodes[0].getY(); 
        this.#nodes[0].setPosition(this.#nodes[0].getX() + this.#direction[0], this.#nodes[0].getY() + this.#direction[1]); // move head

        // set each i's node position based on the i-1's node position
        for(let i = 1; i < this.#nodes.length; i++){
            let tempx = this.#nodes[i].getX();
            let tempy = this.#nodes[i].getY();
            this.#nodes[i].setPosition(prevX, prevY);
            
            prevX = tempx;
            prevY = tempy; 
        }
    }
    addNode(){  
        this.#nodes.push(new Node(this.#nodes[this.#nodes.length - 1].getX(), this.#nodes[this.#nodes.length - 1].getY()));
    }
    getPosition() { return [this.#nodes[0].getX(), this.#nodes[0].getY()]}
    changeDirection(x, y) { this.#direction[0] = x; this.#direction[1] = y; }
    getDirection() { return this.#direction; }
    getNodes() { return this.#nodes; }
    facedItself(){
        for(let i = 1; i < this.#nodes.length; i++){
            if(this.#nodes[i].getX() == this.getPosition()[0] &&
                this.#nodes[i].getY() == this.getPosition()[1])
            return true;
        }
        return false;
    }
    isOutOfBorders(){
        //TODO: fix
        if(this.#nodes[0].getY() < 0 || this.#nodes[0].getY() === 15 || 
                this.#nodes[0].getX() < 0 || this.#nodes[0].getX() > 29)
            return true;
        return false;
    }
}


class HtmlRenderer{
    #GRID_HEIGHT = 15;
    #GRID_WIDTH = 30;
    #CELL_SIZE = 5;
    #UNITS = "vmin"

    #grid;

    constructor(grid){
        this.#grid = grid;
        this.#grid.style.gridTemplateColumns = `repeat(${this.#GRID_WIDTH}, ${this.#CELL_SIZE}${this.#UNITS})`;
        this.#grid.style.gridTemplateRows = `repeat(${this.#GRID_HEIGHT}, ${this.#CELL_SIZE}${this.#UNITS})`;
        this.#fillGrid(grid);
        
    }
    #fillGrid(grid){
        for(let i = 0; i < (this.#GRID_WIDTH * this.#GRID_HEIGHT); i++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            grid.append(cell);
        }
    }
    renderSnake(snake){
        this.#removeSnake();
        let nodes = snake.getNodes();
        for(let i = 0; i < nodes.length; i++){
            let nodeToAdd = document.createElement("div");
            nodeToAdd.classList.add("snake-node");
            nodeToAdd.id = `${i}`;
            nodeToAdd.style.top = `${nodes[i].getY() * this.#CELL_SIZE}${this.#UNITS}`;
            nodeToAdd.style.left = `${nodes[i].getX() * this.#CELL_SIZE}${this.#UNITS}`;
            this.#grid.append(nodeToAdd);
        }
    }
    #removeSnake(){
        document.querySelectorAll('.snake-node').forEach(e => e.remove());
    }
    renderFood(){

    }
}

// TODO: implement condition ckecking
    // onFood
    // onFacedSnake DONE
    // onOutOfBounds
    // gameOver
// TODO: implement input handling DONE
// TODO: implement food


const RENDERER = new HtmlRenderer(document.getElementById("grid"));
const FOOD = new Node(0, 0);
const SNAKE = new Snake(0, 12);
const CLOCK = window.setInterval(update, 100);

const GRID_WIDTH = 30;
const GRID_HEIGHT = 15;

function getInput(){
    document.addEventListener("keydown", event =>{
        switch(event.code){
            case "ArrowUp":
                if(SNAKE.getDirection()[1] != 1)
                    SNAKE.changeDirection(0, -1);
                break;
            case "ArrowRight":
                if(SNAKE.getDirection()[0] != -1)
                    SNAKE.changeDirection(1, 0);
                break;
            case "ArrowDown":
                if(SNAKE.getDirection()[1] != -1)
                    SNAKE.changeDirection(0, 1);
                break;
            case "ArrowLeft":
                if(SNAKE.getDirection()[0] != 1)
                    SNAKE.changeDirection(-1, 0);
                break;
            case "Space":
                SNAKE.addNode();
            default:
                break;
        }
    })
}

getInput();

function update(){
    if(SNAKE.isOutOfBorders() || SNAKE.facedItself()){
        clearInterval(CLOCK);
        console.log(true);
    }
    RENDERER.renderSnake(SNAKE); 
    SNAKE.step(); 
    console.log(findEmptyCells());
};

function findEmptyCells(){
    let cells = [];
    let addFlag = true;
    for(let i = 0; i < GRID_HEIGHT; i++){
        for(let j = 0; j < GRID_WIDTH; j++){
            for(let s = 0; s < SNAKE.length; s++){
                if(i == SNAKE.getNodes()[s].getY() && j == SNAKE.getNodes()[s].getX())
                    addFlag = false;
            }
            if(addFlag)
                cells.push([j, i ]);
            addFlag = true;
        }
    }


    return cells;
}

function spawnFood(){
    // find a random spot amongst the set of empty cells and place food there
    
    let x = Math.random() * GRID_WIDTH;
    let y = Math.random() * GRID_HEIGHT;


}

function checkForFood(){
    if(SNAKE.getPosition[0] === FOOD.getX() && SNAKE.getPosition[1] === FOOD.getY()){
        SNAKE.addNode();
        spawnFood();
    }
}

