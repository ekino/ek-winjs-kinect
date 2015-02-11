module.exports = function (grunt) {

    grunt.config.set('clean', {
        images :{
            src:['<%= config.www_dir %>/**/*.{png,jpg,jpeg,gif,webp,svg}']
        },
        js :{
            src:['<%= config.www_dir %>/**/*.js']
        },
        css :{
            src:['<%= config.www_dir %>/**/*.{css,map}']
        },
        markup :{
            src:['<%= config.www_dir %>/**/*.html']
        },
        bower :{
            src:['<%= config.www_dir %>/<%= config.bower_dir %>']
        },
        all:{
            src:['<%= config.www_dir %>']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
};



