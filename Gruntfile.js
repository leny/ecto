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
        "concurent": {
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
                "src/**/*.js"
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
                "unused": true
            }
        },
        "nodemon": {
            "server": {
                "options": {
                    "debug": true
                    "file": "src/server.js",
                    "watchedExtensions": [
                        "js",
                        "jade"
                    ],
                    "watchedFolders": [
                        "bin"
                    ]
                }
            }
        },
        "watch": {
            "files": [
                "src/**/*.js",
                "src/**/*.jade"
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
        "clean",
        "jshint",
        "bumpbup:build"
    ] );

    grunt.registerTask( "check", [
        "jshint"
    ] );

    grunt.registerTask( "work", [
        "clean",
        "concurrent"
    ] );

    grunt.registerTask( "patch", [
        "clean",
        "jshint",
        "bumpbup:patch"
    ] );

    grunt.registerTask( "minor", [
        "clean",
        "jshint",
        "bumpbup:minor"
    ] );

    grunt.registerTask( "major", [
        "clean",
        "jshint",
        "bumpbup:major"
    ] );

};
