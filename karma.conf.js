module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      // Tus tests se incluyen, pero no se instrumentan
      { pattern: 'src/tests/**/*.spec.js', watched: false },
      { pattern: 'public/Imagenes/**/*', watched: false, included: false, served: true, nocache: false },
      { pattern: 'node_modules/font-awesome/fonts/**/*', watched: false, included: false, served: true }
    ],

    proxies: {
      '/Imagenes/': '/base/public/Imagenes/',
      '/fonts/': '/base/node_modules/font-awesome/fonts/'
    },

    preprocessors: {
      // Instrumenta todo el código de la aplicación (JS y JSX)
      'src/**/*.js': ['webpack', 'coverage'],
      'src/**/*.jsx': ['webpack', 'coverage'],

      // Los tests solo se compilan
      'src/tests/**/*.spec.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      output: {
        publicPath: '/',
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
            type: 'asset/resource',
            generator: {
              filename: '[name][ext]'
            }
          },
          {
            test: /\.(png|jpg|jpeg|gif|webp)$/i,
            type: 'asset/resource'
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      }
    },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: '.' },
        { type: 'text-summary' }
      ],
      includeAllSources: true // asegura que todos los archivos de la app se midan
    },

    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
