import dotenv from "dotenv";
import pg from "pg";
import express from "express";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import { postgraphile } from "postgraphile";

dotenv.config();

const app = express();

const pgPool = new pg.Pool({
    user: process.env.PG_USER,
    database:  process.env.DATABASE,
    password:  process.env.PASSWORD,
    host:  process.env.HOST,
    port:  process.env.PG_PORT,
});

const middleware = postgraphile(pgPool, "emedi", {
    appendPlugins: [ConnectionFilterPlugin],
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    exportJsonSchemaPath:"schema.json",
    exportGqlSchemaPath: "schema.graphql",
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(middleware);

app.listen(process.env.PORT);








