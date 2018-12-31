$(document).ready(function(){
    var firebaseRef = new Firebase("https://2048jj.firebaseio.com/");
                  alert(firebaseRef);
	var $gameboard = $('#gameboard');
	var $opponent = $('#opponent');

	function toJSON(){
		var rows = [[],[],[],[]];
		for(var i=0; i<4; i++){
			$gameboard.find('[data-row="'+i+'"] [data-column]').each(function(index,elem){
				var val = $(elem).attr('value');
				if(val === undefined){
					val = 0;
				}
				rows[i].push(val);
			});
		}
		return rows;
	}

	function fromJSON(boardArr){
		$opponent.find('[data-column]').removeAttr('value');
		if(boardArr === 0){
			return;
		}
		for(var i=0; i<4; i++){
			$opponent.find('[data-row="'+i+'"] [data-column]').each(function(index,elem){
				var val = boardArr[i][index];
				if(val !== 0){
					$(elem).attr('value',val)
				}
			});
		}
	}

	function spawn(){
		var x1 = Math.floor(Math.random()*4);
		var y1 = Math.floor(Math.random()*4);

		while($gameboard.find('[data-row="'+y1+'"] [data-column="'+x1+'"]').attr('value') !== undefined){
			x1 = Math.floor(Math.random()*4);
			y1 = Math.floor(Math.random()*4);
		}
		var value = Math.ceil(Math.random()*4);
		if(value < 4){
			value = '2';
		}else{
			value = '4';
		}
		$gameboard.find('[data-row="'+y1+'"] [data-column="'+x1+'"]').attr('value',value);
	}

	function shiftCell($cell, direction){
		var currX = parseInt($cell.attr('data-column'));
		var currY = parseInt($cell.parent().attr('data-row'));
		var $nextCell;
		var $nextNextCell;
		var nextX = currX;
		var nextY = currY;
		if(direction === "up" && currY > 0){
			currY--;
			nextY-=2;
		}
		else if(direction === "right" && currX < 3){
			currX++;
			nextX+=2;
		}
		else if(direction === "down" && currY < 3){
			currY++;
			nextY+=2;
		}
		else if(direction === "left" && currX > 0){
			currX--;
			nextX-=2;
		}
		var $nextCell = $gameboard.find('[data-row="'+currY+'"] [data-column="'+currX+'"]');
		var $nextNextCell = $gameboard.find('[data-row="'+nextY+'"] [data-column="'+nextX+'"]');
		if($nextCell.attr('value') === undefined){
			$nextCell.attr('value',$cell.attr('value'));
			$cell.removeAttr('value');
			if($nextNextCell.attr('value') === undefined){
				shiftCell($nextCell,direction);
			}
			return 1;
		}else{
			return 0;
		}
	}

	function coalesceCell($cell, direction){
		var currX = parseInt($cell.attr('data-column'));
		var currY = parseInt($cell.parent().attr('data-row'));
		var thisVal = $cell.attr('value');
		var $nextCell;
		var $others;
		if(direction === "up" && currY > 0){
			currY--;
			$others = $gameboard.find('[data-column="'+currX+'"]');
		}
		else if(direction === "right" && currX < 3){
			currX++;
			$others = $gameboard.find('[data-row="'+currY+'"] [value]');
		}
		else if(direction === "down" && currY < 3){
			currY++;
			$others = $gameboard.find('[data-column="'+currX+'"]');
		}
		else if(direction === "left" && currX > 0){
			currX--;
			$others = $gameboard.find('[data-row="'+currY+'"] [value]');
		}
		var $nextCell = $gameboard.find('[data-row="'+currY+'"] [data-column="'+currX+'"]');
		if($nextCell.attr('value') === thisVal){
			$nextCell.attr('value',parseInt($nextCell.attr('value'))+parseInt(thisVal));
			$cell.removeAttr('value');
			$others.each(function(index,elem){
				shiftCell($(this),direction);
			});
			return 1;
		}else{
			return 0;
		}
	}

	function move(direction){
		var count = 0;
		if(direction === "up"){
			$gameboard.find('[data-row="1"] [value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-row="2"] [value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-row="3"] [value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
		}
		if(direction === "right"){
			$gameboard.find('[data-column="2"][value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-column="1"][value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-column="0"][value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
		}
		if(direction === "down"){
			$gameboard.find('[data-row="2"] [value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-row="1"] [value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-row="0"] [value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
		}
		if(direction === "left"){
			$gameboard.find('[data-column="1"][value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-column="2"][value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
			$gameboard.find('[data-column="3"][value]').each(function(index, elem){
				count += shiftCell($(this),direction);
			}); 
		}
		return count;
	}

	function coalesce(direction){
		var count = 0;
		if(direction === "up"){
			$gameboard.find('[data-row="1"] [value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-row="2"] [value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-row="3"] [value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
		}
		if(direction === "right"){
			$gameboard.find('[data-column="2"][value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-column="1"][value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-column="0"][value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
		}
		if(direction === "down"){
			$gameboard.find('[data-row="2"] [value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-row="1"] [value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-row="0"] [value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
		}
		if(direction === "left"){
			$gameboard.find('[data-column="1"][value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-column="2"][value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
			$gameboard.find('[data-column="3"][value]').each(function(index, elem){
				count += coalesceCell($(this),direction);
			}); 
		}
		return count;
	}

	firebaseRef.once('value', function(dataSnapshot){
                     console.log('hello'); 
		var boardRef;
		var otherRef;
		if(dataSnapshot.child('board1/state').val() === "empty"){
			boardRef = firebaseRef.child('board1');
			otherRef = firebaseRef.child('board2');
		}else if(dataSnapshot.child('board2/state').val() === "empty"){
			boardRef = firebaseRef.child('board2');
			otherRef = firebaseRef.child('board1');
		}else{
			$('#clear').click(function(){
				firebaseRef.child('board1').update({board:0,state:'empty'});
				firebaseRef.child('board2').update({board:0,state:'empty'});
			});
			return;
		}
		spawn();
		spawn();
		
		boardRef.update({board: toJSON(), state:"active"});

		$('#up,#right,#down,#left').on('touchstart',function(){
			var count = 0;
			count += move($(this).attr('id'));
			count += coalesce($(this).attr('id'));
			if(count>0){
				spawn();
			}
			boardRef.update({board: toJSON(), state:'move'});
		});

        
		$(document).keydown(function(e){
		    if (e.keyCode == 38) { 
		    	$('#up').click();
		    }
		    if (e.keyCode == 39) { 
		    	$('#right').click();
		    }
		    if (e.keyCode == 40) { 
		    	$('#down').click();
		    }
		    if (e.keyCode == 37) { 
		    	$('#left').click();
		    }
		});

		otherRef.on('value', function(dataSnapshot) {
			var val = dataSnapshot.val();
			fromJSON(val.board);
		});
		
		boardRef.onDisconnect().update({board:0,state:'empty'});

		$('#clear').on('touchstart',function(){
			boardRef.update({board:0,state:'empty'});
			otherRef.update({board:0,state:'empty'});
		});
	});

});