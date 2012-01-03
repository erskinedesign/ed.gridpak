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
            setTimeout('gridpak.init()', 500);
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

                {
                    min_width: 0,
                    col_num: 5,
                    gutter_type: 'px',
                    gutter_width: 8,
                    padding_type: 'px',
                    padding_width: 10,
                    lower: 0,
                    upper: false
                },

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

        this.toggleGrid();

     },

     /**
      * Draw grid
      *
      * Draws a single grid, usually called from a loop
      */
     drawGrid: function(grid) {
        var markup = '',
            style = '',
            i = 1,
            width = 100 / grid.col_num
            border = grid.gutter_width / 2;

        markup = '<div class="gridpak_grid" style="' +
            'width:100%; ' +
            'height:100%; ' +
            'display:block;' +
            '">';

        for(i; i<=grid.col_num; i++) {

            border_left = (i > 1) ? border : 0;
            border_right = (i < grid.col_num) ? border : 0;

            // Inline styles FTW
            style = 'width:' + width + '%; ' +
                'border-left:' + border_left + grid.gutter_type + ' solid rgba(255,255,255,1); ' +
                'border-right:' + border_right + grid.gutter_type + ' solid rgba(255,255,255,1); ' +
                'padding:0 ' + grid.padding_width + grid.padding_type + '; ' +
                '-webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; ' +
                'display:block; ' +
                'float:left; ' +
                'height:100%; ' +
                'background-color:rgba(153,0,0,0.2);';

            markup += '<div class="gridpak_col" style="' + style + '"><div class="gridpak_visible" style="background-color:rgba(255,255,255,0.5); height:100%; width:100%; display:block;"></div></div>';
        }

        markup += '</div><!-- // .gridpak_grid -->';

        gridpak.$container.append(markup);

     },

     /**
      * Toggles the grids visibility with a keypress
      */
     toggleGrid: function() {
        var that = this;

        $(document).keyup(function(e) {
            if (e.keyCode == 71) {
                that.$container.toggle();
            }
        });
     },

 }


// Kick it off!
gridpak.bootstrap();
