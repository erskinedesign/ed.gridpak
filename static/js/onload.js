$(document).ready(function() {
  $('pre code').each(function(i, e) {hljs.highlightBlock(e, '    ')});
});


$('document').ready(function() {
	$('#save_grid').live('click', function() {
		$("#download_form")
			.addClass("added")
			.delay(2000)
			.queue(function() {
				$(this).removeClass('added');
			});
	});
});



