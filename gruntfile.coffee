module.exports = (grunt)->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig
    bowerInstall:
      target:
        src: ['views/*.ejs']