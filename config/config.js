var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/workspace-development',
    apikey: #YOURKEYHERE
  },

  test: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/workspace-test',
    apikey: #YOURKEYHERE
  },

  production: {
    root: rootPath,
    app: {
      name: 'workspace'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/workspace-production',
    apikey: #YOURKEYHERE
  }
};

module.exports = config[env];
