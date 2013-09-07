/* ecto
 * Simple/fast node.js blogging system.
 *
 * JS Document - /Gruntfile.js
 * Grunt Tasks
 *
 * coded by leny
 * started at 02/09/13
 */

"use strict";

module.exports = function( grunt ) {

    grunt.initConfig( {
        "bumpup": "package.json",
        "concurrent": {
            "options": {
                "logConcurrentOutput": true
            },
            "tasks": [
                "nodemon",
                "watch"
            ]
        },
        "jshint": {
            "files": [
                "server/**/*.js"
            ],
            "options": {
                "boss": true,
                "curly": true,
                "eqeqeq": true,
                "eqnull": true,
                "es5": true,
                "immed": true,
                "indent": 4,
                "latedef": true,
                "newcap": true,
                "noarg": true,
                "node": true,
                "noempty": true,
                "quotmark": "double",
                "sub": true,
                "undef": true,
                "unused": true,
                "white": false
            }
        },
        "nodemon": {
            "server": {
                "options": {
                    "debug": true,
                    "file": "server/server.js",
                    "watchedExtensions": [
                        "js",
                        "jade"
                    ],
                    "watchedFolders": [
                        "server"
                    ],
                    "legacyWatch": true
                }
            }
        },
        "watch": {
            "files": [
                "server/**/*.js",
                "server/**/*.jade"
            ],
            "tasks": [
                "clear",
                "jshint",
                "bumpup:build"
            ]
        }
    } );

    grunt.loadNpmTasks( "grunt-clear" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-bumpup" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-nodemon" );
    grunt.loadNpmTasks( "grunt-concurrent" );

    grunt.registerTask( "default", [
        "clear",
        "jshint",
        "bumpup:build"
    ] );

    grunt.registerTask( "check", [
        "jshint"
    ] );

    grunt.registerTask( "work", [
        "clear",
        "concurrent"
    ] );

    grunt.registerTask( "patch", [
        "clear",
        "jshint",
        "bumpup:patch"
    ] );

    grunt.registerTask( "minor", [
        "clear",
        "jshint",
        "bumpup:minor"
    ] );

    grunt.registerTask( "major", [
        "clear",
        "jshint",
        "bumpup:major"
    ] );

};
