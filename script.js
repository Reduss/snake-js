
// BUG: інколи можна спіткнутися об самого себе, маючи в змії лише 3 елементи => неправильно розраховується Snake::facedItself()
// BUG: інпут лаг. Імплементувати фреймрейт індепенденс
// TODO: рефакторинг структури проги
// TODO: зробити глобальні змінні в одному місці (такі як розмір гріда і тд)
// TODO: візуал 


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
    move(cellsPerSecond){
        while(cellsPerSecond != 0){
            this.step();
            cellsPerSecond--;
        }
    }
    addNode(){  
        this.#nodes.push(new Node(this.#nodes[this.#nodes.length - 1].getX(), this.#nodes[this.#nodes.length - 1].getY()));
    }
    getPosition() { return [this.#nodes[0].getX(), this.#nodes[0].getY()]}
    getX() { return this.#nodes[0].getX()}
    getY() { return this.#nodes[0].getY()}
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
    onOutOfBounds(){
        for(let i = 0; i < this.#nodes.length; i++){
            if(this.#nodes[i].getY() < 0)
                this.#nodes[i].setPosition(this.#nodes[i].getX(), 14);
            if(this.#nodes[i].getY() > 14)
                this.#nodes[i].setPosition(this.#nodes[i].getX(), 0);
            if(this.#nodes[i].getX() < 0)
                this.#nodes[i].setPosition(29, this.#nodes[i].getY());
            if(this.#nodes[i].getX() > 29)
                this.#nodes[i].setPosition(0, this.#nodes[i].getY());
        }
    }
}


class Clock{

}

class HtmlRenderer{
    #GRID_HEIGHT = 15;
    #GRID_WIDTH = 30;
    #CELL_SIZE = 4;
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
            nodeToAdd.style.width = `${this.#CELL_SIZE}${this.#UNITS}`;
            nodeToAdd.style.height = `${this.#CELL_SIZE}${this.#UNITS}`;
            this.#grid.append(nodeToAdd);
        }
    }
    #removeSnake(){
        document.querySelectorAll('.snake-node').forEach(e => e.remove());
    }
    renderFood(foodElement){
        if(document.getElementById("food") !== null)
            this.#removeFood();
        let food = document.createElement("div");
        food.style.top = `${foodElement.getY() * this.#CELL_SIZE}${this.#UNITS}`;
        food.style.left = `${foodElement.getX()  * this.#CELL_SIZE}${this.#UNITS}`;
        food.style.width = `${this.#CELL_SIZE}${this.#UNITS}`;
        food.style.height = `${this.#CELL_SIZE}${this.#UNITS}`;
        food.id = "food";
        this.#grid.append(food);
    }
    #removeFood(){
        let el = document.getElementById("food");
        el.remove();
    }
    renderScoreCounter(snake){
        let score = snake.getNodes().length * 10;
        document.getElementById("score-counter").innerHTML = `Score: ${score}`;

    }
}

/**
 * HANDLING CLOCK:
 *  - update the renderer a fixed amount of times per second, independently of frames
 *  - step fixed amount of times per second (around 10 cells per second)
 * 
 *  - as we dont have any speed variables to change position, prolly we should just call step() a set amount of times per second, 
 *    and this anount shold be calculated using delta time ?
 */





const RENDERER = new HtmlRenderer(document.getElementById("grid"));
const FOOD = new Node(0, 0);
const SNAKE = new Snake(0, 12);
const CLOCK = window.setInterval(update, 150);


const SNAKE_SPEED = 1; // cells per second


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
initFood();

function update(){
    SNAKE.onOutOfBounds();
    if(SNAKE.facedItself() || isWin()){
        clearInterval(CLOCK);
        console.log("gameover");
    }
    checkFood();
    RENDERER.renderScoreCounter(SNAKE);
    RENDERER.renderFood(FOOD);
    RENDERER.renderSnake(SNAKE); 
    SNAKE.step(); 
};

function findEmptyCells(){
    let cells = [];
    for(let i = 0; i < GRID_HEIGHT; i++){
        for(let j = 0; j < GRID_WIDTH; j++){
            let addFlag = true;
            for(let s = 0; s < SNAKE.getNodes().length; s++){
                if(i == SNAKE.getNodes()[s].getY() && j == SNAKE.getNodes()[s].getX())
                    addFlag = false;
            }
            if(addFlag)
                cells.push({x: j, y: i });
        }
    }
    return cells;
}

function initFood(){
    // find a random spot amongst the set of empty cells and place food there
    let cells = findEmptyCells();
    let ind = Math.floor(Math.random() * cells.length - 1);
    FOOD.setPosition(cells[ind].x, cells[ind].y);
}

function checkFood(){
    let x = SNAKE.getX();
    let y = SNAKE.getY();
    if(x === FOOD.getX() && y === FOOD.getY()){
        SNAKE.addNode();
        initFood();
    }
}

function isWin(){
    if(findEmptyCells().length === 0)
        return true;
    return false;
}


function gameLoop(){

    let currentTime = Date.now();
    let dt = (currentTime - prevTime) / 1000;

    let altSpeed = Math.floor(SNAKE_SPEED * dt);

    SNAKE.move(altSpeed)
    newUpdate();
    render();
    prevTime = currentTime;

    //requestAnimationFrame(gameLoop);
}

function newUpdate(){
}

function render(){
    RENDERER.renderSnake(SNAKE);
    RENDERER.renderFood(FOOD);
}



let prevTime = Date.now();
//requestAnimationFrame(gameLoop);