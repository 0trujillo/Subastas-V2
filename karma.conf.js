module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/tests/**/*.spec.js', watched: false },
      { pattern: 'public/Imagenes/**/*', watched: false, included: false, served: true, nocache: false },
      { pattern: 'node_modules/font-awesome/fonts/**/*', watched: false, included: false, served: true }
    ],

    proxies: {
      '/Imagenes/': '/base/public/Imagenes/',
      '/fonts/': '/base/node_modules/font-awesome/fonts/'
    },

    preprocessors: {
      'src/**/*.js': ['webpack', 'coverage'], // <--- instrumenta todo el código fuente
      'src/**/*.jsx': ['webpack', 'coverage'], // <--- también los componentes React
      'src/tests/**/*.spec.js': ['webpack'] // los tests se compilan, pero no se cubren
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

    // 💡 Agrega el reporter de cobertura
    reporters: ['progress', 'coverage'],

    // 💡 Configuración de cobertura
    coverageReporter: {
      dir: 'coverage/',       // Carpeta donde se guardará el reporte
      reporters: [
        { type: 'html', subdir: '.' },    // Reporte visual HTML
        { type: 'text-summary' }          // Resumen en consola
      ]
    },

    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
