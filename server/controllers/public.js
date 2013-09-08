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
    FS = require( "fs" ),
    Post = require( root + "/models/post.js" ),
    pkg = require( root + "/../package.json" ),
    sPostsPath = root + "/../" + pkg.config.posts;

var homepage = function( oRequest, oResponse ) {
    FS.readdir( sPostsPath, function( oError, aFiles ) {
        var sPostFile, i,
            iFilesLoaded = 0,
            aPosts = [],
            iNow = ( new Date() ).getTime(),
            fFileLoaded = function( oError, oPost ) {
                if( !oError && oPost.date.getTime() <= iNow ) {
                    aPosts.push( oPost );
                }
                if( ++iFilesLoaded === aFiles.length ) {
                    aPosts.sort( Post.compareDates ).reverse();
                    oResponse.render( "public/list", {
                        "pageTitle": "ecto",
                        "posts": aPosts
                    } );
                }
            };
        if( oError ) {
            return oResponse.send( 500, oError );
        }
        for( i = -1; sPostFile = aFiles[ ++i ]; ) {
            new Post( sPostFile, fFileLoaded );
        }
    } );
}; // homepage

var article = function( oRequest, oResponse ) {
    Post.getByURL( oRequest.path, function( oError, oPost ) {
        if( oError ) {
            return oResponse.send( 404 );
        }
        if( oPost.date.getTime() > ( new Date() ).getTime() ) {
            return oResponse.send( 403 );
        }
        oResponse.render( "public/post", {
            "pageTitle": "ecto",
            "post": oPost
        } );
    } );
}; // article

exports.init = function( oApp ) {
    oApp.get( "/", homepage );
    oApp.get( "/:name", article );
};
