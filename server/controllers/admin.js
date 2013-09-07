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

var savePost = function( oRequest, oResponse ) {
    var _month, _day, _hours, _minutes, oPostObject, sFileName, sFilePath,
        dNow = new Date(),
        iNowYear = dNow.getFullYear(),
        sNowMonth = ( _month = dNow.getMonth() ) < 9 ? ++_month : "0" + ( ++_month ),
        sNowDay = ( _day = dNow.getDate() ) < 10 ? _day : "0" + _day,
        sNowHours = ( _hours = ( dNow.getHours() ) ) < 10 ? ++_hours : "0" + ( ++_hours ),
        sNowMinutes = ( _minutes = ( dNow.getMinutes() ) ) < 10 ? ++_minutes : "0" + ( ++_minutes ),
        sNowSeconds = "00";
    oPostObject = {
        "title": oRequest.body.title || "Untitled post",
        "date": ( oRequest.body.date || iNowYear + "-" + sNowMonth + "-" + sNowDay ) + " " + ( oRequest.body.time || sNowHours + ":" + sNowMinutes + ":" + sNowSeconds ),
        "content": oRequest.body.content
    };
    sFileName = oPostObject.date.replace( /([\s:-]?)/g, "" ) + ".json";
    sFilePath = sPostsPath + sFileName;
    if( !!oRequest.body.file ) {
        // EDIT
        // TODO check file existence
        // TODO write in file
        // TODO rename file if needed
    }
    fs.writeFile( sFilePath, JSON.stringify( oPostObject ), function( oError ) {
        if( oError ) {
            return oResponse.render( "admin/edit", {
                "pageTitle": "ajouter un billet",
                "post": {
                    "title": oRequest.body.title,
                    "date": oRequest.body.date,
                    "time": oRequest.body.time,
                    "content": oRequest.body.content
                },
                "error": true
            } );
        }
        oResponse.redirect( "/admin/list" );
    } );
}; // savePost

exports.init = function( oApp ) {
    oApp.get( "/admin", connexion );
    oApp.post( "/admin", login );
    oApp.get( "/admin/list", adminMiddleware, listPosts );
    oApp.get( "/admin/add", adminMiddleware, addPost );
    // oApp.get( "/admin/edit/:file.json", adminMiddleware, editPost );
    oApp.post( "/admin/save", adminMiddleware, savePost );
    // oApp.get( "/admin/delete/:file.json", adminMiddleware, deletePost );
    // oApp.get( "/admin/exit", logout );
};
