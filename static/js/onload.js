var $browser = {},
        $info = {},
        options = {
            snap: 50,
            cols: 10
        };

$(document).ready(function(){

    $browser = $('div#browser');
    $info = $('div#info');
    draw_cols();
        
    $browser.resizable({
        grid: options.snap,
        resize: function(event, ui) {
            width = Math.round(ui.size.width / options.snap) * 50;
            $info.html(width + 'px');
        }
    });
});


function draw_cols() {

    var col = '<div class="col" />',
        i = 0;

    for (i; i<=options.cols; i++) {
        $browser.append($(col));
    }

}
