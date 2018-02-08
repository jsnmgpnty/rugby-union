const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');

const mongoDbPort = 27017;
const databaseName = 'rugby-union';
const mongoDbHost = process.env.REACT_RUNTIME_DB_HOST || 'mongodb';

const getDatabase = () => {
	return new Promise((resolve, reject) => {
		MongoClient.connect('mongodb://' + mongoDbHost.trim() + ':' + mongoDbPort, function (err, client) {
			if (err) {
				reject(err);
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