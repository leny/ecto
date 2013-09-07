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

var root = __dirname + "/..",
    fs = require( "fs" ),
    crypto = require( "crypto" ),
    pkg = require( root + "/../package.json" ),
    sPostsPath = root + "/../" + pkg.config.posts;

var adminMiddleware = function( oRequest, oResponse, fNext ) {
    if( !oRequest.session.connected ) {
        return oResponse.redirect( "/admin" );
    }
    fNext();
}; // adminMiddleware

var connexion = function( oRequest, oResponse ) {
    if( oRequest.session.connected ) {
        return oResponse.redirect( "/admin/list" );
    }
    oResponse.render( "admin/connect", {
        "pageTitle": "connexion",
        "error": false
    } );
}; // connexion

var login = function( oRequest, oResponse ) {
    if( pkg.config.users[ oRequest.body.login ] === ( ( crypto.createHash( "sha1" ) ).update( oRequest.body.pass.trim() ) ).digest( "hex" ) ) {
        oRequest.session.connected = true;
        return oResponse.redirect( "/admin/list" );
    }
    oResponse.render( "admin/connect", {
        "pageTitle": "connexion",
        "error": true
    } );
}; // login

var listPosts = function( oRequest, oResponse ) {
    var aPostsFiles = fs.readdirSync( sPostsPath ),
        aPosts = [],
        iNow = ( new Date() ).getTime(),
        i, sPostFile, oPost, dPostDate, iPostDate;
    aPostsFiles.sort().reverse();
    for( i = -1; sPostFile = aPostsFiles[ ++i ]; ) {
        oPost = require( sPostsPath + sPostFile );
        iPostDate = ( dPostDate = new Date( oPost.date ) ).getTime();
        oPost.file = sPostFile;
        oPost.date = dPostDate.toUTCString();
        oPost.published = ( iPostDate <= iNow );
        aPosts.push( oPost );
    }
    oResponse.render( "admin/list", {
        "pageTitle": "liste des billets",
        "posts": aPosts
    } );
}; // listPosts

var addPost = function( oRequest, oResponse ) {
    oResponse.render( "admin/edit", {
        "pageTitle": "ajouter un billet",
        "post": {},
        "error": false
    } );
}; // addPost

exports.init = function( oApp ) {
    oApp.get( "/admin", connexion );
    oApp.post( "/admin", login );
    oApp.get( "/admin/list", adminMiddleware, listPosts );
    oApp.get( "/admin/add", adminMiddleware, addPost );
    // oApp.get( "/admin/edit/:file.json", editPost );
    // oApp.post( "/admin/save", savePost );
    // oApp.get( "/admin/delete/:file.json", deletePost );
    // oApp.get( "/admin/exit", logout );
};
