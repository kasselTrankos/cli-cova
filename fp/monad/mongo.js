// mongo
const MongoClient = require('mongodb').MongoClient;
const { Future, resolve } = require('fluture')
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'crawl';

// collectionExists :: String -> String -> Fluture Error Bool
const collectionExists = dbName => tbl => Future((rej, res)=> {
  MongoClient.connect(url, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    db.listCollections().toArray((err, collections)=> {
      err ? rej(err) : res(collections.includes(tbl))
    })
    // client.close();
  })
  return () => { console.log ('CANT CANCEL')}
})
// listCollections :: String -> String -> Fluture Error [String]
const listCollections = dbName => tbl => Future((rej, res)=> {
  MongoClient.connect(url, (err, client) => {
    if (err)  return rej(err)
    const db = client.db(dbName)
    db.listCollections().toArray((err, collections)=> {
      err ? rej(err) : res(collections)
    })
    client.close();
  })
  return () => { console.log ('CANT CANCEL')}
})

// find :: String -> String -> query -> Future error [{}]
const find = dbName => tbl => query => Future((rej, res) => {
    MongoClient.connect(url, (err, client) => {
      if (err)  return rej(err)
      const db = client.db(dbName)
      const collection = db.collection(tbl)
      collection.find(query).toArray((err, docs) =>
        err ? rej(err) : res(docs)
      ) 
      client.close();
    })
    return () => { console.log ('CANT CANCEL')}
}) 
// insert :: String -> String -> query -> Future error [{}]
const insert = dbName => tbl => query => Future((rej, res) => {
    MongoClient.connect(url, (err, client) => {
      if (err)  return rej(err)
      const db = client.db(dbName)
      const collection = db.collection(tbl)
      collection.insertOne(query, (err, docs) =>
        err ? rej(err) : res(docs)
      ) 
      client.close();
    })
    return () => { console.log ('CANT CANCEL')}
})

const mongo = { collectionExists, insert, find }

module.exports = mongo;
