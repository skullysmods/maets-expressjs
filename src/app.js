import express from "express";
import https from 'https';
import fs from 'fs';
import path from 'path';
import routes from "./routes/index.js";

const app = express();

const __dirname = path.resolve();
const options = {
  key: fs.readFileSync(path.join(__dirname, './certs/server.key')),
  cert: fs.readFileSync(path.join(__dirname, './certs/server.cert'))
};

https.createServer(options, app).listen(3001);
app.use(express.json());
app.use("/", routes);

export default app;
