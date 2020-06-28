const {MongoClient} = require('mongodb');
const {url, dbName} = require('../config.json');

function circulationRepo() {
    function loadData(data){
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);

                results = await db.collection('newspapers').insertMany(data);
                resolve(results);
                client.close();
            }
            catch (error){
                reject(error);
            }
        })
    }

    function get(query, limit) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);

                let items = db.collection('newspapers').find(query);

                if(limit > 0){
                    items = items.limit(limit);
                }
                
                resolve(await items.toArray());
                client.close();
            }
            catch (error){
                reject(error);
            }
        })
    }

    return {loadData, get}
}

module.exports = circulationRepo();