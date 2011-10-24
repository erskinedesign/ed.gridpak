var image_src = 'http://localhost:8000/static/images/grid.png',
		$element = $('body'),
		image = new Image();
		
	image.onload = function() {
	    // always called
	    var position = $element.position(),
	    	$grid_overlay = $('<div id="grid" style="background:url(' + image_src + ') repeat-y 0 0; display: none; position: fixed; margin: 0; z-index: 999; height: 100%";/>');
	    $grid_overlay.width('100%');
	    
	    	
	    $('body').prepend($grid_overlay);
		$(document).keyup(function(evt) {
			if (evt.keyCode == 71) {
				$grid_overlay.toggle();
			}
		});	
	};
	image.src = image_src;