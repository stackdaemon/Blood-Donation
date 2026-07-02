const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

// Ensure data folder and db.json exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], donationrequests: [], fundings: [] }, null, 2));
}

function readData() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [], donationrequests: [], fundings: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
    this.preHooks = { save: [] };
    this.methods = {};
  }

  pre(hook, fn) {
    if (!this.preHooks[hook]) this.preHooks[hook] = [];
    this.preHooks[hook].push(fn);
  }
}

class Document {
  constructor(data, modelInstance) {
    Object.assign(this, JSON.parse(JSON.stringify(data || {})));
    this._modelInstance = modelInstance;

    // Attach methods from schema
    if (modelInstance.schema && modelInstance.schema.methods) {
      for (const [key, fn] of Object.entries(modelInstance.schema.methods)) {
        this[key] = fn.bind(this);
      }
    }
  }

  isModified(field) {
    if (field === 'password') {
      if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
        return false;
      }
      return !!this.password;
    }
    return true;
  }

  async save() {
    // Run pre-save hooks
    const preHooks = this._modelInstance.schema.preHooks.save || [];
    for (const hook of preHooks) {
      await new Promise((resolve, reject) => {
        hook.call(this, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    const collectionName = this._modelInstance.collectionName;
    const dbData = readData();
    const list = dbData[collectionName] || [];

    // Clean Document fields to avoid saving _modelInstance reference
    const rawData = {};
    for (const key of Object.keys(this)) {
      if (key !== '_modelInstance' && typeof this[key] !== 'function') {
        rawData[key] = this[key];
      }
    }

    if (!rawData._id) {
      rawData._id = Math.random().toString(36).substring(2, 9);
      rawData.createdAt = new Date().toISOString();
      rawData.updatedAt = new Date().toISOString();
      list.push(rawData);
      Object.assign(this, rawData);
    } else {
      rawData.updatedAt = new Date().toISOString();
      const idx = list.findIndex(item => item._id === rawData._id);
      if (idx !== -1) {
        list[idx] = rawData;
      } else {
        list.push(rawData);
      }
      Object.assign(this, rawData);
    }

    dbData[collectionName] = list;
    writeData(dbData);
    return this;
  }
}

class MockModel {
  constructor(name, schema) {
    this.name = name;
    this.schema = schema;
    this.collectionName = name.toLowerCase() + 's';
  }

  _matches(item, query) {
    if (!query) return true;
    for (const [key, val] of Object.entries(query)) {
      if (val && typeof val === 'object') {
        // Simple skip for object queries (like regex or Mongo operators)
        continue;
      }
      if (item[key] !== val) return false;
    }
    return true;
  }

  async find(query = {}) {
    const dbData = readData();
    const list = dbData[this.collectionName] || [];
    const filtered = list.filter(item => this._matches(item, query));
    
    // Return wrapped documents
    const docs = filtered.map(item => new Document(item, this));
    
    // Mock sort, skip, limit chain
    const chain = {
      sort: (sortObj) => {
        docs.sort((a, b) => {
          const key = Object.keys(sortObj)[0];
          const dir = sortObj[key];
          if (a[key] < b[key]) return dir === -1 || dir === 'desc' ? 1 : -1;
          if (a[key] > b[key]) return dir === -1 || dir === 'desc' ? -1 : 1;
          return 0;
        });
        return chain;
      },
      limit: (num) => {
        const sliced = docs.slice(0, num);
        const finalDocs = sliced.map(i => new Document(i, this));
        finalDocs.sort = chain.sort;
        finalDocs.limit = chain.limit;
        finalDocs.skip = chain.skip;
        return finalDocs;
      },
      skip: (num) => {
        const sliced = docs.slice(num);
        const finalDocs = sliced.map(i => new Document(i, this));
        finalDocs.sort = chain.sort;
        finalDocs.limit = chain.limit;
        finalDocs.skip = chain.skip;
        return finalDocs;
      },
      then: (resolve) => resolve(docs),
      catch: (reject) => reject()
    };
    
    return docs;
  }

  async findOne(query) {
    const dbData = readData();
    const list = dbData[this.collectionName] || [];
    const item = list.find(i => this._matches(i, query));
    return item ? new Document(item, this) : null;
  }

  async findById(id) {
    if (!id) return null;
    const dbData = readData();
    const list = dbData[this.collectionName] || [];
    const item = list.find(i => String(i._id) === String(id));
    return item ? new Document(item, this) : null;
  }

  async create(data) {
    const doc = new Document(data, this);
    return await doc.save();
  }

  async deleteOne(query) {
    const dbData = readData();
    const list = dbData[this.collectionName] || [];
    const idx = list.findIndex(i => this._matches(i, query));
    if (idx !== -1) {
      list.splice(idx, 1);
      dbData[this.collectionName] = list;
      writeData(dbData);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query = {}) {
    const dbData = readData();
    if (Object.keys(query).length === 0) {
      dbData[this.collectionName] = [];
      writeData(dbData);
      return { deletedCount: 0 };
    }
    const list = dbData[this.collectionName] || [];
    const filtered = list.filter(i => !this._matches(i, query));
    const deletedCount = list.length - filtered.length;
    dbData[this.collectionName] = filtered;
    writeData(dbData);
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    const dbData = readData();
    const list = dbData[this.collectionName] || [];
    return list.filter(i => this._matches(i, query)).length;
  }

  async insertMany(arr) {
    const docs = [];
    for (const item of arr) {
      const doc = await this.create(item);
      docs.push(doc);
    }
    return docs;
  }

  async aggregate(pipeline) {
    const dbData = readData();
    const list = dbData[this.collectionName] || [];
    let sum = 0;
    for (const item of list) {
      if (item.amount) sum += Number(item.amount);
    }
    return [{ _id: null, totalAmount: sum }];
  }
}

const models = {};

function createModelClass(name, schema) {
  const modelInstance = new MockModel(name, schema);
  
  class ModelDocument extends Document {
    constructor(data) {
      super(data, modelInstance);
    }
    
    static get schema() {
      return modelInstance.schema;
    }

    static get collectionName() {
      return modelInstance.collectionName;
    }

    static async find(query) {
      return modelInstance.find(query);
    }

    static async findOne(query) {
      return modelInstance.findOne(query);
    }

    static async findById(id) {
      return modelInstance.findById(id);
    }

    static async create(data) {
      return modelInstance.create(data);
    }

    static async deleteOne(query) {
      return modelInstance.deleteOne(query);
    }

    static async deleteMany(query) {
      return modelInstance.deleteMany(query);
    }

    static async countDocuments(query) {
      return modelInstance.countDocuments(query);
    }

    static async insertMany(arr) {
      return modelInstance.insertMany(arr);
    }

    static async aggregate(pipeline) {
      return modelInstance.aggregate(pipeline);
    }
  }
  
  return ModelDocument;
}

module.exports = {
  Schema,
  model: function (name, schema) {
    if (!models[name]) {
      models[name] = createModelClass(name, schema);
    }
    return models[name];
  },
  connect: async function () {
    console.log('MongoDB connection skipped. Mock Mongoose active (Local File DB).');
    return {
      connection: {
        host: 'LocalFileDB'
      }
    };
  },
  disconnect: async function () {
    return true;
  }
};
