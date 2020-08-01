require("dotenv").config();
const express = require("express");
// librarie pentru upload de fisiere
const multer = require("multer");
// Rezolva probleme de access in Single Page Applications
const history = require("connect-history-api-fallback");
const path = require("path");
// librarie care ne da acees la metode legate de sistemul de fisiere
const fs = require("fs");
// utilizam flock pentru a bloca fisiere pentru a evita race-condition
const { flock } = require("fs-ext");
const bodyParser = require("body-parser");
const http = require("http");

const favicon = require("serve-favicon");
// generating logs
const debug = require("debug")("poi:server");
const logger = require("morgan");

// modulul de exec ne permite sa emitem comenzi in shell
const { exec } = require("child_process");

const app = express();

app.use(favicon(path.join(__dirname, "../dist/favicon.ico")));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  next();
});

// serve the Vue Interface
const buildLocation = path.join(__dirname, "../dist");
app.use(express.static(buildLocation));
app.use(
  "/",
  history({
    disableDotRule: true,
    verbose: true,
  })
);
app.use(express.static(buildLocation));

const fileLocation = path.join(__dirname, "./uploads");
// console.log(uploadLocation);

app.get("/getFileList", (req, res) => {
  // get all the files inside fileLocation
  fs.readdir(fileLocation, (err, files) => {
    if (err) {
      res.status(500).send(new Error("Unable to scan directory: " + err));
      return console.log("Unable to scan directory: " + err);
    }
    // get only .txt files
    const fls = files.filter((file) => {
      return (
        path.extname(file).toLowerCase() === ".txt" &&
        fs.statSync(path.join(fileLocation, file)).size < MAX_SIZE
      );
    });
    // create file objects to use in Vue Component
    let i = 0;
    var fileList = fls.map((obj) => ({
      id: i++,
      name: obj,
      size: (fs.statSync(path.join(fileLocation, obj)).size / 1000).toFixed(2),
      type: "text/plain",
      status: "",
    }));

    // send array of file objects to Vue Component
    res.send(fileList);
  });
});

// MAKE FORM INSIDE VUE COMPONENT WITH form(action="/restart")
// HANDLE "/restart" route
// handle POST request on /restart for button click
app.post("/restart", (req, res) => {
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

app.post("/dhcpIP", function(req, res) {
  // check if request body is empty
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    errors.push("Inputs are empty");
    return res.sendStatus(500);
  }

  let fileText = req.body;
  console.log("fileText: ");
  console.log(fileText);
  let ssid = req.body.ssid;
  let pass = req.body.password;
  let errors = [];

  // open file
  const networkFile = fs.openSync(path.join(__dirname + "/test.txt"), "w+");
  // lock file
  flock(networkFile, "ex", (err) => {
    if (err) {
      errors.push("Could not lock file.");
      return console.log("Could not lock file.");
    }
    // file is locked
    console.log("File is locked.");
  });
  // write in file
  let stream = fs.createWriteStream(path.join(__dirname + "/test.txt"));
  let chunk = ssid + "\n" + pass;
  stream.write(chunk, (err) => {
    if (err) {
      errors.push("Could not write to file.");
      return console.log("Could not write to file.");
    }
  });
  stream.end();
  // unlock file
  flock(networkFile, "un", (err) => {
    if (err) {
      errors.push("Could not unlock file.");
      return console.log("Could not unlock file.");
    }
    // file unlocked
    console.log("File is unlocked.");
  });
  // close file
  fs.close(networkFile, (err) => {
    if (err) {
      errors.push("Could not close file.");
      return console.log("Could not close file.");
    }
  });

  if (errors.length != 0) {
    res.sendStatus(500);
  } else res.sendStatus(200);
});

// HANDLE FILE UPLOAD
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["text/plain"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Wrong file type");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};

const MAX_SIZE = 1000; // 1kb

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
});

// 'files' name comes from formData.append('files', file); that is inside the Vue component
app.post("/files", upload.array("files"), (req, res) => {
  res.json({ files: req.files });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.dir(req);
  console.dir(res);
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.post("/updateFiles", (req, res) => {
  let errors = [];
  // check if request body is empty
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    errors.push("Request is empty");
    return res.sendStatus(500);
  }

})

// error handler
app.use(function(err, req, res) {
  if (err.code === "LIMIT_FILE_TYPES") {
    res.status(422).json({ error: "Only text files are allowed" });
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res
      .status(422)
      .json({ error: `File too large. Max size is ${MAX_SIZE / 1000}kb` });
    return;
  }
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

// /**
//  * Event listener for HTTP/S server "listening" event.
//  */

function onListening() {
  let addr = this.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

// Creating the HTTP server

const http_port = process.env.HTTP_PORT;
const http_server = http.createServer(app);

http_server.listen(http_port);

http_server.on("error", onError);
http_server.on("listening", onListening);

console.log(`Server started on http://localhost:8080`);
