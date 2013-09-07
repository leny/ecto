/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /src/controllers/public.js
 * Controllers/router for public pages
 *
 * coded by leny
 * started at 02/09/13
 */

"use strict";

var root = __dirname + "/..",
    fs = require( "fs" ),
    pkg = require( root + "/../package.json" );

var homepage = function( oRequest, oResponse ) {
    var sPostsPath = root + "/../" + pkg.config.posts,
        aPostsFiles = fs.readdirSync( sPostsPath ),
        aPosts = [],
        iNow = ( new Date() ).getTime(),
        i, sPostFile, oPost, iPostDate;
    for( i = -1; sPostFile = aPostsFiles[ ++i ]; ) {
        oPost = require( sPostsPath + sPostFile );
        iPostDate = ( new Date( oPost.date ) ).getTime();
        if( iPostDate <= iNow ) {
            aPosts.push( oPost );
        }
    }
    oResponse.render( "public/list", {
        "pageTitle": "ecto",
        "posts": aPosts
    } );
}; // homepage

exports.init = function( oApp ) {
    oApp.get( "/", homepage );
};
