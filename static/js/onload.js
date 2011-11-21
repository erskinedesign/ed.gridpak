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

