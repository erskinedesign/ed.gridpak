/*!
 * Gridpak v0.2.7b
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
            padding_width: 10,
            padding_type: 'px',
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
                min_grid_width: 100,
                min_min_width: 220,
            };

            // Int params must be integers
            if (
                (typeof(attrs.min_width) != 'undefined' && !utils.isInt(attrs.min_width)) ||
                (typeof(attrs.col_num) != 'undefined' && !utils.isInt(attrs.col_num)) ||
                (typeof(attrs.padding_width) != 'undefined' && !utils.isNumber(attrs.padding_width)) ||
                (typeof(attrs.gutter_width) != 'undefined' && !utils.isNumber(attrs.gutter_width)) ||
                (typeof(attrs.baseline_height) != 'undefined' && !utils.isInt(attrs.baseline_height))
            ) {
                return 'Numbers please';
            }

            // I got 99 cols but a bitch ain't one
            if (attrs.col_num > settings.max_cols || attrs.col_num < 1) {
                return 'Must be between 1 and ' + settings.max_cols + ' cols';
            }

            // Params that must be more than 0
            if (
                (typeof(attrs.padding_width) != 'undefined' && attrs.padding_width < 0) ||
                (typeof(attrs.gutter_width) != 'undefined' && attrs.gutter_width < 0) ||
                (typeof(attrs.baseline_height) != 'undefined' && attrs.baseline_height < 0)
            ) {
                return 'Must be 0 or greater';
            }


            // Make sure it's bigger than the minimum the browser can be resized to
            if (attrs.lower!= 0 && attrs.lower < settings.min_min_width) {
                return 'The smallest min_width you can have is ' + settings.min_min_width;
            }

            // px or % params
            if (
                (typeof(attrs.padding_type) != 'undefined' && _.indexOf(settings.allowed_types, attrs.padding_type) == -1) || 
                (typeof(attrs.gutter_type) != 'undefined' && _.indexOf(settings.allowed_types, attrs.gutter_type) == -1)
            ) {
                return 'Wrong type of padding / gutter';
            }

            // Has to have a minimum grid width
            if (
                (attrs.upper && attrs.lower) &&
                (attrs.upper - attrs.lower) < settings.min_grid_width
            ) {
                return 'Grid must be a minimum width of ' + settings.min_grid_width + 'px';
            }

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
            old_limits.upper = this.get('min_width') - 1;

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
                    'padding: ' + grid.get('padding_width') + grid.get('padding_type') + ' | ' +
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

    // Instantiate the GridList collection, and add some grids to it
    window.Grids = new GridList();
    // Grids.add(new Grid({ min_width: 0, col_num: 4, padding_width: 5, padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22 }));
    // Grids.add(new Grid({ min_width: 500, col_num: 8, padding_width: 1, padding_type: '%', gutter_width: 2,  gutter_type: '%', baseline_height: 22 }));
    // Grids.add(new Grid({ min_width: 960, col_num: 16, padding_width: 10, padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22 }));
    Grids.add(new Grid({ min_width: 0, col_num: 6, padding_width: 1.5, padding_type: '%', gutter_width: 2,  gutter_type: '%', baseline_height: 22 }));

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
            var extras = {
                num_grids: this.model.collection.length
            };
            // Extras gives us an opportunity to add extra params to the model just before we render it
            _.extend(this.model.attributes, extras);
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
        clear: function(e) {
            var prev = this.model.getRelativeTo(-1),
                next = this.model.getRelativeTo(1),
                width = parseInt($('#new_min_width').val()),
                is_cur = this.model.get('current'),
                options = {};

            e.preventDefault();

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
            this.model.destroy();
            App.refreshOptions();
            App.updateOptions();
            this.stringify();

            // Grids.dump();
        },

        errorHandler: function() {
            $('.errors')
                .removeClass('hidden')
                .html(arguments[1]);
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
            'click #grid_options input[type="text"]': 'updateOptions',
            'keyup #grid_options input[type="text"]': 'updateOptions',
            'change #grid_options select, #grid_options input[type="radio"]': 'updateOptions',
            'change #grid_options .switcher_container input[type="radio"]': 'clickSwitch',
            'click #grid_options a.number': 'spinnerClick',
            'click .actions .link' : 'jumpToGrid',
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
                minWidth: 200,
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
            Grids.bind('change', function() {
                $('.errors')
                    .html('')
                    .addClass('hidden');
            });

            // Update the width of the current model
            this.updateWidth(width);
        },

        /**
         * Toggles switches on and off
         *
         * @return void
         */
        clickSwitch: function(e) {
            var $target = $(e.target),
                $labels = $target.siblings('label');

            $labels
                .removeClass('selected')
                .filter('[for="' + $target.prop('id') + '"]')
                .addClass('selected');

        },

        /**
         * Jump to grid
         *
         * @return void
         */
        jumpToGrid: function(e) {
            var $target = $(e.target),
                jumpText = $target.html(),
                jumpLimits = [],
                jumpTo = 0
                ui = { size: { width: {} } };

            e.preventDefault();

            // We only want to jump if there's 2 or more Grids
            if (Grids.size() < 2) return false;

            jumpLimits = jumpText.split(' - ');
            jumpTo = (jumpLimits[1] == '∞') ? jumpLimits[0] : jumpLimits[1];

            this.$browser.width(jumpTo);
            ui.size.width = jumpTo;
            ui.precise = true;
            this.resize(e, ui);

        },

        /**
         * Spinner clicks to jog numbers
         *
         * @return void
         */
        spinnerClick: function(e) {
            var $target = $(e.target)
                $number = $target.parent().find('input'),
                val = parseFloat($number.val()),
                step = 1;

            e.preventDefault();

            val = $target.hasClass('increase') ? val + step : val - step;

            if (val < 0) return false;

            $number.val(val);
            this.updateOptions();
        },

        /**
         * Resize app, fired from jQuery UI resizable
         *
         * @return void
         */
        resize: function(e, ui) {
            var old_width = parseInt($('#new_min_width').val()),
                current_width = (ui.precise !== true) ? Math.round(ui.size.width / this.snap) * this.snap : ui.size.width;

            // ensure we only fire every time we snap to a new width
            if (old_width == current_width && ui.precise !== true) return false;

            if (Grids.length > 1) {
                Grids.each(function(grid) {
                    if (grid.get('current') != true &&
                        current_width >= grid.get('min_width') &&
                        (current_width <= grid.get('upper') || grid.get('upper') == false)
                    ) {
                        Grids.current.set({ current: false });
                        grid.set({ current: true });
                        Grids.current = grid;
                        App.refreshOptions();
                    }
                });
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
            this.updateOptions();
        },

        /**
         * Collects options from the form for a Grid
         *
         * @return object
         */
        fetchOptions: function() {
            var col_num = parseInt($('#new_col_num').val()),
                padding_width = parseFloat($('#new_padding_width').val()),
                padding_type = $('input[name="padding_type"]:checked').val(),
                gutter_width = parseFloat($('#new_gutter_width').val()),
                gutter_type = $('input[name="gutter_type"]:checked').val(),
                // baseline_height = parseInt($('#new_baseline_height').val()),
                gutter_remove = (gutter_type == '%') ? gutter_width * (col_num - 1) : 0,
                col_width = (100 - gutter_remove) / col_num;
            return {
                col_num: col_num,
                padding_width: padding_width,
                padding_type: padding_type,
                gutter_width: gutter_width,
                gutter_type: gutter_type,
                // baseline_height: baseline_height,
                col_width: col_width
            };
        },

        /**
         * Sets the form from the current grid
         *
         * @return void
         */
        refreshOptions: function() {
            // $('#new_min_width').val(Grids.current.get('min_width'));
            $('#new_col_num').val(Grids.current.get('col_num'));
            $('#new_padding_width').val(Grids.current.get('padding_width'));
            $('input:radio[name="padding_type"][value="' + Grids.current.get('padding_type') + '"]').prop('checked'. true);
            $('label[for^="padding_type"]').removeClass('selected');
            $('label[for^="padding_type"]:contains("' + Grids.current.get('padding_type') + '")').addClass('selected');
            $('#new_gutter_width').val(Grids.current.get('gutter_width'));
            $('input:radio[name="gutter_type"][value="' + Grids.current.get('gutter_type') + '"]').prop('checked', true);
            $('label[for^="gutter_type"]').removeClass('selected');
            $('label[for^="gutter_type"]:contains("' + Grids.current.get('gutter_type') + '")').addClass('selected');
            $('#new_baseline_height').val(Grids.current.get('baseline_height'));
            // Grids.dump();
        },

        /**
         * Sets the Grid's options from the form
         *
         * @return void
         */
        updateOptions: function() {
            Grids.current.set(this.fetchOptions());
            this.updateWidth(this.$browser.width());
            $('.numberOfGrids').html(Grids.size());
            // Grids.dump();
        },

        /**
         * Creates a new grid and adds it to the GridList collection
         *
         * @return void
         */
        createGrid: function(e) {

            e.preventDefault();
            var options = _.extend(
                    this.fetchOptions(),
                    { 
                        upper: 0, 
                        lower: 0, 
                        current: true, 
                        min_width: parseInt($('#new_min_width').val())
                    }
                ),
                grid = new Grid(options);

            Grids.add(grid);
            this.updateWidth(options.min_width);
        }

     });

     // Create the application
     window.App = new AppView;

});

var utils = {

    /**
     * Checks if the variable passed is an integer
     *
     * @param string num
     * @return boolean
     */
    isInt: function(num) {
        return typeof num == 'number' && num % 1 == 0;
    },

    /**
     * Checks if the param is a float
     *
     * @param string num
     */
    isFloat: function(num) {
        return num === +num && num === (num|0);
    },

    /**
     * Checks is the variable is numeric
     *
     * @param string num
     * @return boolean
     */
    isNumber: function(num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    }
};
