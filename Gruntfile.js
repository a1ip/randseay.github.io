module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                },
                transform: ['babelify'],
                extensions: ['.jsx'],
            },
            dev: {
                options: {
                    alias: ['react:']  // Make React available externally for dev tools
                },
                src: ['js/_react/forms-with-react.jsx'],
                dest: 'js/examples/forms-with-react.js'
            },
            prod: {
                options: {
                    browserifyOptions: {
                        debug: false
                    }
                },
                src: '<%= browserify.dev.src %>',
                dest: '<%= browserify.dev.dest %>'
            }
        },

        concurrent: {
            serve: [
                'sass',
                'watch',
                'shell:jekyllServe'
            ],
            options: {
                logConcurrentOutput: true
            }
        },

        copy: {
            fontawesome: {
                files: [
                    {
                        expand: true,
                        src: [
                            "bower_components/fontawesome/css/font-awesome.min.css"
                        ],
                        dest: "css/",
                        flatten: true,
                        filter: "isFile"
                    },
                    {
                        expand: true,
                        src: [
                            "bower_components/fontawesome/fonts/fontawesome-webfont.*"
                        ],
                        dest: "fonts/",
                        flatten: true,
                        filter: "isFile"
                    }
                ]
            },
            fuselage: {
                files: [
                    {
                        expand: true,
                        src: [
                            "bower_components/fuselage/scss/fuselage.scss",
                            "bower_components/fuselage/scss/_settings.scss"
                        ],
                        dest: "_sass/",
                        flatten: true,
                        filter: "isFile"
                    }
                ]
            },
            jquery: {
                files: [
                    {
                        expand: true,
                        src: [
                            "bower_components/jquery/dist/jquery.min.js",
                            "bower_components/jquery/dist/jquery.min.map"
                        ],
                        dest: "js/",
                        flatten: true,
                        filter: "isFile"
                    }
                ]
            },
            styles: {
                files: [
                    {
                        expand: true,
                        src: [
                            "_site/css/main.min.css"
                        ],
                        dest: "css/",
                        flatten: true,
                        filter: "isFile"
                    },
                    {
                        expand: true,
                        src: [
                            "_site/css/examples/*.css"
                        ],
                        dest: "css/examples/",
                        flatten: true,
                        filter: "isFile"
                    }
                ]
            }
        },

        imagemin: {
            dynamic: {
                files : [{
                    expand: true,
                    cwd: 'img/',
                    src: '**/*.{gif,jpeg,jpg,png}',
                    dest: 'img/'
                }]
            }
        },

        notify: {
            sass: {
                options: {
                    message: 'Sass compiled.'
                }
            },
            js: {
                options: {
                    message: 'JavaScript compiled.'
                }
            },
            serve: {
                options: {
                    message: 'Jekyll serving at http://127.0.0.1:4000/'
                }
            }
        },

        sass: {
            options: {
                includePaths: ['bower_components/fuselage/scss/components'],
                outputStyle: 'compressed',
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        '_site/css/main.min.css': '_sass/main.scss'
                    },
                    {
                        expand: true,
                        cwd: '_sass',
                        src: ['examples/*.scss'],
                        dest: '_site/css',
                        ext: '.css'
                    }
                ]
            }
        },

        shell: {
            jekyllServe: {
                command: "bundle exec jekyll serve --baseurl="
            },
            jekyllBuild: {
                command: "bundle exec jekyll build --config _config-dev.yml"
            },
            jekyllPrepDeploy: {
                command: "bundle exec jekyll build --config _config.yml"
            }
        },

        watch: {
            images: {
                files: ['img/**/*.{gif,jpeg,jpg,png}'],
                tasks: ['newer:imagemin']
            },
            styles: {
                files: ['_sass/**/*.scss', '_sass/*.scss'],
                tasks: ['sass', 'notify:sass']
            },
            react: {
                files: ['js/_react/*.*'],
                tasks: ['browserify:dev', 'notify:js']
            }
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask('serve', [
        'newer:browserify:dev',
        'notify:js',
        'newer:copy:fontawesome',
        'newer:copy:jquery',
        'newer:copy:fuselage',
        'newer:copy:styles',
        'newer:imagemin',
        'sass',
        'notify:sass',
        'notify:serve',
        'concurrent:serve'
    ]);

    grunt.registerTask('build', [
        'newer:browserify:dev',
        'notify:js',
        'newer:copy:fontawesome',
        'newer:imagemin',
        'newer:copy:jquery',
        'newer:copy:fuselage',
        'newer:copy:styles',
        'shell:jekyllBuild',
        'sass',
        'notify:sass'
    ]);

    grunt.registerTask('prep-deploy', [
        'newer:browserify:prod',
        'newer:copy:fontawesome',
        'newer:imagemin',
        'newer:copy:jquery',
        'newer:copy:fuselage',
        'shell:jekyllPrepDeploy',
        'sass',
        'newer:copy:styles'
    ]);

    grunt.registerTask('default', ['serve']);
}
