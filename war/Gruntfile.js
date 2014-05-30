module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
    
        sass : {
            dist : {
                options : {
                    sourcemap : true
                },
                files : [{
                    expand: true,
                    cwd: 'styles/sass',
                    src: 'content.scss',
                    dest: 'styles',
                    ext: '.css'
                }]
            }
        },
        jslint : {
            server : {
                src : ['*.js', 'js/*.js', 'js/*/*.js'],
                exclude : ['Gruntfile.js', '*/lib/*.js'],
                directives: {
                    predef: [
                        '$',
                        'cordova',
                        '_',
                        'chrome',
                        'window',
                        'console',
                        'angular',
                        'app',
                        'document',
                        '$scope'
                    ],
                    node: false,
                    plusplus: true,
                    onevar: false,
                    vars : true,
                    nomen: true,
                    todo: true,
                    white: false,
                    eqnull: true,
                    eqeqeq: false,
                    latedef: false,
                    undef: false,
                    unparam: true,
                    strict: false,
                    globalstrict: true,

                }
            }
        },
        jsonlint: {
            sample: {
                src: [ '*.json' ]
            }
        },
        watch : {
            css : {
                files : ['styles/sass/*.scss'],
                tasks : ['sass']
            },
            js : {
                files : ['*.js', 'js/*.js', 'js/*/*.js'],
                tasks : ['jslint']
            },

        }
    });


    //Tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-jsonlint');
    grunt.loadNpmTasks('grunt-jslint');


    grunt.registerTask('default',['watch']);

};
