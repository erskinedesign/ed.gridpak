/*!
 * Gridpak v0.1b
 * http://gridpak.com/
 *
 * Copyright 2011, Erskine Design
 * Author: Erskine Design [Wil Linssen]
 */
$(function() {

    /**
     * Grid model
     * -------------------------------------------------------------------------------------------------------
     */
    window.Grid = Backbone.Model.extend({

        // Model's defaults
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

        /**
         * Validate the model
         *
         * Backbone method
         *
         * @param object attrs
         * @return string error
         */
        validate: function(attrs) {

            var settings = {
                max_cols: 99,
                allowed_types: ['px', '%'],
                min_grid_width: 200,
                min_min_width: 320,
            };

            // Int params must be integers
            if (
                (typeof(attrs.min_width) != 'undefined' && !this.isInt(attrs.min_width)) ||
                (typeof(attrs.col_num) != 'undefined' && !this.isInt(attrs.col_num)) ||
                (typeof(attrs.col_padding_width) != 'undefined' && isNaN(attrs.col_padding_width)) ||
                (typeof(attrs.gutter_width) != 'undefined' && isNaN(attrs.gutter_width)) ||
                (typeof(attrs.baseline_height) != 'undefined' && !this.isInt(attrs.baseline_height))
            ) {
                return 'Use integers for integers';
            }

            // I got 99 cols but a bitch ain't one
            if (attrs.col_num > settings.max_cols || attrs.col_num < 1) {
                return 'Must be between 1 and ' + settings.max_cols + ' cols';
            }

            // Make sure it's bigger than the minimum the browser can be resized to
            if (attrs.min_width < settings.min_min_width) {
                return 'The smallest min_width you can have is ' + settings.min_width + '.';
            }

            // px or % params
            if (
                (typeof(attrs.col_padding_type) != 'undefined' && _.indexOf(settings.allowed_types, attrs.col_padding_type) == -1) || 
                (typeof(attrs.gutter_type) != 'undefined' && _.indexOf(settings.allowed_types, attrs.gutter_type) == -1)
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
         * @param string x
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
         * @param integer new_width
         * @return void
         */
        updateWidth: function(new_width) {
            var col_width = 0,
                col_num = this.get('col_num');

            col_width = Math.floor(new_width / col_num);

            this.set({ 
                col_width: col_width,
                current_width: new_width
            });

        },

        /**
         * Get the model's position in the collection
         *
         * @return integer index
         */
        getPosition: function() {
            return this.collection.indexOf(this);
        },

        /**
         * Get the model in the collection x steps away up (+) or down (-)
         *
         * @param integer direction
         * @param integer index
         * @return Grid grid
         */
        getRelativeTo: function(direction, index) {
            var at = (typeof(index) != 'undefined') ? index : this.getPosition();
            return this.collection.at(at + direction);
        },

        /**
         * Find the upper and lower limits
         *
         * @return boolean
         */
        setLimits: function() {
            var new_limits = { lower: 0, upper: false },
                old_limits = { lower: 0, upper: false },
                old_limits_cache = { lower: 0, upper: false };

            if (this.collection.current === false) {
                // There isn't a current grid, so it must the first time around
                // so we'll have to use the previous grid
                this.set(new_limits);
                return true;
            }

            // We set the new grid to the right of the old one every time
            // so the new upper is the old upper and the new lower is the current width
            new_limits.lower = this.get('min_width');
            new_limits.upper = old_limits_cache.upper = this.collection.current.get('upper');

            // The old lower is remains the same, we're just moving the upper to make room
            // for the new grid
            old_limits.lower = old_limits_cache.lower = this.collection.current.get('lower');
            old_limits.upper = this.get('min_width');

            // First we'll set the old limits and fail if there's a problem
            if (!this.collection.current.set(old_limits)) return false;

            // Now set the new limits, restoring the old limits upon failure
            if (!this.set(new_limits)) {
                this.collection.current.set(old_limits_cache);
                return false;
            }

            // If we've made it here, all is well
            return true;

        },

    });


    /**
     * Grids collection
     * -------------------------------------------------------------------------------------------------------
     */
    window.GridList = Backbone.Collection.extend({

        model: Grid,

        current: false,

        url: '/',

        /**
         * Comparator keeps the collection ordered
         *
         * @param Grid grid
         * @return integer
         */
        comparator: function(grid)
        {
            return grid.get('min_width');
        },

        /**
         * Dump the collection as a string to the console
         *
         * @return void
         */
        dump: function()
        {
            var message = '';
            this.each(function(grid) {
                message += grid.cid + ': min_width(' + grid.get('min_width') + ")   \t\t" +
                    grid.get('lower') + ' to ' + grid.get('upper') + "\t" +
                    'padding: ' + grid.get('col_padding_width') + grid.get('col_padding_type') + ' | ' +
                    'gutter: ' + grid.get('gutter_width') + grid.get('gutter_type') + ' | ' +
                    'baseline: ' + grid.get('baseline_height') + "\n"
                    ;
            });
            console.log(message);
        }

    });

    /**
     * Prototyping the collections add function to set limits at the same time
     *
     * @param Grid grid
     * @return void
     */
    GridList.prototype.add = function(grid) {
        var that = this;

        // Loop the array if it is one
        var grid = new Grid(grid);
        grid.collection = this;
        if(grid.setLimits(this.sortedIndex(grid, this.comparator))) {
            // Reset the current grid
            if (that.current) that.current.set({ current: false });
            that.current = grid;
            Backbone.Collection.prototype.add.call(that, grid);
        }
        // this.dump();
    };

    window.Grids = new GridList();
    Grids.add(new Grid({ min_width: 0, col_num: 4, col_padding_width: 5, col_padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22 }));
    Grids.add(new Grid({ min_width: 500, col_num: 8, col_padding_width: 5, col_padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22 }));
    Grids.add(new Grid({ min_width: 960, col_num: 16, col_padding_width: 10, col_padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22 }));

    // Set the current grid as the last in the collection
    window.Grids.current = window.Grids.at(Grids.length - 1);

    /**
     * Grid info view
     *
     */
    window.GridView = Backbone.View.extend({

        tagName: 'li',

        template: _.template($('#grid_template').html()),

        /**
         * Constructor
         *
         * @return void
         */
        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
            this.model.bind('error', this.errorHandler);
        },

        events: {
            'click .remove' : 'clear'
        },

        /**
         * Render the view
         *
         * @return this
         */
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            this.stringify();
            return this;
        },

        /**
         * JSONafy the collection and set it to an input
         *
         * @return void
         */
        stringify: function() {
            $('#stringified').val(JSON.stringify(Grids));
        },

        /**
         * Remove the view from the DOM
         *
         * @return void
         */
        remove: function() {
            $(this.el).remove();
        },

        /**
         * Clear a grid from the view, set sibling limits accordingly
         *
         * @return void
         */
        clear: function() {
            var prev = this.model.getRelativeTo(-1),
                next = this.model.getRelativeTo(1),
                width = $('#new_min_width').val(),
                is_cur = this.model.get('current'),
                options = {};

            if (this.model.collection.length == 1) {
                this.errorHandler(this.model, 'You must have at least one grid');
                return false;
            }

            if (next) {
                options.lower = this.model.get('lower');
                options.min_width = options.lower;
                target = next;
            } else if (prev) {
                options.upper = this.model.get('upper');
                target = prev;
            }

            // If the one we're removing was the active one, set the current to the target
            if (is_cur) {
                this.model.collection.current = target;
                options.current = true;
            }

            target.set(options);

            // Stuff will have changed
            this.model.collection.current.updateWidth(width);
            App.refreshOptions();
            this.model.destroy();
            // Grids.dump();
        },

        errorHandler: function() {
            alert(arguments[1]);
        }

    });


    /**
     * The application
     * -------------------------------------------------------------------------------------------------------
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

        /**
         * Constructor
         *
         * @return void
         */
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

            // Bind this.addGrid every time a new model is added to the collection
            Grids.bind('add', this.addGrid, this);

            // Update the width of the current model
            this.updateWidth(width);
        },

        /**
         * Resize app, fired from jQuery UI resizable
         *
         * @return void
         */
        resize: function(e, ui) {
            var old_width = $('#new_min_width').val(),
                current_width = Math.round(ui.size.width / this.snap) * this.snap;

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

        /**
         * Update the collection and form's current width
         *
         * @param integer width
         * @return void
         */
        updateWidth: function(width) {

            // Store the browser's width
            $('#new_min_width').val(width);

            // Update the current model's widths
            Grids.current.updateWidth(width);

        },

        /**
         * Bound to Grids collection 'add' method
         *
         * @param Grid grid
         * @return void
         */
        addGrid: function(grid) {
            var view = new GridView({ model: grid });
            this.$('#grid_list').append(view.render().el);
        },

        /**
         * Collects options from the form for a Grid
         *
         * @return object
         */
        fetchOptions: function() {
            return {
                min_width: parseInt($('#new_min_width').val()),
                col_num: parseInt($('#new_col_num').val()),
                col_width: false,
                col_padding_width: parseFloat($('#new_col_padding_width').val()),
                col_padding_type: $('#new_col_padding_type').val(),
                gutter_width: parseFloat($('#new_gutter_width').val()),
                gutter_type: $('#new_gutter_type').val(),
                baseline_height: parseInt($('#new_baseline_height').val())
            };
        },

        /**
         * Sets the form from the current grid
         *
         * @return void
         */
        refreshOptions: function() {
            $('#new_min_width').val(Grids.current.get('min_width'));
            $('#new_col_num').val(Grids.current.get('col_num'));
            $('#new_col_padding_width').val(Grids.current.get('col_padding_width'));
            $('#new_col_padding_type').val(Grids.current.get('col_padding_type'));
            $('#new_gutter_width').val(Grids.current.get('gutter_width'));
            $('#new_gutter_type').val(Grids.current.get('gutter_type'));
            $('#new_baseline_height').val(Grids.current.get('baseline_height'));
        },

        /**
         * Sets the Grid's options from the form
         *
         * @return void
         */
        updateOptions: function() {
            Grids.current.set(this.fetchOptions());
            this.updateWidth(this.$browser.width());
            // Grids.dump();
        },

        /**
         * Creates a new grid and adds it to the GridList collection
         *
         * @return void
         */
        createGrid: function(e) {

            var options = _.extend(
                    this.fetchOptions(),
                    { upper: 0, lower: 0, current: true }
                ),
                grid = new Grid(options);

            Grids.add(grid);
            this.updateWidth(this.$browser.width());
        }

     });

     // Create the application
     window.App = new AppView;

});
