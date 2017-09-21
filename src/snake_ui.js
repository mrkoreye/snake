import Game from './game';

(function() {
	var Game = new Game();
	var SnakeTimer = '';
	var across = 30;
	var down = 30;
	var gameSpeed = 120;
	
	function createGrid() {
		document.getElementById('root-div').innerHTML = '';
		for (var j = 0; j < across; j++) {
			var snakeRowElement = document.createElement('div');
			snakeRowElement.id = 'row' + j;
			snakeRowElement.classList.add('row-snake');
			document.getElementById('root-div').appendChild(snakeRowElement);

			for (var i = 0; i < down; i++) {
				var spaceElement = document.createElement('div');
				spaceElement.id = 'space' + i + "_" + j;
				spaceElement.classList.add('space');
				spaceElement.innerHTML = '&nbsp;'
				document.getElementById('row' + j).appendChild(spaceElement);
			}
		}
	}

	function renderSnake() {
		for (var i = 0; i < across; i++) {
			for (var j = 0; j < down; j++) {
				var element = document.getElementById('space' + i + "_" + j);
				removeDirectionClasses(element);
				removeAppleClasses(element);
				removeSnakeHeadClasses(element);

				switch (Game.board.board[i][j]) {
					case 'snake head':
						element.classList.remove('apple');
						element.classList.add('snake');
						element.classList.add('fa');
						element.classList.add('fa-2x');
						element.classList.add('fa-space-shuttle');
						element.classList.add(Game.snake.direction);
						element.classList.add('snake-head');
						break;
					case 'snake':
						element.classList.remove('apple');
						element.classList.add('snake');
						break;
					case null:
						element.classList.remove('snake');
						element.classList.remove('apple');
						break;
					case 'apple':
						element.classList.add('apple');
						element.classList.add('fa');
						element.classList.add('fa-spin');
						element.classList.add('fa-2x');
						element.classList.add('fa-circle-o-notch');
						break;
				}
			}
		}

		function removeSnakeHeadClasses(element) {
			element.classList.remove('fa');
			element.classList.remove('fa-space-shuttle');
			element.classList.remove('snake-head');
			element.classList.add('fa-2x');
		}

		// prolly should just do a remove all classes and then add classes in a batch instead
		function removeAppleClasses(element) {
			element.classList.remove('fa');
			element.classList.remove('fa-spin');
			element.classList.remove('fa-circle-o-notch');
			element.classList.add('fa-2x');
		}

		function removeDirectionClasses(element) {
			element.classList.remove('left');
			element.classList.remove('right');
			element.classList.remove('down');
			element.classList.remove('up');
		}
		
		document.getElementById('messages').textContent = 'Points: ' + Game.points;
	}

	function play() {
		Game = new Game();
		createGrid();
		SnakeTimer = window.setInterval(function() {
			Game.step();
			if (Game.snake.hitSelf() || Game.snake.offBoard()) {
				clearInterval(SnakeTimer);
			} else {
				renderSnake();
			}
		}, gameSpeed);
	}; 
	
	document.addEventListener('keydown', function(e) {
	  var keyCode = e.keyCode;

		if([32, 37, 38, 39, 40].indexOf(keyCode) > -1) {
      e.preventDefault();
    }

	  switch (keyCode) {
			// Spacebar
			case 32:
				if (SnakeTimer) {
					clearInterval(SnakeTimer);
				}
				play();
	    case 37:
	      Game.snake.turn('left');
	    	break;
	    case 38:
	      Game.snake.turn('up');
	    	break;
	    case 39:
	      Game.snake.turn('right');
	    	break;
	    case 40:
	      Game.snake.turn('down');
	    	break;
	  }
	});

	createGrid();
	document.getElementById('messages').textContent = 'Press Spacebar to start/restart';
})();
