Package.describe({
  name: 'ephemer:json-collections',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Makes simple local collections out of .json files in your app bundle',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/ephemer/meteor-json-collections',
});


Package.registerBuildPlugin({
  name: "Read collection data from JSON files",
  sources: ['json-reader.js']
});