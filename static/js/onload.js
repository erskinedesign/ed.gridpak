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
    $width = $info.find('input#width');
    $cols = $info.find('input#cols');
    $col_margins = $info.find('input#col_margins');

    $('button#set_options').live('click', set_options);

    draw_cols();
        
    $browser.resizable({
        grid: options.snap,
        resize: function(event, ui) {
            var col_width = 0;
            current_width = round_to_grid(ui.size.width);
            draw_cols(current_width);
            $width.val(current_width + 'px');
            $cols.val(options.cols);
            $col_margins.val(options.col_margins);
        }
    });
});


function draw_cols(ui_width) {
    options.col_margins = '1%';
    var browser_width = (typeof ui_width == 'undefined') ? $browser.innerWidth() : round_to_grid(ui_width),
        col_width = (browser_width / options.cols) - (options.col_margins * 2),
        col = '<div class="col" style="width: ' + col_width + 'px; margin:0 ' + options.col_margins + '" />',
        i = 0,
        cols = '';

    $browser.width(browser_width);

    for (i; i<options.cols; i++) {
        cols += col  + "\n";
    }

    $browser.find('.col').remove();
    $browser.append($(cols));

}

function round_to_grid(width) {
    return Math.round(width / options.snap) * options.snap;
}


function set_options() {

    options.width = $('input#width').val();
    options.cols = $('input#cols').val();
    options.col_margins = $('input#col_margins').val();

    draw_cols(options.width);

}
