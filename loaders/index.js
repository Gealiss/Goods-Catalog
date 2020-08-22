const mongooseLoader = require('./mongoose')
const expressLoader = require('./express')

module.exports = async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    console.log('MongoDB Initialized');
    await expressLoader({ app: expressApp, connection: mongoConnection });
    console.log('Express Initialized');
    // ... more loaders can be here
  
    // ... Initialize agenda
    // ... or Redis, or whatever you want
}