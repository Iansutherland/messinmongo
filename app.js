const assert = require('assert');
const {MongoClient} = require('mongodb');
const {url, dbName} = require('./config.json');
const circulationRepo = require('./repos/circulationRepo');
const circulationData = require('./circulation.json');

async function main() {
    const client = new MongoClient(url);
    await client.connect();
    try{
        const results = await circulationRepo.loadData(circulationData);
        assert.equal(circulationData.length, results.insertedCount);
    
        const getData = await circulationRepo.get();
        assert.equal(circulationData.length, getData.length);

        const filterData = await circulationRepo.get({Newspaper: getData[4].Newspaper});
        assert.deepEqual(filterData[0], getData[4]);

        const limitData = await circulationRepo.get({}, 3);
        assert.equal(limitData.length, 3);
    }
    catch (error){
        console.log(error);
    }
    finally {
        const admin = client.db(dbName).admin();
        await client.db(dbName).dropDatabase();
        console.log(await admin.listDatabases());
    
        client.close();
    }
}
main();