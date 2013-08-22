$(function() {
	var across = 30;
	var down = 30;

	function createGrid() {
		for (var j = 0; j < across; j++) {
			$('.master').append($('<div class="row" id="row' + j + '">'));
			for (var i = 0; i < down; i++) {
				$('#row' + j).append($('<div class="space" id="space' + i + "_" + j + '">&nbsp;</div>'));
			}
		}
	}

	function createGrid() {
		for (var j = 0; j < across; j++) {
			$('.master').append($('<div class="row" id="row' + j + '">'));
			for (var i = 0; i < down; i++) {
				$('#row' + j).append($('<div class="space" id="space' + i + j + '">&nbsp;</div>'));
			}
		}
	}


});