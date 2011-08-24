$(function() {

    /**
     * Grid model
     *
     * @attribute (int) min_width
     * @attribute (int) col_num
     * @attribute (int) col_padding_width
     * @attribute (string) col_padding_width_type
     * @attribute (int) col_margin_width
     * @attribute (string) col_margin_type
     * @attribute (int) baseline_height
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
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
            Grids.fetch();
        },

        events: {
            'click .remove' : 'clear',
            'click .update' : 'updateOptions'
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            this.setOptions();
            this.stringify();
            return this;
        },

        stringify: function() {
            $('#stringified').val(JSON.stringify(Grids));
        },

        setOptions: function() {
            var min_width = this.model.get('min_width'),
                col_num = this.model.get('col_num'),
                col_padding_width = this.model.get('col_padding_width'),
                col_padding_type = this.model.get('col_padding_type'),
                col_margin_width = this.model.get('col_margin_width'),
                col_margin_type = this.model.get('col_margin_type'),
                baseline_height = this.model.get('baseline_height');

            this.$('.min_width').val(min_width);
            this.$('.col_num').val(col_num);
            this.$('.col_padding_width').val(col_padding_width);
            this.$('.col_padding_type').val(col_padding_type);
            this.$('.col_margin_width').val(col_margin_width);
            this.$('.col_margin_type').val(col_margin_type);
            this.$('.baseline_height').val(baseline_height);
        },

        updateOptions: function() {
            this.model.set({
                min_width: this.$('.min_width').val(),
                col_num: this.$('.col_num').val(),
                col_padding_width: this.$('.col_padding_width').val(),
                col_padding_type: this.$('.col_padding_type').val(),
                col_margin_width: this.$('.col_margin_width').val(),
                col_margin_type: this.$('.col_margin_type').val(),
                baseline_height: this.$('.baseline_height').val()
            });
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
            this.$('#browser').resizable({
                handles: { e: $(".dragme") },
                grid: 20,
                resize: function(e, ui) {
                    $('#new_min_width').val(ui.size.width);
                }
            });

            Grids.bind('add', this.addOne, this);

         },

         addGrid: function(grid) {
             var view = new GridView({ model: grid });
             this.$('#grid_list').append(view.render().el);
         },

         createGrid: function(e) {

            var min_width = $('#new_min_width').val();
            var col_num = $('#new_col_num').val();
            var col_padding_width = $('#new_col_padding_width').val();
            var col_padding_type= $('#new_col_padding_type').val();
            var col_margin_width = $('#new_col_margin_width').val();
            var col_margin_type= $('#new_col_margin_type').val();
            var baseline_height = $('#new_baseline_height').val();
            var new_grid = new Grid({
                min_width: min_width,
                col_num: col_num,
                col_padding_width: col_padding_width,
                col_padding_type: col_padding_type,
                col_margin_width: col_margin_width,
                col_margin_type: col_margin_type,
                baseline_height: baseline_height
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
