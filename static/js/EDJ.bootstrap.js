// Set up our global Erskine Design Javascript object
var EDJ = {
    settings: {
        debug: true,
        STATIC_URL: '/static/'
    },
    is_touch: false,
    run_list: [],
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
