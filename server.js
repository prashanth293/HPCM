/**
 * @author Amit Raushan <amiraush@publicis@groupe.net>
 * @description A express server which listens on port 5001 for connections.
 */
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware'; //wrapper that will emit files processed by webpack to a server
import config from './webpack.config.babel.js';


const app = express(),
    compiler = webpack(config),
    isDevelopment = process.env.npm_config_env === 'development';

//checks whether passed environment is development
if (isDevelopment) {
    // Tell express to use the webpack-dev-middleware and use the configuration file
    // as a base.
    app.use(middleware(compiler));
} else {
    app.use(express.static(__dirname + '/dist'));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//serve the files on port 5001
/*eslint-disable no-console*/
app.listen(5001, () => {
    console.log('server started at port 5001');
});