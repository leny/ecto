/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /src/models/post.js
 * Model for post
 *
 * coded by leny
 * started at 08/09/13
 */

"use strict";

var root = __dirname + "/..",
    FS = require( "fs" ),
    Markdown = require( "markdown" ).markdown,
    pkg = require( root + "/../package.json" ),
    sPostsPath = root + "/../" + pkg.config.posts;

var Post = function( sFileName, fNext ) {
    var _sFileName = sFileName || ( Post.genUUID() + ".json" ),
        _sFilePath = sPostsPath + _sFileName,
        _sTitle = "Untitled post",
        _dDate = new Date(),
        _sContent = "";

    this.__defineGetter__( "title", function() {
        return _sTitle;
    } );
    this.__defineSetter__( "title", function( sTitle ) {
        _sTitle = sTitle;
    } );
    this.__defineGetter__( "url", function() {
        return "/" + _sTitle.toLowerCase().replace( /[^a-z0-9]+/g, "-" ).replace( /-$/, "" );
    } );

    this.__defineGetter__( "date", function() {
        return _dDate;
    } );
    this.__defineSetter__( "date", function( dDate ) {
        _dDate = dDate;
    } );

    this.__defineGetter__( "content", function() {
        return _sContent;
    } );
    this.__defineSetter__( "content", function( sContent ) {
        _sContent = sContent;
    } );
    this.__defineGetter__( "markdown", function() {
        return Markdown.toHTML( _sContent );
    } );

    this.__defineGetter__( "path", function() {
        return _sFilePath;
    } );

    this.__defineGetter__( "file", function() {
        return _sFileName;
    } );

    if( sFileName && fNext ) {
        this.load( fNext );
    }
};

// inspired by Narwhal : https://github.com/280north/narwhal/blob/master/packages/narwhal-lib/lib/uuid.js
Post.genUUID = function() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split( "" ),
        uuid = [],
        r, i;
    uuid[ 8 ] = uuid[ 13 ] = uuid[ 18 ] = uuid[ 23 ] = "-";
    uuid[ 14 ] = "4";
    for( i = 0; i < 36; i++ ) {
        if( !uuid[ i ] ) {
            r = 0 | Math.random() * 16;
            uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r & 0xf ];
        }
    }
    return uuid.join( "" );
};

Post.compareDates = function( a, b ) {
    return a.date.getTime() - b.date.getTime();
};

Post.loadAll = function( bFilter, fNext ) {
    FS.readdir( sPostsPath, function( oError, aFiles ) {
        var sPostFile, i,
            iFilesLoaded = 0,
            aPosts = [],
            iNow = ( new Date() ).getTime(),
            fFileLoaded = function( oError, oPost ) {
                if( !oError ) {
                    if( !bFilter || bFilter && oPost.date.getTime() <= iNow ) {
                        aPosts.push( oPost );
                    }
                }
                if( ++iFilesLoaded === aFiles.length ) {
                    aPosts.sort( Post.compareDates ).reverse();
                    return fNext && fNext( null, aPosts );
                }
            };
        if( oError ) {
            return fNext && fNext( oError );
        }
        for( i = -1; sPostFile = aFiles[ ++i ]; ) {
            new Post( sPostFile, fFileLoaded );
        }
    } );
};

Post.getByURL = function( sURL, fNext ) {
    FS.readdir( sPostsPath, function( oError, aFiles ) {
        var sPostFile, i,
            bFounded = false,
            iFilesLoaded = 0,
            fFileLoaded = function( oError, oPost ) {
                ++iFilesLoaded;
                if( !oError && !bFounded && oPost.url === sURL ) {
                    bFounded = true;
                    return fNext && fNext( null, oPost );
                }
                if( iFilesLoaded === aFiles.length && !bFounded ) {
                    return fNext && fNext();
                }
            };
        if( oError ) {
            return fNext && fNext( oError );
        }
        for( i = -1; sPostFile = aFiles[ ++i ]; ) {
            new Post( sPostFile, fFileLoaded );
        }
    } );
};

Post.prototype.load = function( fNext ) {
    var _that = this;
    FS.exists( _that.path, function( bExists ) {
        if( !bExists ) {
            return fNext && fNext( new Error( _that.path + " doesn't exists !" ) );
        }
        FS.readFile( _that.path, { "encoding" : "utf8" }, function( oError, sRawContent ) {
            var oPost;
            if( oError ) {
                return fNext && fNext( oError );
            }
            oPost = JSON.parse( sRawContent );
            _that.title = oPost.title;
            _that.date = new Date( oPost.date );
            _that.content = oPost.content;
            return fNext && fNext( null, _that );
        } );
    } );
};

Post.prototype.save = function( fNext ) {
    var _that = this,
        oRawData = {
            "title": _that.title,
            "date": _that.date.getTime(),
            "content": _that.content
        };
    FS.writeFile( _that.path, JSON.stringify( oRawData ), function( oError ) {
        return fNext && fNext( oError );
    } );
};

Post.prototype.destroy = function( fNext ) {
    var _that = this;
    FS.exists( _that.path, function( bExists ) {
        if( !bExists ) {
            return fNext && fNext( new Error( _that.path + " doesn't exists !" ) );
        }
        FS.unlink( _that.path, function( oError ) {
            return fNext && fNext( oError );
        } );
    } );
};

Post.prototype.getDate = function() {
    var _iMonth, _iDate,
        dDate = this.date;
    return dDate.getFullYear() + "-" + ( ( _iMonth = dDate.getMonth() ) < 9 ? "0" + ( ++_iMonth ) : ++_iMonth ) + "-" + ( ( _iDate = dDate.getMonth() ) < 9 ? "0" + _iDate : _iDate );
};

Post.prototype.getTime = function() {
    var _iHours, _iMinutes,
        dDate = this.date;
    return ( ( _iHours = dDate.getHours() ) < 9 ? "0" + ( ++_iHours ) : ++_iHours ) + ":" + ( ( _iMinutes = dDate.getMinutes() ) < 9 ? "0" + ( ++_iMinutes ) : _iMinutes );
};

module.exports = Post;
