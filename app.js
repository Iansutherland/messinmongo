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

        const id = getData[4]._id.toString();
        const byId = await circulationRepo.getById(id);
        assert.deepEqual(byId, getData[4]);
        const newItem =   {
            "Newspaper": "WMy Paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 2,
            "Change in Daily Circulation, 2004-2013": 100,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        };
        const addedItem = await circulationRepo.add(newItem);
        assert(addedItem._id);//_id should be added to item if it's there
        const addedItemQuery = await circulationRepo.getById(addedItem._id);
        assert.deepEqual(addedItemQuery, newItem);

        const updatedItem = await  circulationRepo.update(addedItem._id, {
            "Newspaper": "My new paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 2,
            "Change in Daily Circulation, 2004-2013": 100,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        });
        const newAddedItemQuery = await circulationRepo.getById(addedItem._id);
        assert.equal(newAddedItemQuery.Newspaper, "My new paper");

        const removed = await circulationRepo.remove(addedItem._id);
        assert(removed);
        const deletedItem = await circulationRepo.getById(addedItem._id);
        assert.equal(deletedItem, null);
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