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
    Post = require( root + "/models/post.js" );

var homepage = function( oRequest, oResponse ) {
    Post.loadAll( true, function( oError, aPosts ) {
        if( oError ) {
            return oResponse.send( 500 );
        }
        oResponse.render( "public/list", {
            "pageTitle": "ecto",
            "posts": aPosts
        } );
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
