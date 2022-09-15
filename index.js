const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env;

server.listen(app.get(port), () => {
    console.log(`Server running on port ${port}`);
});