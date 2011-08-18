$(document).ready(function(){
    var $browser = $('div#browser'),
        $info = $('div#info'),
        grid = 50;

    $browser.resizable({
        grid: grid,
        resize: function(event, ui) {
            width = Math.round(ui.size.width / grid) * 50;
            $info.html(width + 'px');
        }
    });
});
