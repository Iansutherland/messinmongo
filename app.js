const MongoClient = require('mongodb').MongoClient;
const {url} = require('./config.json');

const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);
    await client.connect();

    const admin = client.db(dbName).admin();
    console.log(await admin.serverStatus());
    console.log(await admin.listDatabases());
}
main();