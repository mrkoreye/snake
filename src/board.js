class Board {
  board = null;
  boardSize = null;

  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = this.createBoard();
  }
  
  update(snake) {
    this.clearBoardOfSnake();
    snake.snake.forEach((snakePiece) => {
      const row = snakePiece[0];
      const col = snakePiece[1];

      if (this.board[row]) {
        let value = 'snake';
        if (snake.head[0] === row && snake.head[1] === col) {
          value += ' head';
        }
        
        this.board[row][col] = value;
      }
    });
      
  }
  
  createBoard() {
    const board = new Array(this.boardSize).fill(null);
    return board.map((el) => new Array(this.boardSize).fill(null));
  }
  
  clearBoardOfSnake() {
    this.board = this.board.map((row) => {
      return row.map((element) => {
        if (element === 'apple') {
          return element
        }

        return null;
      })
    });
  }
}

export default Board;