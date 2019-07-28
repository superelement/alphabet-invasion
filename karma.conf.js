module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    browsers: ['Chrome'],
    files: [
      'src/**/*.spec.ts'
    ],
    preprocessors: {
      'src/**/*.spec.ts': 'karma-typescript'
    }
  })
}