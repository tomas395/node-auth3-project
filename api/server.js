const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session"); // npm i express-session
const KnexStore = require("connect-session-knex")(session); // remember to curry and pass the session
const knex = require("../data/dbConfig");
const userRouter = require("../users/users-router");
const server = express();

const sessionsConfig = {
  name: "monkeydluffy",
  secret: "something to do with the void century",
  resave: false,
  saveUninitialized: true, // related to GDPR compliance

  cookie: {
    maxAge: 1000 * 60 * 15,
    secure: false, // should be true in production
    httpOnly: true // true means JS can't touch the cookie
  },

  // remember the new keyword
  store: new KnexStore({
    knex,
    tablename: "sessions",
    createtable: true,
    sidfieldname: "sid",
    clearInterval: 1000 * 60 * 15
  })
};

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(session(sessionsConfig));
// turn on the session middleware
// at this point there is a req.session object created by express-session
server.use("/api/users", userRouter);

module.exports = server;
