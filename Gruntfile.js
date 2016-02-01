module.exports = function(grunt){
    // 1. Configuration goes here!
    grunt.initConfig({
        // 2. Load grunt plugins and tasks
        concat: {
            dist: {
                src: ['public/javascripts/*.js', "!public/javascripts/production.js", "!public/javascripts/production.min.js"],
                dest: 'public/javascripts/production.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'public/javascripts/production.min.js': ['public/javascripts/production.js']
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'public/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/prod_images/'
                }]
            }
        }

    });

    // 3. Tell grunt to load these files
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 4. Tell grunt what to do when we run the grunt command
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);

}


