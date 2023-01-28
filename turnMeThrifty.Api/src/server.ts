require('dotenv').config();
import express, { Express, Request, Response } from 'express';
import config from 'config'
import { connectToDb } from './utils/connectToDb';
import log from './utils/logger';
import router from './routes'

const app: Express = express();

const port = config.get('port');

app.use(router);

app.listen(port, () => {
    log.info(`[Server]: I am running at https://localhost:${port}`);

    connectToDb()
});