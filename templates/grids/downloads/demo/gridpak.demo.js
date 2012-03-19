/*!
 * JAVASCRIPT
 */

var gridpak = {

    $container: {},

    /**
     * DOM element to append the Gridpak too
     *
     */
    append: 'div.page',

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
            $(function() { that.init(); });
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
                    col_num: 2,
                    gutter_type: 'px',
                    gutter_width: 12,
                    padding_type: 'px',
                    padding_width: 12,
                    upper: 319
                },
                
                {
                    min_width: 320,
                    col_num: 6,
                    gutter_type: '%',
                    gutter_width: 2,
                    padding_type: '%',
                    padding_width: 2,
                    upper: 919
                },
                
                {
                    min_width: 920,
                    col_num: 12,
                    gutter_type: 'px',
                    gutter_width: 12,
                    padding_type: 'px',
                    padding_width: 12,
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
                'position:absolute; ' +
                'top:0; ' +
                'left:0; ' +
            '} ' +
            '#gridpak .gridpak_grid { ' +
                'height:100%; ' +
                'display:none; ' +
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
            gridpak.drawGrid(grids[i], i);

        }

        this.css += '</style>';
        $(this.append).prepend(this.css);

        this.toggleGrid();

        $(this.append).append(gridpak.$container);

     },

     /**
      * Draw grid
      *
      * Draws a single grid, usually called from a loop
      */
     drawGrid: function(grid, num) {
        var markup = '',
            style = '',
            i = 1,
            gutter_pc = (grid.gutter_type == '%') ? grid.gutter_width : 0,
            gutter_px = (grid.gutter_type == 'px') ? grid.gutter_width : 0,
            width = 0;

        if (grid.gutter_type == 'px') {
            width = 100 / grid.col_num;
        } else {
            width = (100 - (gutter_pc * (grid.col_num - 1))) / grid.col_num;
        }

        markup = '<div class="gridpak_grid gridpak_grid_' + num + '">';

        this.css += '#gridpak .gridpak_grid_' + num + ' { ' +
            'margin-left:-' + gutter_px + 'px; ' +
        '} ' +
        '#gridpak .gridpak_grid_' + num + ' .gridpak_col { ' +
            'width:' + width + '%; ' +
            'margin-left:' + gutter_pc + '%; ' +
            'border-left-width:' + gutter_px + 'px; ' +
            'padding-left:' + grid.padding_width + grid.padding_type +'; ' +
            'padding-right:' + grid.padding_width + grid.padding_type + '; ' +
        '} ';
        if (grid.gutter_type == '%') {
            this.css += '#gridpak .gridpak_grid_' + num + ' .gridpak_col:first-child { ' +
                'margin-left:0;' +
            '} ';
        }

        this.css += '@media screen and (min-width: ' + grid.min_width + 'px) ';
        if (grid.upper != false) this.css += 'and (max-width: ' + grid.upper + 'px) ';
        this.css += ' { ' +
            '#gridpak .gridpak_grid_' + num + ' { ' +
                'display: block; ' +
            '} ' +
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
