module.exports = function webpackConfigPlugin(context, options) {
  return {
    name: 'webpack-config-plugin',
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false
              }
            }
          ]
        },
        resolve: {
          alias: {
            '@passwordless-id/webauthn/dist/esm/client': '@passwordless-id/webauthn/dist/esm/client.js'
          }
        }
      };
    },
  };
};
