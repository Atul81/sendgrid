const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(require('./src/service/mock/_mockData.js')());
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.listen(3002, () => {
    console.log('JSON Server is running')
});
