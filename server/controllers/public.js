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
    markdown = require( "markdown" ).markdown,
    pkg = require( root + "/../package.json" ),
    sPostsPath = root + "/../" + pkg.config.posts;

var homepage = function( oRequest, oResponse ) {
    var aPostsFiles = fs.readdirSync( sPostsPath ),
        aPosts = [],
        iNow = ( new Date() ).getTime(),
        i, sPostFile, oPost, dPostDate, iPostDate;
    for( i = -1; sPostFile = aPostsFiles[ ++i ]; ) {
        oPost = require( sPostsPath + sPostFile );
        iPostDate = ( dPostDate = new Date( oPost.date ) ).getTime();
        if( iPostDate <= iNow ) {
            oPost.url = sPostFile.replace( ".json", "" ) + "-" + oPost.title.toLowerCase().replace( /[^a-z0-9]+/g, "-" ) + ".html";
            oPost.date = dPostDate.toUTCString();
            aPosts.push( oPost );
        }
    }
    oResponse.render( "public/list", {
        "pageTitle": "ecto",
        "posts": aPosts
    } );
}; // homepage

var article = function( oRequest, oResponse ) {
    var sPostFile = sPostsPath + oRequest.params.date + ".json",
        iNow = ( new Date() ).getTime(),
        oPost, dPostDate, iPostDate;
    if( !fs.existsSync( sPostFile ) ) {
        return oResponse.send( 404 );
    }
    oPost = require( sPostFile );
    iPostDate = ( dPostDate = new Date( oPost.date ) ).getTime();
    if( iPostDate > iNow ) {
        return oResponse.send( 403 );
    }
    oPost.date = dPostDate.toUTCString();
    oPost.content = markdown.toHTML( oPost.content );
    oResponse.render( "public/article", {
        "pageTitle": "ecto",
        "article": oPost
    } );
}; // article

exports.init = function( oApp ) {
    oApp.get( "/", homepage );
    oApp.get( "/:date-:name.html", article );
};
