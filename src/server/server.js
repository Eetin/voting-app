const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const historyApiFallback = require('connect-history-api-fallback');

const { authRouter, apiRouter, publicApiRouter } = require('./routes');
const passport = require('./auth');
const { isAuthenticated } = require('./jwt');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(passport.initialize());

app.set('trust proxy', 1);
app.use(compression());

if (process.env.NODE_ENV === 'production') {
  app.use(historyApiFallback({
    rewrites: [
      {
        from: /^\/(?:(?:auth)|(?:api)|(?:public-api))\/.*$/,
        to: function(context) {
          return context.parsedUrl.pathname;
        }
      }
    ],
    verbose: false
  }));
  app.use(express.static(__dirname + '/../../build'));
} else {
  app.use(historyApiFallback({
    rewrites: [
      {
        from: /^\/(?:(?:auth)|(?:api)|(?:public-api))\/.*$/,
        to: function(context) {
          return context.parsedUrl.pathname;
        }
      }
    ],
    verbose: false
  }));
  const webpack = require('webpack');
  const config = require('../../webpack.dev.config');
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const compiler = webpack(config);
  
  app.use(webpackDevMiddleware(compiler, {
    stats: {
      colors: true,
    },
    historyApiFallback: true,
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use('/auth', authRouter);
app.use('/api', isAuthenticated, bodyParser.urlencoded({ extended: true }), apiRouter);
app.use('/public-api', bodyParser.urlencoded({ extended: true }), publicApiRouter);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Express server listening on ${process.env.IP}:${process.env.PORT}`);
})