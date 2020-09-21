/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

/** makeHtmlBoard: make HTML table and row of column tops. */

/** findSpotForCol: given column x, return top empty y (null if filled) */

/** placeInTable: update DOM to place piece into HTML table of board */

/** endGame: announce game end */

/** handleClick: handle click of column top to play piece */

/** checkForWin: check board cell-by-cell for "does a win start here?" */

class Game {
	constructor(p1, p2, height = 6, width = 7) {
		this.height = height;
		this.width = width;
		this.players = [ p1, p2 ];
		this.currPlayer = p1;
		this.makeBoard();
		this.makeHtmlBoard();
		this.gameOver = false;
	}
	//make the js board for everything to fit in the proper place
	makeBoard() {
		this.board = [];
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}
	//make visual board for game
	makeHtmlBoard() {
		const board = document.getElementById('board'); //different than 'this.board'
		board.innerHTML = ''; //this will reset the board everytime the method is called

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');

		//bind click handler function to object instance no matter what and rename to gameClick
		this.gameClick = this.handleClick.bind(this);
		top.addEventListener('click', this.gameClick);

		//create top row cells and make them hoverable on start of game
		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			headCell.setAttribute('class', 'hoverable');
			top.append(headCell);
		}

		//append top row to main board
		board.append(top);

		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}

			//append all rows/cells to board
			board.append(row);
		}
	}

	//check for empty spaces to place pieces starting from top row and going down; if full, return null
	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	//add the piece to the empty space
	placeInTable(y, x) {
		const piece = document.createElement('div'); //make a new div to represent the piece
		piece.classList.add('piece');
		piece.style.backgroundColor = this.currPlayer.color; //give piece div a bgc based on the current player
		piece.style.top = -50 * (y + 2); //position piece based upon its y position in the board

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	//what happens when the game is over either via tie or a winner
	endGame(msg) {
		setTimeout(function() {
			alert(msg);
		}, 100); //wait for piece to be placed before alerting the game is over
		const top = document.querySelector('#column-top');
		const headCells = document.querySelectorAll('.hoverable');
		for (let cell of headCells) {
			cell.classList.remove('hoverable'); //make those top cells un-hoverable
		}
		top.removeEventListener('click', this.gameClick); //make those top cells un-clickable
	}

	//click handler for placing a piece in the board
	handleClick(evt) {
		// get x (column number) from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer; //placing in js board
		this.placeInTable(y, x); //placing in html board

		// check for win
		if (this.checkForWin()) {
			this.gameOver = true; //end game
			return this.endGame(`${this.currPlayer.name} wins!`); //alert the winner
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			this.gameOver = true; //end game
			return this.endGame('Tie!');
		}

		// switch players
		this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
	}

	//check if there's a winner
	checkForWin() {
		const _win = (cells) => {
			//use arrow function so it doesn't create a new 'this' and throw off the object references
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([ y, x ]) =>
					y >= 0 &&
					y < this.height &&
					x >= 0 &&
					x < this.width &&
					this.board[y][x] === this.currPlayer
			);
		};

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

//create player class to keep track of players during the game
class Player {
	constructor(colorChoice, name) {
		this.color = colorChoice;
		this.name = name;
	}
}

//start the game
const playerForm = document.querySelector('#player-form');
const p1color = document.getElementById('p1-bgc');
const p1Name = document.getElementById('p1-name');
const p2color = document.getElementById('p2-bgc');
const p2Name = document.getElementById('p2-name');

playerForm.addEventListener('submit', (e) => {
	e.preventDefault(); //prevent page reload
	let p1 = new Player(p1color.value, p1Name.value); //create player1 object
	let p2 = new Player(p2color.value, p2Name.value); //create player2 object
	if (p1.color !== '' && p2.color !== '') {
		new Game(p1, p2);
		p1Name.style.backgroundColor = p1.color;
		console.log(p1.color);
		p1Name.style.color = 'white';
		p2Name.style.backgroundColor = p2.color;
		p2Name.style.color = 'white';
	} else {
		alert('Please enter a color for each player');
	}
});
