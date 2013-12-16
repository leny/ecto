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
            return oResponse.send( 501 ); // TODO : better error handling
        }
        oResponse.render( "index", {
            "pageTitle": "ecto",
            "mode": "list",
            "posts": aPosts
        } );
    } );
}; // homepage

var article = function( oRequest, oResponse ) {
    new Post( oRequest.params.name + ".json", function( oError, oPost ) {
        if( oError ) {
            return oResponse.send( 404 ); // TODO : better error handling
        }
        oResponse.render( "post", {
            "pageTitle": "ecto",
            "mode": "article",
            "post": oPost
        } );
    } );
}; // article

exports.init = function( oApp ) {
    oApp.get( "/", homepage );
    oApp.get( "/:name.html", article );
};
