module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    browsers: ['Chrome'],
    files: [
      'src/**/*.ts'
    ],
    exclude: [
      'src/index.ts'
    ],
    preprocessors: {
      'src/**/*.ts': 'karma-typescript'
    }
  })
}