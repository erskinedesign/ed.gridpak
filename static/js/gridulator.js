$(function() {

    /**
     * Grid model
     *
     * @attribute (int) min_width
     * @attribute (int) col_num
     * @attribute (int) col_margin_width
     * @attribute (string) col_margin_type
     */
    window.Grid = Backbone.Model.extend({

    });

    /**
     * Grid collection
     *
     */
    window.GridList = Backbone.Collection.extend({

        model: Grid,

        url: '/'

    });

    window.Grids = new GridList;

    /**
     * Grid info view
     *
     */
    window.GridView = Backbone.View.extend({

        tagName: 'li',

        template: _.template($('#grid_template').html()),

        initialize: function() {
            Grids.bind('all', this.render, this);

            Grids.fetch();

        },

        events: {
            'click .remove' : 'remove'
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            this.setOptions();
            console.log('render view');
            return this;
        },

        setOptions: function() {
            var min_width = this.model.get('min_width'),
                col_num = this.model.get('col_num'),
                col_margin_width = this.model.get('col_margin_width'),
                col_margin_type = this.model.get('col_margin_type');

            this.$('.min_width').val(min_width);
            this.$('.col_num').val(col_num);
            this.$('.col_margin_width').val(col_margin_width);
            this.$('.col_margin_type').val(col_margin_type);
        },

        remove: function() {
            $(this.el).remove();
        },

        clear: function() {
            this.model.destroy();
        }

    });

    /**
     * The application
     *
     * --------------------------------------------------------------------------------------
     */
    window.AppView = Backbone.View.extend({

         el: $('#gridulator'),

         events: {
             'click #save_grid': 'createGrid'
         },

         initialize: function() {
            this.input = this.$('#create_grid');

            Grids.bind('add', this.addOne, this);

         },

         addGrid: function(grid) {
             var view = new GridView({ model: grid });
             this.$('#grid_list').append(view.render().el);
         },

         createGrid: function(e) {

            var min_width = $('#new_min_width').val();
            var col_num = $('#new_col_num').val();
            var col_margin_width = $('#new_col_margin_width').val();
            var col_margin_type= $('#new_col_margin_type').val();
            var new_grid = new Grid({
                min_width: min_width,
                col_num: col_num,
                col_margin_width: col_margin_width,
                col_margin_type: col_margin_type
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