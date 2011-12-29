/**
 * JAVASCRIPT
 */



/*!
 * JAVASCRIPT
 */

var gridpak = {

    $container: {},

    css: '<style type="text/css">#gridpak { display: block; padding: 50px; background: red; }</style>',

    /**
     * Insert jQuery if it's not already there
     *
     * Checks for jQuery and includes it from Google CDN if not
     *
     */
    bootstrap: function() {
        var jquerySrc = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js',
            script = {},
            that = this;

        // Have they brought a knife to gunfight?
        if (typeof(window.jQuery) == 'undefined') {
            script = document.createElement('script');
            script.src= jquerySrc;
            // Insert it right after the opening body tag
            document.body.insertBefore(script, document.body.firstChild);
            setTimeout('gridpak.init()', 200);
        } else {
            $('document').ready(this.init);
        }
    },

    /**
     * Make our cols and set up resizing functions
     */
    init: function() {
        var gridOn = false,
            grids = [
                {grids:loop}
                {
                    min_width: {{ min_width }},
                    col_num: {{ col_num }},
                    gutter_type: '{{ gutter_type }}',
                    gutter_width: {{ gutter_width }},
                    padding_type: '{{ padding_type }}',
                    padding_width: {{ padding_width }},
                    lower: {{ lower }},
                    upper: {{ upper }}
                },
                {/grids:loop}
            ],
            numGrids = grids.length - 1,
            i = 0,
            markup = '';

        markup = '<div id="gridpak" style="' +
            'position:fixed; ' +
            'left:0; ' +
            'top:0; ' +
            'width:100%; ' +
            'height:100%;' +
            '" />';

        this.$container = $(markup);
        $('body').append(gridpak.$container);

        // Put the grids on the screen
        for (i; i<=numGrids; i++) {
            gridpak.drawGrid(grids[i]);
        }

     },

     drawGrid: function(grid) {
        var markup = '',
            style = '',
            i = 0,
            width = 100 / grid.col_num
            border = grid.gutter_width / 2;


        markup = '<div class="gridpak_grid" style="' +
            'width:100%; ' +
            'height:100%; ' +
            'display:block;' +
            '">';

        for(i; i<=grid.col_num; i++) {

            border_left = (i > 0) ? border : 0;
            border_right = (i < grid.col_num) ? border : 0;

            // Inline styles FTW
            style = 'width:' + width + '%; ' +
                'border-left:' + border_left + grid.gutter_type + ' solid rgba(255,255,255,0.8); ' +
                'border-right:' + border_right + grid.gutter_type + ' solid rgba(255,255,255,0.8); ' +
                'padding:' + grid.padding_width + grid.padding_type + '; ' +
                '-webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; ' +
                'display:block; ' +
                'float:left; ' +
                'height:100%; ' +
                'background-color:rgba(0,0,0,0.5);';

            markup += '<div class="gridpak_col" style="' + style + '"><div class="gridpak_visible"></div></div>';
        }

        markup += '</div><!-- // .gridpak_grid -->';

        gridpak.$container.append(markup);

     }

 }


// Kick it off!
gridpak.bootstrap();

