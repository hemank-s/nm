(function( W, platformSdk, events ) {
    'use strict';

    var utils = require( '../util/utils' ),
        Constants = require( '../../constants.js' ),

        ExclusiveFeatureController = function( options ) {
            this.template = require( 'raw!../../templates/exclusiveFeature.html' );
        };

    ExclusiveFeatureController.prototype.bind = function( App, data ) {

        var ftue = this;      
    };

    ExclusiveFeatureController.prototype.render = function( ctr, App, data ) {

        var that = this;
        that.el = document.createElement( 'div' );
        that.el.className = 'exclusiveFeatureController animation_fadein noselect';
        that.el.innerHTML = Mustache.render( unescape( that.template ) );
        ctr.appendChild( that.el );
        events.publish( 'update.loader', { show: false });
        that.bind( App, data );
    };

    ExclusiveFeatureController.prototype.destroy = function() {

    };

    module.exports = ExclusiveFeatureController;

})( window, platformSdk, platformSdk.events );
