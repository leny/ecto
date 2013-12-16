/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /src/controllers/admin.js
 * Controllers/router for admin pages
 *
 * coded by leny
 * started at 09/12/13
 */

"use strict";

var root = __dirname + "/..",
    Crypto = require( "crypto" ),
    Post = require( root + "/models/post.js" ),
    pkg = require( root + "/../package.json" );

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
    var oSHAGenerator = Crypto.createHash( "sha1" );
    oSHAGenerator.update( oRequest.body.pass.trim() );
    if( pkg.config.users[ oRequest.body.login ] === oSHAGenerator.digest( "hex" ) ) {
        oRequest.session.connected = true;
        return oResponse.redirect( "/admin/list" );
    }
    oResponse.render( "admin/connect", {
        "pageTitle": "connexion",
        "error": true
    } );
}; // login

var list = function( oRequest, oResponse ) {
    Post.loadAll( false, function( oError, aPosts ) {
        if( oError ) {
            return oResponse.send( 500 ); // TODO : better error handling
        }
        oResponse.render( "admin/list", {
            "pageTitle": "liste des billets",
            "posts": aPosts
        } );
    } );
}; // list

var logout = function( oRequest, oResponse ) {
    oRequest.session.destroy( function() {
        oResponse.redirect( "/" );
    } );
}; // logout

var add = function( oRequest, oResponse ) {
    oResponse.render( "admin/edit", {
        "pageTitle": "ajouter un billet",
        "post": false,
        "error": false
    } );
}; // add

var edit = function( oRequest, oResponse ) {
    new Post( oRequest.params.name + ".json", function( oError, oPost ) {
        if( oError ) {
            return oResponse.send( 404 ); // TODO : better error handling
        }
        oResponse.render( "admin/edit", {
            "pageTitle": "éditer un billet",
            "post": oPost,
            "error": false
        } );
    } );
}; // edit

var save = function( oRequest, oResponse ) {
    new Post( oRequest.body.file.trim(), function( oError, oPost ) {
        if( oError ) {
            return oResponse.send( 500 ); // TODO : better error handling
        }
        oPost.title = oRequest.body.title.trim() || "Untitled post";
        oPost.date = new Date( oRequest.body.date + " " + oRequest.body.time );
        oPost.content = oRequest.body.content.trim();
        oPost.save( function( oError ) {
            if( oError ) {
                return oResponse.render( "admin/edit", {
                    "pageTitle": "éditer un billet",
                    "post": oPost,
                    "error": true
                } );
            }
            oResponse.redirect( "admin/list" );
        } );
    } );
}; // save

var destroy = function( oRequest, oResponse ) {
    new Post( oRequest.params.name + ".json", function( oError, oPost ) {
        if( oError ) {
            return oResponse.send( 404 ); // TODO : better error handling
        }
        oPost.destroy( function( oError ) {
            if( oError ) {
                return oResponse.send( 500 ); // TODO : better error handling
            }
            oResponse.redirect( "/admin/list" );
        } );
    } );
}; // destroy

exports.init = function( oApp ) {
    oApp.get( "/admin", connexion );
    oApp.post( "/admin", login );
    oApp.get( "/admin/list", adminMiddleware, list );
    oApp.get( "/admin/add", adminMiddleware, add );
    oApp.get( "/admin/edit/:name.html", adminMiddleware, edit );
    oApp.post( "/admin/save", save );
    oApp.get( "/admin/delete/:name.html", adminMiddleware, destroy );
    oApp.get( "/admin/exit", logout );
};
