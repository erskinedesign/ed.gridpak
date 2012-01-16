EDJ.run_list = [
    'navigation',
    'glow_btn'
];


/**
 * On ready
 *
 * Called when document is ready
 *
 * Used on: all pages
 *
 * @namespace EDJ
 * @param settings
 * @class on_ready
 * ---------------------------------------------------------------------------------------------------
*/
EDJ.on_ready = function(settings) {
    var i = 0;
    var functions_to_run = EDJ.run_list.length;

    // Extend the settings object with any vars passed in
    $.extend(EDJ.settings, settings);

    // Cache the body object for use later
    EDJ.$body = $('body');
    
    // Loop through our functions and run those that exist and said they should
    for (i=0; i<functions_to_run; i++) {
        // If the init function exists, and the run key is set to true
        if (
            (typeof EDJ[EDJ.run_list[i]].run === 'function' && EDJ[EDJ.run_list[i]].run() === true) ||
            (typeof EDJ[EDJ.run_list[i]].run === 'boolean' && EDJ[EDJ.run_list[i]].run === true)
        ) {
            // Log that we've called the init function
            EDJ.log('initialising EDJ.'+EDJ.run_list[i]);

            // Call the init function!
            EDJ[EDJ.run_list[i]].init();

            // Log that we've finished the init function
            EDJ.log('finished running EDJ.'+EDJ.run_list[i]);

        }

    }

};


/**
 * Log
 *
 * Will log any arguments (arrays, objects, strings etc.) to the console
 * if it exists, and EDJ.settings.debug is set to true
 *
 * Used on: all pages
 *
 * @namespace EDJ
 * @class log
 * @param anything!
 * ---------------------------------------------------------------------------------------------------
*/
EDJ.log = function() {
    if (EDJ.settings.debug === true && typeof(console) !== 'undefined') {
        console.log('[EDJ] ' + Array.prototype.join.call(arguments, ' '));
    }
};

/**
 * Navigation
 *
 * Various helpers for naviation
 *
 * Used on: all pages
 *
 * @namespace EDJ
 * @class navigation
 * ---------------------------------------------------------------------------------------------------
*/
EDJ.navigation = {
    run: true,

    init: function() {
        var $access_links = EDJ.$body.find('ul#nav_access li a');

        $access_links.focus(function(){ 
            $(this).addClass('focus');
        });

        $access_links.blur(function(){ 
            $(this).removeClass('focus'); 
        });

    }

};

//$('.presentational').delegate('.show_hide', 'click', function(){
    //console.log('here');
    //$(this).next('tr').toggleClass('hidden');
//});

/**
 * Glow button
 *
 * When click a glow button, it glows (natch)
 *
 */
EDJ.glow_btn = {
    $btn: {},
    
    run: function() {
        this.$btn = $('#save_grid');
        return this.$btn.length > 0;
    },

    init: function() {
        this.$btn.live('click', function() {
            $('#download_form')
                .addClass('added')
                .delay(2000)
                .queue(function() {
                    $(this).removeClass('added')
               });
        });
    }
};
