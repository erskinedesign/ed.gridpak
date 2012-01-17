/*!
 * JAVASCRIPT
 */

var gridpak = {

    $container: {},

    css: '',

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

        markup = '<div id="gridpak" />';

        this.css += '<style type="text/css"> ' +
            '#gridpak { ' +
                'width:100%; ' +
                'height:100%; ' +
                'display:block; ' +
            '} ' +
            '#gridpak .gridpak_grid { ' +
                'width:100%; ' +
                'height:100%; ' +
                'display:block; ' +
            '} ' +
            '#gridpak .gridpak_col { ' +
                'border-left:0 solid rgba(255,255,255,0); ' +
                'border-right:0 solid rgba(255,255,255,0); ' +
                '-moz-background-clip: padding; -webkit-background-clip: padding-box; background-clip: padding-box;' +
                'padding:0; ' +
                '-webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; ' +
                'display:block; ' +
                'float:left; ' +
                'height:100%; ' +
                'background-color:rgba(153,0,0,0.2); ' +

            '} ' +
            '#gridpak .gridpak_visible { ' +
                'width:100%; ' +
                'height:100%; ' +
                'display:block; ' +
                'background:rgba(255,255,255,0.3); ' +
            '} ';

        this.$container = $(markup);

        // Put the grids on the screen
        for (i; i<=numGrids; i++) {
            gridpak.drawGrid(grids[i]);
        }

        this.css += '</style>';
        $('body').prepend(this.css);

        this.toggleGrid();

        $('body').append(gridpak.$container);

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

        markup = '<div class="gridpak_grid gridpak_grid_' + i + '">';

        this.css += '#gridpak .gridpak_grid_' + i + ' .gridpak_col { ' +
            'width:' + width + '%; ' +
            'border-left-width:' + border + grid.gutter_type + '; ' +
            'border-right-width:' + border + grid.gutter_type + '; ' +
            'padding-left:' + grid.padding_width + grid.padding_type +'; ' +
            'padding-right:' + grid.padding_width + grid.padding_type + '; ' +
        '} ';

        for(i; i<=grid.col_num; i++) {

            markup += '<div class="gridpak_col"><div class="gridpak_visible"></div></div> <!-- // .gridpak_col -->';
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
