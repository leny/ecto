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
    markdown = require( "markdown" ).markdown,
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
        oPost = JSON.parse( fs.readFileSync( sPostsPath + sPostFile, { "encoding" : "utf8" } ) );
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

var editPost = function( oRequest, oResponse ) {
    var sFileName = oRequest.params.file + ".json",
        sFilePath = sPostsPath + sFileName,
        aPostDateElements, oPost;
    if( !fs.existsSync( sFilePath ) ) {
        return oResponse.send( 404 );
    }
    oPost = JSON.parse( fs.readFileSync( sFilePath, { "encoding" : "utf8" } ) );
    aPostDateElements = oPost.date.split( " " );
    oResponse.render( "admin/edit", {
        "pageTitle": "éditer un billet",
        "post": {
            "file": sFileName,
            "title": oPost.title,
            "date": aPostDateElements[ 0 ],
            "time": aPostDateElements[ 1 ],
            "content": oPost.content,
            "formatted_content": markdown.toHTML( oPost.content )
        },
        "error": false
    } );
}; // editPost

var savePost = function( oRequest, oResponse ) {
    var _month, _day, _hours, _minutes, oPostObject, sFileName, sFilePath,
        dNow = new Date(),
        iNowYear = dNow.getFullYear(),
        sNowMonth = ( _month = dNow.getMonth() ) < 9 ? ++_month : "0" + ( ++_month ),
        sNowDay = ( _day = dNow.getDate() ) < 10 ? _day : "0" + _day,
        sNowHours = ( _hours = ( dNow.getHours() ) ) < 10 ? ++_hours : "0" + ( ++_hours ),
        sNowMinutes = ( _minutes = ( dNow.getMinutes() ) ) < 10 ? ++_minutes : "0" + ( ++_minutes );
    oPostObject = {
        "title": oRequest.body.title || "Untitled post",
        "date": ( oRequest.body.date || iNowYear + "-" + sNowMonth + "-" + sNowDay ) + " " + ( oRequest.body.time || sNowHours + ":" + sNowMinutes ),
        "content": oRequest.body.content
    };
    sFileName = oPostObject.date.replace( /([\s:-]?)/g, "" ) + ".json";
    sFilePath = sPostsPath + sFileName;
    fs.writeFile( sFilePath, JSON.stringify( oPostObject ), function( oError ) {
        if( oError ) {
            return oResponse.render( "admin/edit", {
                "pageTitle": !!oRequest.body.file ? "éditer un billet" : "ajouter un billet",
                "post": {
                    "title": oRequest.body.title,
                    "date": oRequest.body.date,
                    "time": oRequest.body.time,
                    "content": oRequest.body.content
                },
                "error": true
            } );
        }
        if( !!oRequest.body.file !== sFileName ) {
            fs.unlinkSync( sPostsPath + oRequest.body.file );
        }
        oResponse.redirect( "/admin/list" );
    } );
}; // savePost

var askDeletePost = function( oRequest, oResponse ) {
    var sFileName = oRequest.params.file + ".json",
        sFilePath = sPostsPath + sFileName,
        oPost;
    if( !fs.existsSync( sFilePath ) ) {
        return oResponse.send( 404 );
    }
    oPost = JSON.parse( fs.readFileSync( sFilePath, { "encoding" : "utf8" } ) );
    oResponse.render( "admin/delete", {
        "pageTitle": "supprimer un billet",
        "post": {
            "file": sFileName,
            "title": oPost.title
        },
        "error": false
    } );
}; // askDeletePost

var deletePost = function( oRequest, oResponse ) {
    var sFilePath = sPostsPath + oRequest.body.file;
    if( oRequest.body.action === "confirm" ) {
        if( !fs.existsSync( sFilePath ) ) {
            return oResponse.send( 404 );
        }
        fs.unlink( sFilePath, function( oError ) {
            if( oError ) {
                oPost = JSON.parse( fs.readFileSync( sFilePath, { "encoding" : "utf8" } ) );
                return oResponse.render( "admin/delete", {
                    "pageTitle": "supprimer un billet",
                    "post": {
                        "file": sFileName,
                        "title": oPost.title
                    },
                    "error": true
                } );
            }
            oResponse.redirect( "/admin/list" );
        } );
    } else {
        oResponse.redirect( "/admin/list" );
    }
}; // deletePost

exports.init = function( oApp ) {
    oApp.get( "/admin", connexion );
    oApp.post( "/admin", login );
    oApp.get( "/admin/list", adminMiddleware, listPosts );
    oApp.get( "/admin/add", adminMiddleware, addPost );
    oApp.get( "/admin/edit/:file.json", adminMiddleware, editPost );
    oApp.post( "/admin/save", adminMiddleware, savePost );
    oApp.get( "/admin/delete/:file.json", adminMiddleware, askDeletePost );
    oApp.post( "/admin/delete", adminMiddleware, deletePost );
    // oApp.get( "/admin/exit", logout );
};
