const express = require("express");
require("dotenv").config();

const debug = require("debug")("poi:server");
const path = require("path");
const favicon = require("serve-favicon");
// generating logs
const logger = require("morgan");
const bodyParser = require("body-parser");
const http = require("http");

const { exec } = require("child_process");

const app = express();

app.use(favicon(path.join(__dirname, "../dist/favicon.ico")));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// serve the Vue Interface
app.use(express.static(path.join(__dirname, "../dist")));

// handle POST request on /home for button click
app.post("/home", function(req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0)
    return;

  let shell_command = req.body.command;

  console.log("req.body: ");
  console.log(shell_command);

  async function shell(command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          reject(err);
        } else {
        //   console.log(`stdout: ${stdout}`);
        //   console.error(`stderr: ${stderr}`);
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async function shellExec(command) {
    let { stdout } = await shell(command);
    for (let line of stdout.split("\n")) {
      console.log(`cmd line: ${line}`);
    }
  }

  shellExec(shell_command);

  res.send("Hello !");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.dir(req);
  console.dir(res);
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res /*next*/) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/**
 * Event listener for HTTP/S server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  let port = this.address().port;
  //   let port = http_port;
  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP/S server "listening" event.
 */

function onListening() {
  let addr = this.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

// Creating the HTTP server

const http_port = process.env.HTTP_PORT;
const http_server = http.createServer(app);

http_server.listen(http_port);
console.log(http_port);

http_server.on("error", onError);
http_server.on("listening", onListening);

console.log(`Server started on http://localhost:8080`);
