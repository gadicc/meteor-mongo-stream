Package.describe({
  name: 'gadicc:mongo-stream',
  version: '0.0.1',
  summary: 'Record and live stream streams (stdout/stderr/anything) to the browser',
  git: 'https://github.com/gadicc/meteor-mongo-stream',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-rc.6');
  api.use('ecmascript');
  api.use('templating');
  api.use('thereactivestack:blazetoreact@0.1.5', 'client');

  api.mainModule('mongo-stream-client.js', 'client');
  api.addFiles('mongo-stream-client.css', 'client');
  api.addFiles('node_modules/ansi_up/examples/theme.css', 'client');

  api.mainModule('mongo-stream-server.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('gadicc:mongo-stream');
  api.mainModule('mongo-stream-tests.js');
});
