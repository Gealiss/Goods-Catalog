const mongooseLoader = require('./mongoose')
const expressLoader = require('./express')
const websocketLoader = require('./websocket')

module.exports = async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    console.log('MongoDB Initialized');
    await expressLoader({ app: expressApp, connection: mongoConnection });
    console.log('Express Initialized');
    await websocketLoader(parseInt(process.env.PORT_WS));
    console.log('Websocket Initialized'); 
    // ... more loaders can be here
  
    // ... Initialize agenda
    // ... or Redis, or whatever you want
}