/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require( '../../libs/js/platformSdk_v2.0' ),
        utils = require( '../util/utils' ),
        cacheProvider = require( '../util/cacheProvider' ),

        RewardsModel = function() {},

        EMPTY_OBJ_READ_ONLY = {};

    RewardsModel.prototype = {

        // Get Reward Router Associated To Type Of Reward
        getRewardRouter : function(rewardType){
            if ( rewardType == 'sticker_reward' ) {
                    return '/stickerReward';
                } else if ( rewardType == 'exclusive_feature' ) {
                    return '/exclusiveFeature';
                } else if ( rewardType == 'user_generated_content' ) {
                    return '/ugc';
                } else if ( rewardType == 'custom_sticker' ) {
                    return '/customSticker';
                }
        },

        // Update the ninja Click Events For rewards
        updateNinjaRewardsLinks: function(App){
            
            var that = this;

            var allRewards = document.getElementsByClassName( 'rewardRow' );
            if ( allRewards.length ) {
                console.log( allRewards );
                for ( var i = 0; i < allRewards.length; i++ ) {
                    allRewards[i].addEventListener( 'click', function( event ) {
                        var rewardType = this.getAttribute( 'data-rewardtype' );
                        var rewardRouter = that.getRewardRouter( rewardType );
                        App.router.navigateTo( rewardRouter, {});
                    });
                }
            }
        },

        // Update Ninja Rewards HTML
        updateNinjaRewards: function( rewardsData, App ) {

            console.log( 'Updating the Ninja Rewards Old By New Ninja Rewards' );
            console.log( rewardsData );

            // update helper data with new rewards
            cacheProvider.setInCritical( 'ninjaRewards', rewardsData );

            var ninjaRewardsListOld = document.getElementsByClassName( 'rewardsContainer' )[0]; // Gives Existing List of Rewards in the Template
            ninjaRewardsListOld.innerHTML = '';

            // Re Render The Reward Template Only From External HTML
            this.template = require( 'raw!../../templates/newRewardTemplate.html' );
            ninjaRewardsListOld.innerHTML = Mustache.render( this.template, {
                ninjaRewardsCollection: rewardsData
            });

            this.updateNinjaRewardsLinks( App );

        }

    };

    module.exports = new RewardsModel();
})();
