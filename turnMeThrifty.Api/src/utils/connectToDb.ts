import mongoose, { mongo } from 'mongoose'
import config from 'config'
import log from './logger';

export async function connectToDb() {
    const dbUri = config.get<string>('dbUri')

    mongoose.set("strictQuery", false);

    try {
        await mongoose.connect(dbUri);
        log.info('Connected to Db');
    } catch (e) {
        process.exit(1);
    }
}