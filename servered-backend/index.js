const createServer = require('http').createServer;
const SubscriptionServer = require('subscriptions-transport-ws').SubscriptionServer;
const graphql = require('graphql');
const { execute, subscribe } = graphql;
const schema = require('../backend/dist/root.schema');
const WS_PORT = 5000;

// // Create WebSocket listener server
const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

// // Bind it to port and start listening
websocketServer.listen(WS_PORT, () => console.log(
  `Websocket Server is now running on http://localhost:${WS_PORT}`
));

console.log(JSON.stringify(SubscriptionServer));

const subscriptionServer = SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: websocketServer,
    path: '/graphql',
  }
);