// Set up our global Erskine Design Javascript object
var EDJ = {
    settings: {
        debug: true,
        STATIC_URL: '/static/'
    },
    is_touch: false,
    run_list: [
        'navigation'
    ],
    $body: {}
};


/**
 * Bootstrap
 *
 * Called immediately - blocking script, so be careful
 *
 * Used on: all pages
 *
 * @namespace EDJ
 * @class init
 */
EDJ.bootstrap = {

    /**
     * Is touch device
     *
     * returns true if the agent is a touch device
     *
     * @method is_touch_device
     *
     */
    is_touch_device: function() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Is JavaScript enabled
     * 
     * replaces the js-disabled class in the html tag with js-enabled for styling etc.
     * @method is_javascript_enabled
     *
     */
    is_javascript_enabled: function() {
        var docElement = window.document.documentElement;
        docElement.className = docElement.className.replace(/\bjs-disabled\b/,'') + ' js-enabled';
    },

    init: function() {
        EDJ.is_touch = this.is_touch_device();
        this.is_javascript_enabled();
    }

};

// Run the bootstrap
EDJ.bootstrap.init();


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
