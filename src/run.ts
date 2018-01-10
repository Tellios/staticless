import "reflect-metadata";
import { Server } from "./server/Server";

global.appRoot = __dirname;

const server = new Server();
server.init();
