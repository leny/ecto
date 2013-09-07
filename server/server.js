/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /src/server.js
 * Main entry point
 *
 * coded by leny
 * started at 02/09/13
 */

"use strict";

var root = __dirname,
    express = require( "express" ),
    pkg = require( root + "/../package.json" ),
    middlewares = require( root + "/core/middlewares.js" ),
    oApp = express();

oApp.use( express.compress() );
oApp.use( express.bodyParser() );
oApp.use( express.cookieParser() );
oApp.use( express.session( {
    "secret": pkg.config.secret
} ) );

oApp.use( express.static( root + "/../client" ) );

oApp.use( middlewares.log );

oApp.set( "views", root + "/views" );
oApp.set( "view engine", "jade" );

require( root + "/controllers/public.js" ).init( oApp );
require( root + "/controllers/admin.js" ).init( oApp );

oApp.listen( pkg.config.port );
