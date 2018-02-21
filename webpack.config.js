module.exports = {
  entry: __dirname + '/app/main.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    inline: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /(\.css$)/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            /*options: {
                            modules: true
                        }*/
          },
          {
            loader: 'postcss-loader',
          },
        ],
        include: __dirname,
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: '$',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader',
          },
        ],
      },
    ],
  },
};
