require('dotenv').config();
import express, { Express, Request, Response } from 'express';
import config from 'config'
import { connectToDb } from './utils/connectToDb';
import log from './utils/logger';
import router from './routes'
import { initializeInternationalization } from './utils/InitializeInternationalization';
import i18nextMiddleware from "i18next-express-middleware"
import i18next from 'i18next';

const app: Express = express();

const port = config.get('port');

app.use(express.json());

app.use(router);

initializeInternationalization();
app.use(i18nextMiddleware.handle(i18next));

app.listen(port, () => {
    log.info(`[Server]: I am running at https://localhost:${port}`);

    connectToDb()
});