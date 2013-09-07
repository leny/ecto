/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /src/controllers/admin.js
 * Controllers/router for admin pages
 *
 * coded by leny
 * started at 02/09/13
 */

"use strict";

/*
var root = __dirname + "/..",
    pkg = require( root + "/../package.json" ),
    sPostsPath = root + "/../" + pkg.config.posts;
*/

var connexion = function( oRequest, oResponse ) {
    if( oRequest.session.connected ) {
        return oResponse.redirect( "/admin/list" );
    }
    oResponse.render( "admin/connect", {
        "pageTitle": "connexion",
        "error": false
    } );
}; // connexion

exports.init = function( oApp ) {
    oApp.get( "/admin", connexion );
    // oApp.post( "/admin", login );
    // oApp.get( "/admin/list", listPosts );
    // oApp.get( "/admin/add", addPost )
    // oApp.get( "/admin/edit/:file.json", editPost );
    // oApp.post( "/admin/save", savePost );
    // oApp.get( "/admin/delete/:file.json", deletePost );
    // oApp.get( "/admin/exit", logout );
};
