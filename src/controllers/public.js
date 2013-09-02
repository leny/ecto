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

var homepage = function( oRequest, oResponse ) {
    oResponse.render( "index", {
        "pageTitle": "home"
    } );
}; // homepage

exports.init = function( oApp ) {
    oApp.get( "/", homepage );
};
