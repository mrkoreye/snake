$(function() {
	Game = new Snakey.Game();
	timer = '';
	
	function createGrid() {
		$('.master').html('');
		var across = 30;
		var down = 30;
		for (var j = 0; j < across; j++) {
			$('.master').append($('<div class="row-snake" id="row' + j + '">'));
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
	$('#messages').text("Press Spacebar to start/restart");
	
	$(document).keydown(function (e) {
		
	  var keyCode = e.keyCode;

		if([32, 37, 38, 39, 40].indexOf(keyCode) > -1) {
        e.preventDefault();
    }

	  switch (keyCode) {
			case 32:
				if(timer != '') {
					clearInterval(timer);
				}
				play();
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
	  }
	});
	

		play = function () {
			Game = new Snakey.Game();
			createGrid();
			timer = window.setInterval(function() {
				Game.step();
				if(Game.snake.hitSelf() || Game.snake.offBoard()) {
					clearInterval(timer);
				} else {
					renderSnake();
				}
							}, 100);
	 }; 

});
