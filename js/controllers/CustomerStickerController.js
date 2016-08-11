(function( W, platformSdk, events ) {
    'use strict';

    var utils = require( '../util/utils' ),
        Constants = require( '../../constants.js' ),

        CustomerStickerController = function( options ) {
            this.template = require( 'raw!../../templates/customSticker.html' );
        };

    CustomerStickerController.prototype.bind = function( App, data ) {

        var ftue = this;      
    };

    CustomerStickerController.prototype.render = function( ctr, App, data ) {

        console.log(data);

        var that = this;
        that.el = document.createElement( 'div' );
        that.el.className = 'customStickerContainer centerToScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render( unescape( that.template ) );
        ctr.appendChild( that.el );
        events.publish( 'update.loader', { show: false });
        that.bind( App, data );
    };

    CustomerStickerController.prototype.destroy = function() {

    };

    module.exports = CustomerStickerController;

})( window, platformSdk, platformSdk.events );
