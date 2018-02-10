const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const connString = require('./dbEnv');

const mongoDbPort = 27017;
const databaseName = 'rugby-union';
const mongoDbHost = process.env.DB_HOST || 'mongodb';
const mongoDbConnectionString = process.env.NODE_ENV.trim() === 'prod' ? connString.db.uri : 'mongodb://' + mongoDbHost.trim() + ':' + mongoDbPort;

const getDatabase = () => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(mongoDbConnectionString, { uri_decode_auth: true }, function (err, client) {
			if (err) {
				console.log(err);
				reject(err);
				return;
			}

			var db = client.db(databaseName);
			resolve(db);
		});
	});
};

class DbRepository {
	constructor(collectionName) {
		this.collectionName = collectionName;
	}

	async getList(options) {
		const db = await getDatabase();
		return new Promise((resolve, reject) => {
			db.collection(this.collectionName).find({}, options).toArray((err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	async getFilteredList(filter, options) {
		const db = await getDatabase();
		return new Promise((resolve, reject) => {
			db.collection(this.collectionName).find(filter, options).toArray((err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	async getItem(filter, options) {
		const db = await getDatabase();
		return new Promise((resolve, reject) => {
			db.collection(this.collectionName).findOne(filter, options, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	async save(document) {
		var db = await getDatabase();
		return new Promise((resolve, reject) => {
			db.collection(this.collectionName).save(document, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

module.exports = DbRepository;