module.exports = function(grunt) {

    "use strict";

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-crx");

    var files = {
        jQueryStandalone: [
            "node_modules/infusion/src/framework/core/js/jquery.standalone.js"
        ],
        infusion: [
            "node_modules/infusion/src/framework/core/js/Fluid.js",
            "node_modules/infusion/src/framework/core/js/FluidDebugging.js",
            "node_modules/infusion/src/framework/core/js/FluidIoC.js",
            "node_modules/infusion/src/framework/core/js/DataBinding.js",
            "node_modules/infusion/src/framework/core/js/ModelTransformation.js",
            "node_modules/infusion/src/framework/core/js/ModelTransformationTransforms.js",
            "node_modules/infusion/src/framework/enhancement/js/ContextAwareness.js"
        ],
        extension: [
            "extension/src/lib/extensionHolder.js",
            "extension/src/lib/highContrast.js",
            "extension/src/lib/chromeSettings.js"
        ]
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        manifest: grunt.file.readJSON("extension/manifest.json"),
        jshint: {
            all: [
                "Gruntfile.js",
                "extension/src/*.js",
                "extension/src/lib/*.js"
            ],
            options: {
                jshintrc: true
            }
        },
        concat: {
            options: {
                separator: ";"
            },
            all: {
                src: [].concat(
                    files.jQueryStandalone,
                    files.infusion,
                    files.extension
                ),
                dest: "dist/gpii-<%= pkg.name %>-all.js"
            }
        },
        uglify: {
            options: {
                beautify: {
                    ascii_only: true
                }
            },
            all: {
                files: [
                    {
                        expand: true,
                        cwd: "dist/",
                        src: ["*.js"],
                        dest: "dist/",
                        ext: ".min.js"
                    }
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        src: ["extension/manifest.json"],
                        dest: "build/manifest.json"
                    },
                    {
                        src: ["extension/src/background.js"],
                        dest: "build/src/background.js"
                    },
                    {
                        expand: true,
                        cwd: "extension/css/",
                        src: "*",
                        dest: "build/css/"
                    },
                    {
                        src: ["dist/gpii-<%= pkg.name %>-all.min.js"],
                        dest: "build/"
                    }
                ]
            }
        },
        clean: {
            all: {
                src: ["dist/", "build/", "*.crx"]
            }
        },
        crx: {
            "build": {
                "src": [
                    "build/**/*"
                ],
                "dest": "./"
            }
        }
    });

    grunt.registerTask("lint", "Lint the source code", ["jshint"]);
    grunt.registerTask("bundle", "Bundle dependencies and source code into a single .min.js file", ["concat", "uglify"]);
    grunt.registerTask("build", "Build the extension so you can start using it unpacked", ["bundle", "copy"]);
    grunt.registerTask("buildPkg", "Create a .crx package ready to be distributed", ["lint", "build", "crx"]);
};
