/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /server/controllers/admin.js
 * Controllers/router for admin pages
 *
 * coded by leny
 * started at 02/09/13
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
    if( pkg.config.users[ oRequest.body.login ] === ( ( Crypto.createHash( "sha1" ) ).update( oRequest.body.pass.trim() ) ).digest( "hex" ) ) {
        oRequest.session.connected = true;
        return oResponse.redirect( "/admin/list" );
    }
    oResponse.render( "admin/connect", {
        "pageTitle": "connexion",
        "error": true
    } );
}; // login

var listPosts = function( oRequest, oResponse ) {
    Post.loadAll( false, function( oError, aPosts ) {
        if( oError ) {
            return oResponse.send( 500 );
        }
        oResponse.render( "admin/list", {
            "pageTitle": "liste des billets",
            "posts": aPosts
        } );
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
    Post.getByURL( "/" + oRequest.params.name, function( oError, oPost ) {
        if( oError ) {
            return oResponse.send( 404 );
        }
        oResponse.render( "admin/edit", {
            "pageTitle": "éditer un billet",
            "post": oPost,
            "error": false
        } );
    } );
}; // editPost

var savePost = function( oRequest, oResponse ) {
    var oPost;
    oPost = new Post( oRequest.body.file.trim() );
    oPost.title = oRequest.body.title.trim() || "Untitled post";
    oPost.date = new Date( oRequest.body.date + " " + oRequest.body.time );
    oPost.content = oRequest.body.content.trim();
    oPost.save( function( oError ) {
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
        oResponse.redirect( "/admin/list" );
    } );
}; // savePost

var askDeletePost = function( oRequest, oResponse ) {
    Post.getByURL( "/" + oRequest.params.name, function( oError, oPost ) {
        if( oError ) {
            return oResponse.send( 404 );
        }
        oResponse.render( "admin/delete", {
            "pageTitle": "supprimer un billet",
            "post": oPost,
            "error": false
        } );
    } );
}; // askDeletePost

var deletePost = function( oRequest, oResponse ) {
    var oPost;
    if( oRequest.body.action === "confirm" ) {
        oPost = new Post( oRequest.body.file.trim(), function( oError ) {
            if( oError ) {
                return oResponse.send( 404 );
            }
            oPost.destroy( function( oError ) {
                if( oError ) {
                    return oResponse.render( "admin/delete", {
                        "pageTitle": "supprimer un billet",
                        "post": oPost,
                        "error": true
                    } );
                }
                oResponse.redirect( "/admin/list" );
            } );
        } );
    } else {
        oResponse.redirect( "/admin/list" );
    }
}; // deletePost

var logout = function( oRequest, oResponse ) {
    oRequest.session.destroy( function() {
        oResponse.redirect( "/" );
    } );
}; // logout

exports.init = function( oApp ) {
    oApp.get( "/admin", connexion );
    oApp.post( "/admin", login );
    oApp.get( "/admin/list", adminMiddleware, listPosts );
    oApp.get( "/admin/add", adminMiddleware, addPost );
    oApp.get( "/admin/edit/:name", adminMiddleware, editPost );
    oApp.post( "/admin/save", adminMiddleware, savePost );
    oApp.get( "/admin/delete/:name", adminMiddleware, askDeletePost );
    oApp.post( "/admin/delete", adminMiddleware, deletePost );
    oApp.get( "/admin/exit", adminMiddleware, logout );
};
