/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /server/models/post.js
 * Post Model
 *
 * coded by leny
 * started at 18/11/13
 */

"use strict";

var root = __dirname + "/..",
    sPostsFolderPath = root + "/../posts";

var FS = require( "fs" ),
    Markdown = require( "markdown" ).markdown;

var Post = function( sFileName, fNext ) {
    var _sFileName = sFileName,
        _sFilePath = sPostsFolderPath + "/" + sFileName,
        _sTitle,
        _dDate,
        _sContent;

    this.__defineGetter__( "title", function() {
        return _sTitle;
    } );

    this.__defineSetter__( "title", function( sTitle ) {
        _sTitle = sTitle;
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

    this.__defineSetter__( "path", function( sPath ) {
        _sFilePath = sPath;
    } );

    this.__defineGetter__( "file", function() {
        return _sFileName;
    } );

    this.__defineGetter__( "url", function() {
        return "/" + _sFileName.replace( ".json", ".html" );
    } );

    if( sFileName ) {
        this.load( fNext );
    } else {
        fNext( null, this );
    }
};

Post.prototype.load = function( fNext ) {
    var that = this;
    FS.exists( that.path, function( bExists ) {
        if( !bExists ) {
            return fNext && fNext( new Error( that.path + " doesn't exists !" ) );
        }
        FS.readFile( that.path, { "encoding": "utf8" }, function( oError, sRawContent ) {
            var oPost;
            if( oError ) {
                return fNext && fNext( oError );
            }
            oPost = JSON.parse( sRawContent );
            that.title = oPost.title;
            that.date = new Date( oPost.date );
            that.content = oPost.content;
            return fNext && fNext( null, that );
        } );
    } );
};

Post.compareDates = function( a, b ) {
    return a.date.getTime() - b.date.getTime();
};

Post.loadAll = function( bFilter, fNext ) {
    FS.readdir( sPostsFolderPath, function( oError, aFiles ) {
        var i, sPostFile,
            aPosts = [],
            iFilesLoaded = 0,
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

Post.prototype.save = function( fNext ) {
    var _that = this,
        oRawData = {
            "title": _that.title,
            "date": _that.date.getTime(),
            "content": _that.content
        };
    FS.writeFile( sPostsFolderPath + "/" + _that.title + ".json", JSON.stringify( oRawData ), function( oError ) {
        return fNext && fNext( oError );
    } );
};

Post.prototype.destroy = function( fNext ) {
    var _that = this;
    FS.exists( _that.path, function( bExists ) {
        if( !bExists ) {
            return fNext && fNext( new Error( _that.path + "doesn't exists !" ) );
        }
        FS.unlink( _that.path, function( oError ) {
            return fNext && fNext( oError );
        } );
    } );
};

Post.prototype.getDate = function() {
    var _iMonth, _iDate,
        dDate = this.date;
    return dDate.getFullYear() + "-" + ( ( _iMonth = dDate.getMonth() ) < 9 ? "0" + ( ++_iMonth ) : ++_iMonth ) + "-" + ( ( _iDate = dDate.getDate() ) < 9 ? "0" + ( ++_iDate ) : _iDate );
};

Post.prototype.getTime = function() {
    var _iHours, _iMinutes,
        dDate = this.date;
    return ( ( _iHours = dDate.getHours() ) < 9 ? "0" + ( _iHours ) : _iHours ) + ":" + ( ( _iMinutes = dDate.getMinutes() ) < 9 ? "0" + ( _iMinutes ) : _iMinutes );
};

module.exports = Post;
