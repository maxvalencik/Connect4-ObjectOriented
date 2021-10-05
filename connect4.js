/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


//Game class
class Game{

  //constructor initializes the game
  constructor(width, height,player1, player2){
    this.width=width;
    this.height=height;
    this.board = [];// array of rows, each row is array of cells  (board[y][x])
    this.players = [player1, player2];//array stroing the players (object)
    this.currPlayer = this.players[0];// active player - player object from class player
    this.gameOver=false;

    this.makeBoard();
    this.makeHtmlBoard();
    this.playerName();
  }

  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */ 
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);//this is the class. Bind the class to handleclick
    top.addEventListener('click', this.handleGameClick);//handleclick is not called in the event listener, just refrenced. Need to bind this to class before or this would be the top line.

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor=this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    //flag if game is over, exit the function and ignore further clicks
    if (this.gameOver){
      return;
    }
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.name;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.gameOver=true;

      return this.endGame(`${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
   [this.players[0], this.players[1]]=[this.players[1],this.players[0]];
    this.currPlayer = this.players[0];
    this.playerName();
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = cells =>
          cells.every(
            ([y, x]) =>
              y >= 0 &&
              y < this.height &&
              x >= 0 &&
              x < this.width &&
              this.board[y][x] === this.currPlayer.name
          );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  // Change player name on page
  playerName (){
    const playerName = document.getElementById('player');
    playerName.innerText = this.currPlayer.name;
  }

}


//player class
class Player{
  constructor(name, color){
    this.name = name;
    this.color = color;
  }
}



//Loading page

//reset/start game with button
document.getElementById('play').addEventListener('click', (e)=>{
  //erase exisitng htmlBoard
  document.getElementById('board').innerHTML='';

  //create players
  let color1 = document.getElementById("color1");
  let color2 = document.getElementById("color2");

  let p1 = new Player (document.getElementById("p1").value, color1.options[color1.selectedIndex].text);
  let p2 = new Player (document.getElementById("p2").value, color2.options[color2.selectedIndex].text);

  if(p1.name && p2.name !== undefined){
    //start new game
    new Game(7,6,p1,p2);
  } else{
    alert ("Enter player names...");
  }
 
});


















