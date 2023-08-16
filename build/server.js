"use strict";

// src/app.ts
var import_fastify = require("fastify");
var app = (0, import_fastify.fastify)();

// src/server.ts
app.listen({
  host: "0.0.0.0",
  port: 3333
}).then(() => {
  console.log("Server is running in port: 3333");
});
