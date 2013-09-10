/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /client/js/admin.js
 * Client Scripts for Admin
 *
 * coded by leny
 * started at 10/09/13
 */

/*global jQuery window */

( function( $ ) {
    "use strict";

    var editArticle = function() {
        window.location.href = $( this ).parent().find( ".tools a.edit" ).attr( "href" );
    }; // editArticle

    $( function() {
        $( "body > section ul li .infos" ).on( "click", editArticle );
    } );

} ).call( this, jQuery );
