var $browser = {},
        $info = {},
        options = {
            snap: 50,
            cols: 5,
            col_margins: 10
        },
        current_width = 960;

$(document).ready(function(){

    $browser = $('div#browser');
    $info = $('div#info');
    draw_cols();
        
    $browser.resizable({
        grid: options.snap,
        resize: function(event, ui) {
            var col_width = 0;
            current_width = round_to_grid(ui.size.width);
            draw_cols(current_width);
            $info.html(current_width + 'px');
        }
    });
});


function draw_cols(ui_width) {
    
    var browser_width = (typeof ui_width == 'undefined') ? $browser.innerWidth() : round_to_grid(ui_width),
        col_width = (browser_width / options.cols) - (options.col_margins * options.cols) - 2,
        col = '<div class="col" style="width: ' + col_width + 'px; margin:0 ' + options.col_margins + 'px" />',
        i = 0,
        cols = '';

    for (i; i<=options.cols; i++) {
        cols += col  + "\n";
    }

    $browser.find('.col').remove();
    $browser.append($(cols));

}

function round_to_grid(width) {
    return Math.round(width / options.snap) * options.snap;
}
