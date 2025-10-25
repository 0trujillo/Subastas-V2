module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      // Archivos de prueba
      { pattern: 'src/tests/**/*.spec.js', watched: false },

      // Archivos estáticos (imágenes en public/Imagenes)
      { pattern: 'public/Imagenes/**/*', watched: false, included: false, served: true, nocache: false },

      // 👇 Servir las fuentes de Font Awesome
      { pattern: 'node_modules/font-awesome/fonts/**/*', watched: false, included: false, served: true }
    ],

    proxies: {
      // Redirige las rutas /Imagenes/... al contenido real
      '/Imagenes/': '/base/public/Imagenes/',

      // 👇 Redirige las rutas /fonts/... al contenido real
      '/fonts/': '/base/node_modules/font-awesome/fonts/'
    },

    preprocessors: {
      'src/tests/**/*.spec.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      output: {
        publicPath: '/', // asegura rutas correctas
      },
      module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          // Ignora archivos de fuentes o SVGs con parámetros de versión (?v=...)
          test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]'
          }
        },
        {
          // Archivos de imagen normales
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

    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
