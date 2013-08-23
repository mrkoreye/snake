$(function() {
	Game = new Snakey.Game();
	
	function createGrid() {
		var across = 30;
		var down = 30;
		for (var j = 0; j < across; j++) {
			$('.master').append($('<div class="row" id="row' + j + '">'));
			for (var i = 0; i < down; i++) {
				$('#row' + j).append($('<div class="space" id="space' + i + "_" + j + '">&nbsp;</div>'));
			}
		}
	}

	
	function renderSnake() {
		var across = 30;
		var down = 30;
		for (var i = 0; i < across; i++) {
			for (var j = 0; j < down; j++) {
				switch (Game.board.board[i][j]) {
				case "snake":
					$('#space' + i + "_" + j).removeClass("apple").addClass("snake");
					break;
				case null:
					$('#space' + i + "_" + j).removeClass("snake apple");
					break;
				case "apple":
					$('#space' + i + "_" + j).addClass("apple");
					break;
				}
			}
		}
		
		$('#messages').text("Points: " + Game.points);
	}

	createGrid();
	$('#messages').text("Welcome to Snake. Click here to Start.");
	
	$(document).keydown(function (e) {
	  var keyCode = e.keyCode;

	  switch (keyCode) {
	    case 37:
	      Game.snake.turn("up");
	    	break;
	    case 38:
	      Game.snake.turn("left");
	    	break;
	    case 39:
	      Game.snake.turn("down");
	    	break;
	    case 40:
	      Game.snake.turn("right");
	    	break;
			case  32:
				
	  }
	});
	
	$('#messages').one("click", function () {
			timer = window.setInterval(function() {
				Game.step();
				renderSnake();
							}, 100);
					} 
	 );
	
	
  


});