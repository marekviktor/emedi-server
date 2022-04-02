import dotenv from "dotenv";
import pg from "pg";
import express from "express";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import {postgraphile} from "postgraphile";
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'
import PgManyToManyPlugin from "@graphile-contrib/pg-many-to-many";
dotenv.config();

const app = express();

const pgPool = new pg.Pool({
    user: process.env.PG_USER,
    database:  process.env.DATABASE,
    password: process.env.PASSWORD,
    host:  process.env.HOST,
    port:  process.env.PG_PORT,
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(postgraphile(pgPool, "emedi", {
    appendPlugins: [PgManyToManyPlugin,ConnectionFilterPlugin,PgSimplifyInflectorPlugin],
    enhanceGraphiql: true,
    graphiql:true,
    dynamicJson: true,
    exportJsonSchemaPath:"schema.json",
    exportGqlSchemaPath: "schema.graphql",
    pgDefaultRole:'privilegeadmin',
    jwtSecret:'alphabet',
    jwtPgTypeIdentifier:'emedi.jwt',
}));

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port http://localhost:${process.env.PORT}/graphiql`)
});









