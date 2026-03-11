const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ---------------------------------------------------------------------------
// NOTE: We rely on the surgical patch in NodeWatcher.js for EMFILE protection.
// ---------------------------------------------------------------------------

// Exclude large build directories from the file watcher.
config.resolver.blockList = [
  /.*\/android\/.*/,
  /.*\/ios\/.*/,
  /.*\/\.expo\/.*/,
  /.*\/web-build\/.*/,
  /.*\/\.git\/.*/,
];

module.exports = config;
