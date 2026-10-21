
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/utils.js', type: 'module' },
      { pattern: 'src/tests/**/*.spec.js', type: 'module' }
    ],

    preprocessors: {
      'src/utils.js': ['coverage']
    },
    
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    },

    browsers: ['ChromeHeadless'],

    singleRun: true,

    client: {
      jasmine: {
        random: false
      }
    }
  });
};
