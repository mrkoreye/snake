export class Snake {
	snake = [[5, 5], [5, 6], [5, 7], [5, 8], [5, 9]];
	head = this.snake[this.snake.length - 1];
	direction = 'right';
	lengthToGrow = 2;

	boardSize = null;

	constructor(boardSize) {
		this.boardSize = boardSize;
	}
	
	turn(direction) {
		switch(direction) {
			case 'up':
				if (!(this.direction === 'down')) {
					this.direction = direction;
				}
				break;
			case 'down':
				if (!(this.direction === 'up')) {
					this.direction = direction;
				}
				break;
			case 'left':
				if (!(this.direction === 'right')) {
					this.direction = direction;
				}
				break;
			case 'right':
				if (!(this.direction === 'left')) {
					this.direction = direction;
				}
				break;
		}
	}
	
	step() {
		var newHead = [];
		
		switch(this.direction) {
			case 'left':
				newHead[0] = this.head[0] - 1;
				newHead[1] = this.head[1];
				this.changeSnake(newHead);
				break;
			case 'right':
				newHead[0] = this.head[0] + 1;
				newHead[1] = this.head[1];
				this.changeSnake(newHead);
				break;
			case 'up':
				newHead[0] = this.head[0];
				newHead[1] = this.head[1] - 1;
				this.changeSnake(newHead);
				break;
			case 'down':
				newHead[0] = this.head[0];
				newHead[1] = this.head[1] + 1;
				this.changeSnake(newHead);
				break;
			default:
				// should never get here...
		}
	}
	
	changeSnake(newHead) {
		this.snake.push(newHead);
		this.snake.shift();
		this.head = this.snake[this.snake.length - 1];
	}
	
	offBoard() {
		var overMax = (this.head[0] >= this.boardSize) || (this.head[1] >= this.boardSize);
		var underMin = (this.head[0] < 0) || (this.head[1] < 0);

		if (overMax || underMin) {
			return true;
		} else {
			return false;
		}
	}
		
	embiggenSnake() {
		var endOfSnake = this.snake[0];
		var XCoordinateDif = this.snake[0][0] - this.snake[1][0];
		var YCoordinateDif = this.snake[0][1] - this.snake[1][1];

		for (var i = 0; i < this.lengthToGrow; i++) {
			this.snake.unshift([this.snake[0] + XCoordinateDif, this.snake[1] + YCoordinateDif]);
		}
	}
	
	hitSelf() {
		const head = this.head.toString();
		return this.snake
			.slice(0, -1)
			.some((snakePiece) => snakePiece.toString() === head);
	}
};

export default Snake;
