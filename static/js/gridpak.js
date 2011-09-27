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

        /**
         * Validate the model
         *
         * Backbone method
         *
         * @param (object) attrs
         * @return (string) error
         */
        validate: function(attrs) {

            var settings = {
                max_cols: 99,
                allowed_types: ['px', '%'],
                min_grid_width: 200
            };

            // I got 99 cols but a bitch ain't one
            if (attrs.col_num > settings.max_cols || attrs.col_num < 1) {
                return 'Must be between 1 and ' + settings.max_cols + ' cols';
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
         * Get the model's position in the collection
         *
         * @return (int) index
         */
        getPosition: function() {
            return this.collection.indexOf(this);
        },

        /**
         * Get the model in the collection x steps away up (+) or down (-)
         *
         * @return (object) grid
         */
        getRelativeTo: function(direction, index) {
            var at = (typeof(index) != 'undefined') ? index : this.getPosition();
            return this.collection.at(at + direction);
        },

        /**
         * Find the upper and lower limits
         *
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
        },

        dump: function()
        {
            var message = '';
            this.each(function(grid) {
                message += grid.cid + ': ' + grid.get('min_width') + "   \t\t" + grid.get('lower') + ' to ' + grid.get('upper') + "\n";
            });
            console.log(message);
        }

    });

    // Use prototyping to add a check for the next and previous models
    // then assign the lower and upper limits accordingly
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
    };

    window.Grids = new GridList();
    Grids.add(new Grid({ min_width: 100, col_num: 4, col_padding_width: 5, col_padding_type: 'px', gutter_width: 8,  gutter_type: 'px', baseline_height: 22 }));
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

        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
            this.model.bind('error', this.errorHandler);
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
            var prev = this.model.getRelativeTo(-1),
                next = this.model.getRelativeTo(1),
                width = $('#new_min_width').val();

            if (this.model.collection.length == 1) {
                this.errorHandler(this.model, 'You must have at least one grid');
                return false;
            }

            // Figure out which grid we'll now set as current
            if (this.model.get('current') == true) {
                if (prev) {
                    prev.set({ current: true });
                    this.model.collection.current = prev;
                } else if (next) {
                    next.set({ current: true });
                    this.model.collection.current = next;
                } else {
                    this.model.collection.current = false;
                }
            }

            // Stuff will have changed
            this.model.collection.current.updateWidth(width);
            App.refreshOptions();
            this.model.destroy();
            if (prev) prev.setLimits();
            if (next) next.setLimits();
        },

        errorHandler: function() {
            alert(arguments[1]);
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

        fetchOptions: function() {
            return {
                min_width: parseInt($('#new_min_width').val()),
                col_num: parseInt($('#new_col_num').val()),
                col_width: false,
                col_padding_width: parseInt($('#new_col_padding_width').val()),
                col_padding_type: $('#new_col_padding_type').val(),
                gutter_width: parseInt($('#new_gutter_width').val()),
                gutter_type: $('#new_gutter_type').val(),
                baseline_height: parseInt($('#new_baseline_height').val())
            };
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
            Grids.current.set(this.fetchOptions());
            this.updateWidth(this.$browser.width());
        },

        createGrid: function(e) {

            var options = _.extend(
                    this.fetchOptions(),
                    { upper: 0, lower: 0, current: true }
                ),
                grid = new Grid(options);

            Grids.add(grid);
        },

        addOne: function(grid) {
            var view = new GridView({ model: grid });
            this.$('#grid_list').append(view.render().el);
        }

     });

     window.App = new AppView;

});
