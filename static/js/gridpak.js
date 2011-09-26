/*!
 * Gridpak
 *
 *
 * @author Erskine Design [Wil Linssen]
 */
$(function() {

    /**
     * Grid model
     *
     * @attribute (int) min_width
     * @attribute (int) col_num
     * @attribute (int) col_padding_width
     * @attribute (string) col_padding_type
     * @attribute (int) gutter_width
     * @attribute (string) gutter_type
     * @attribute (int) baseline_height
     * @attribute (int) current_width DO WE NEED THIS??
     * @attribute (int) lower
     * @attribute (int) upper
     * @attribute (boolean) current
     */
    window.Grid = Backbone.Model.extend({

        /**
         * Model defaults
         *
         */
        defaults: {
            min_width: 960,
            col_num: 16,
            col_padding_width: 10,
            col_padding_type: 'px',
            gutter_width: 8,
            gutter_type: 'px',
            baseline_height: 22,
            col_width: 0,
            lower: 0,
            upper: 0,
            current: true
        },

        limits: {
            max_cols: 99,
            allowed_types: ['px', '%'],
            min_grid_width: 200
        },

        /**
         * Validate the model
         *
         * Backbone method
         *
         * @param (object) attrs
         * @return (string) error
         */
        validate: function(attrs) {

            var settings = this.limits;

            // I got 99 cols but a bitch ain't one
            if (attrs.col_num > settings.max_cols || attrs.col_num < 1) {
                return 'Must be betwee 1 and ' + settings.max_cols + ' cols';
            }

            // Int params must be integers
            if (
                (typeof(attrs.min_width) != 'undefined' && !this.isInt(attrs.min_width)) ||
                (typeof(attrs.col_num) != 'undefined' && !this.isInt(attrs.col_num)) ||
                (typeof(attrs.col_padding_width) != 'undefined' && !this.isInt(attrs.col_padding_width)) ||
                (typeof(attrs.gutter_width) != 'undefined' && !this.isInt(attrs.gutter_width)) ||
                (typeof(attrs.baseline_height) != 'undefined' && !this.isInt(attrs.baseline_height))
            ) {
                return 'Use integers for integers';
            }

            // px or % params
            if (
                typeof(attrs.col_padding_type) != 'undefined' && _.indexOf(settings.allowed_types, attrs.col_padding_type) || 
                typeof(attrs.gutter_type) != 'undefined' && _.indexOf(settings.allowed_types, attrs.gutter_type)
            ) {
                return 'Wrong type of padding / gutter';
            }

            // Has to have a minimum grid width
            if (
                (attrs.upper && attrs.lower) &&
                (attrs.upper - attrs.lower) < settings.min_grid_width
            ) {
                return 'Grid must be a minium width of ' + settings.min_grid_width + 'px';
            }

        },

        /**
         * Validate var is integer
         *
         * @param (string) x
         * @return boolean
         */
        isInt: function(x) {
            var y = parseInt(x); 
            if (isNaN(y)) return false; 
            return x == y && x.toString() == y.toString(); 
         },

        /**
         * Update the models current width
         *
         */
        updateWidth: function(new_width) {
            var col_width = 0,
                col_padding = 0,
                gutter = 0;

            // fixed with gutters
            if (this.get('gutter_type') == 'px') {
                gutter_width = this.get('gutter_width');
            } else {
                gutter_width = Math.floor(((new_width / 100) * this.gutter_width));
            }

            // fixed percentage width padding
            if (this.get('col_padding_type') == 'px') {
                col_padding = this.get('col_padding_width');
            // work the width from percentages
            } else {
                col_padding = Math.floor((new_width / 100) * this.get('col_padding_width'));
            }

            col_width = Math.floor((new_width / this.get('col_num')) - gutter_width - (col_padding * 2));
            col_width += Math.floor(gutter_width / this.get('col_num'));

            this.set({ 
                col_width: col_width,
                current_width: new_width
            });

        },

        /**
         * Get the model in the collection x steps away up (+) or down (-)
         *
         * @return (object) grid
         */
        getRelativeTo: function(direction, index) {
            var at = (typeof(index) != 'undefined') ? index : this.collection.indexOf(this);
            return this.collection.at(at + direction);
        },

        /**
         * Find the upper and lower limits
         *
         */
        setLimits: function(index) {
            var at = (typeof(index) != 'undefined') ? index : undefined,
                atat = this.collection.at(at),
                is_new = (typeof(atat) == 'undefined' || atat.cid != this.cid) ? true : false,
                prev = this.getRelativeTo(-1, at),
                next = (is_new) ? this.getRelativeTo(0, at) : this.getRelativeTo(1, at),
                limits = { lower: 0, upper: false };

            // Work out the limits of the grid
            if (prev) {
                limits.lower = this.get('min_width');
            }

            // If there's a grid above us
            if (next) {
                limits.upper = next.get('min_width');
            // If not, we need to update the previous grids upper
            } else if (prev) {
                prev.set({ upper: this.get('min_width') });
            }

            // Now set the limits of this model
            this.set(limits);

        },

    });

    /**
     * Grid collection
     *
     */
    window.GridList = Backbone.Collection.extend({

        model: Grid,

        current: false,

        url: '/',

        comparator: function(grid)
        {
            return grid.get('min_width');
        }

    });

    // Use prototyping to add a check for the next and previous models
    // then assign the lower and upper limits accordingly
    GridList.prototype.add = function(grid) {
        var that = this;

        // Loop the array if it is one
        if (_.isArray(grid)) {
            _.each(grid, function(attrs) {
                var grid = new Grid(attrs);
                grid.collection = that;
                if(grid.setLimits(that.sortedIndex(grid, that.comparator))) {
                    Backbone.Collection.prototype.add.call(that, grid);
                }
            });
        // Single model
        } else {
            var grid = new Grid(grid);
            grid.collection = this;
            if(grid.setLimits(this.sortedIndex(grid, this.comparator))) {
                Backbone.Collection.prototype.add.call(that, grid);
            }
        }
    };

    window.Grids = new GridList([
        { min_width: 100, col_num: 4, col_padding_width: 5, col_padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22, current: false },
        { min_width: 500, col_num: 8, col_padding_width: 5, col_padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22, current: false },
        { min_width: 960, col_num: 16, col_padding_width: 10, col_padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22, current: true },
    ]);
    // Set the current grid as the last in the collection
    window.Grids.current = window.Grids.at(Grids.length - 1);

    /**
     * Grid info view
     *
     */
    window.GridView = Backbone.View.extend({

        tagName: 'li',

        template: _.template($('#grid_template').html()),

        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
        },

        events: {
            'click .remove' : 'clear'
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            this.stringify();
            return this;
        },

        stringify: function() {
            $('#stringified').val(JSON.stringify(Grids));
        },

        remove: function() {
            $(this.el).remove();
        },

        clear: function() {
            this.model.destroy();
            Grids.determineUpperLowers();
        }

    });

    /**
     * The application
     *
     */
    window.AppView = Backbone.View.extend({

        $browser: {},
        snap: 20,

        el: $('#gridpak'),

        events: {
            'click #save_grid': 'createGrid',
            'click #grid_options input[type="number"]': 'updateOptions',
            'keyup #grid_options input[type="number"]': 'updateOptions',
            'change #grid_options select': 'updateOptions'
        },

        initialize: function() {
            var that = this,
                width = 0;

            this.input = this.$('#grid_options');

            this.$browser = $('#browser').resizable({
                handles: { e: $(".dragme") },
                grid: this.snap,
                minWidth: 300,
                resize: function(e, ui) {
                    that.resize(e, ui);
                }
            });

            // Set the initial new min width / old width
            width = this.$browser.width();
            $('#new_min_width').val(width);

            // Create the views and render them to the DOM
            Grids.each(function(grid) {
                that.addGrid(grid);
            });

            // Bind this.addOne every time a new model is added to the collection
            Grids.bind('add', this.addOne, this);

            // Update the width of the current model
            this.updateWidth(width);
        },


        resize: function(e, ui) {
            var old_width = $('#new_min_width').val(),
                current_width = Math.round(ui.size.width / this.snap) * this.snap,
                direction = false;

            // ensure we only fire every time we snap to a new width
            if (old_width == current_width) return false;

            // If we're out of bounds of the grid, switch to a new one
            if (current_width < Grids.current.get('lower') || (Grids.current.get('upper') !== false && current_width > Grids.current.get('upper')))
            {
                // must now swap to the next view DOWN
                direction = (current_width < Grids.current.get('lower')) ? - 1 : + 1;
                Grids.current.set({ current: false });
                Grids.current = Grids.current.getRelativeTo(direction);
                Grids.current.set({ current: true });
                App.refreshOptions();
                return false;
            }

            this.updateWidth(current_width);

        },

        updateWidth: function(width) {

            // Store the browser's width
            $('#new_min_width').val(width);

            // Update the current model's widths
            Grids.current.updateWidth(width);

        },

        addGrid: function(grid) {
            var view = new GridView({ model: grid });
            this.$('#grid_list').append(view.render().el);
        },

        refreshOptions: function() {
            $('#new_min_width').val(Grids.current.get('min_width'));
            $('#new_col_num').val(Grids.current.get('col_num'));
            $('#new_col_padding_width').val(Grids.current.get('col_padding_width'));
            $('#new_col_padding_type').val(Grids.current.get('col_padding_type'));
            $('#new_gutter_width').val(Grids.current.get('gutter_width'));
            $('#new_gutter_type').val(Grids.current.get('gutter_type'));
            $('#new_baseline_height').val(Grids.current.get('baseline_height'));
        },

        updateOptions: function() {
            Grids.current.set({
                min_width: $('#new_min_width').val(),
                col_num: $('#new_col_num').val(),
                col_width: false,
                col_padding_width: $('#new_col_padding_width').val(),
                col_padding_type: $('#new_col_padding_type').val(),
                gutter_width: $('#new_gutter_width').val(),
                gutter_type: $('#new_gutter_type').val(),
                baseline_height: $('#new_baseline_height').val()
            });
            this.updateWidth(this.$browser.width());
        },

        createGrid: function(e) {

            var new_grid = new Grid({
                min_width: $('#new_min_width').val(),
                col_num: $('#new_col_num').val(),
                col_width: false,
                col_padding_width: $('#new_col_padding_width').val(),
                col_padding_type: $('#new_col_padding_type').val(),
                gutter_width: $('#new_gutter_width').val(),
                gutter_type: $('#new_gutter_type').val(),
                baseline_height: $('#new_baseline_height').val(),
                lower: 0,
                upper: 0,
                current: true
            });

            Grids.add(new_grid);
        },

        addOne: function(grid) {
            var view = new GridView({ model: grid });
            this.$('#grid_list').append(view.render().el);
        }

     });

     window.App = new AppView;

});
