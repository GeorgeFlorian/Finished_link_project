const axios = require("axios");

var country_code = "";

async function getIP() {
  return await axios
    .get("http://www.geoplugin.net/json.gp")
    .then((res) => {
      country_code = res.data.geoplugin_countryCode;
      // console.log(ip);
    })
    .catch((error) => {
      console.error(error);
    });
}

getIP();

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

// servim fisierele interfetei Vue in mod static
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

const configFilesLocation = path.join(__dirname, "/uploads");
//declaram locatia fisierelor
const config_lock_path = path.join(configFilesLocation, "/configuration.lock");
const dhcpcd_lock_path = path.join(configFilesLocation, "/dhcpcd_conf.lock");
const wpa_lock_path = path.join(configFilesLocation, "/wpa_conf.lock");

// const configFilesLocation = "/var/www/html/website/config";
// const config_lock_path = path.join(configFilesLocation, "/configuration.lock");
// const dhcpcd_lock = path.join(configFilesLocation, "/dhcpcd_conf.lock");
// const wpa_lock = path.join(configFilesLocation, "/wpa_conf.lock");

app.get("/getDisplaySettings", (req, res) => {
  //deschidem fisierul lock
  const config_lock = fs.openSync(config_lock_path, "w+");

  // blocam fisierul lock
  flock(config_lock, "ex", (err) => {
    if (err) {
      return console.error("Could not lock config_lock file.");
    }
    // fisierul este blocat
    console.log("config_lock is locked.");
    // citim fisierul text
    // fs.readFile() deschide, citeste si inchide fisierul text
    fs.readFile(
      path.join(configFilesLocation, "/configuration.txt"),
      "utf8",
      (error, data) => {
        if (error) throw error;
        const fileContent = data;
        console.log("Current Display Settings:");
        // create an object containing the text file lines
        const obj = {};
        const array = fileContent.split(/\r\n|\n/);
        for (let i = 0; i < array.length; i++) {
          obj[`line${i}`] = array[i];
        }
        // console.log(obj);
        res.status(200).send(obj);

        // deoarece fs.readFile() este asincrona suntem nevoiti sa deblocam
        // si sa inchidem fisierul lock in interiorul functiei fs.readFile()

        // deblocam fisierul
        flock(config_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("config_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(config_lock);
        });
      }
    );
  });
});

app.get("/getFileList", (req, res) => {
  // citim toate fisierele intr-o lista
  fs.readdir(configFilesLocation, (err, files) => {
    if (err) {
      res.status(500).send(new Error("Unable to scan directory: " + err));
      return console.log("Unable to scan directory: " + err);
    }
    // luam doar fisierele .txt
    const fls = files.filter((file) => {
      return (
        path.extname(file).toLowerCase() === ".txt" &&
        fs.statSync(path.join(configFilesLocation, file)).size < MAX_SIZE
      );
    });
    // creeam obiecte cu informatii despre fisiere
    let i = 0;
    var fileList = fls.map((obj) => ({
      id: i++,
      name: obj,
      size: (
        fs.statSync(path.join(configFilesLocation, obj)).size / 1000
      ).toFixed(2),
      type: "text/plain",
      status: "",
    }));
    // console.log("fileList", fileList);

    // trimitem lista de obiecte de fisiere catre interfata Vue
    res.send(fileList);
  });
});

// handler pentru butonul de restart
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

app.post("/dhcpWifi", (req, res) => {
  // verificam daca body-ul requestului este gol
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send("ERROR: Inputs are empty !");
  }

  let ssid = req.body.ssid;
  let pass = req.body.password;
  const write_to_dhcpcd = `interface wlan0
hostname MetriciDisplayWiFi
clientid
interface eth0
noipv4
noipv6
`;
  const write_to_wpa = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=${country_code}
network={
ssid="${ssid}"
psk="${pass}"
}
`;

  // deschidem fisierul lock
  const dhcpcd_lock = fs.openSync(dhcpcd_lock_path, "w+");
  // blocam fisierul lock
  flock(dhcpcd_lock, "ex", (err) => {
    if (err) return console.error("Could not lock dhcpcd_lock file.");
    // fisierul este blocat
    console.log("dhcpcd_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/dhcpcd_conf.txt"),
      write_to_dhcpcd,
      (error) => {
        if (error) return console.error(error);
        console.log("dhcpcd_conf.txt was saved");
        // deblocam fisierul lock
        flock(dhcpcd_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("dhcpcd_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(dhcpcd_lock);
        });
      }
    );
  });

  // deschidem fisierul lock
  const wpa_lock = fs.openSync(wpa_lock_path, "w+");
  // blocam fisierul lock
  flock(wpa_lock, "ex", (err) => {
    if (err) return console.error("Could not lock wpa_lock file.");
    // fisierul este blocat
    console.log("wpa_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/wpa_conf.txt"),
      write_to_wpa,
      (error) => {
        if (error) return console.error(error);
        console.log("wpa_conf.txt was saved");
        // deblocam fisierul lock
        flock(wpa_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("wpa_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(wpa_lock);
        });
      }
    );
  });

  res.sendStatus(200);
});

app.post("/dhcpEth", (req, res) => {
  // verificam daca body-ul requestului este gol
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send("ERROR: Inputs are empty !");
  }
  
  const write_to_dhcpcd = `interface wlan0
noipv4
noipv6
interface eth0
hostname MetriciDisplayEth
clientid
profile static_eth0
static ip_address=192.168.1.70/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8
interface eth0
fallback static_eth0
`;
  const write_to_wpa = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
`;

  // deschidem fisierul lock
  const dhcpcd_lock = fs.openSync(dhcpcd_lock_path, "w+");
  // blocam fisierul lock
  flock(dhcpcd_lock, "ex", (err) => {
    if (err) return console.error("Could not lock dhcpcd_lock file.");
    // fisierul este blocat
    console.log("dhcpcd_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/dhcpcd_conf.txt"),
      write_to_dhcpcd,
      (error) => {
        if (error) return console.error(error);
        console.log("dhcpcd_conf.txt was saved");
        // deblocam fisierul lock
        flock(dhcpcd_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("dhcpcd_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(dhcpcd_lock);
        });
      }
    );
  });

  // deschidem fisierul lock
  const wpa_lock = fs.openSync(wpa_lock_path, "w+");
  // blocam fisierul lock
  flock(wpa_lock, "ex", (err) => {
    if (err) return console.error("Could not lock wpa_lock file.");
    // fisierul este blocat
    console.log("wpa_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/wpa_conf.txt"),
      write_to_wpa,
      (error) => {
        if (error) return console.error(error);
        console.log("wpa_conf.txt was saved");
        // deblocam fisierul lock
        flock(wpa_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("wpa_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(wpa_lock);
        });
      }
    );
  });

  res.sendStatus(200);
});

app.post("/staticWifi", (req, res) => {
  // verificam daca body-ul requestului este gol
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send("ERROR: Inputs are empty !");
  }

  let ssid = req.body.ssid;
  let pass = req.body.password;
  let ip = req.body.ipAddress;
  let gateway = req.body.gateway;
  let subnet = req.body.subnet;
  let dns = req.body.dns;
  const write_to_dhcpcd = `interface wlan0
hostname MetriciDisplayWiFi
clientid
static ip_address=${ip}/${subnet}
static routers=${gateway}
static domain_name_servers=${dns}
interface eth0
noipv4
noipv6
`;
  const write_to_wpa = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=${country_code}
network={
ssid="${ssid}"
psk="${pass}"
}
`;

  // deschidem fisierul lock
  const dhcpcd_lock = fs.openSync(dhcpcd_lock_path, "w+");
  // blocam fisierul lock
  flock(dhcpcd_lock, "ex", (err) => {
    if (err) return console.error("Could not lock dhcpcd_lock file.");
    // fisierul este blocat
    console.log("dhcpcd_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/dhcpcd_conf.txt"),
      write_to_dhcpcd,
      (error) => {
        if (error) return console.error(error);
        console.log("dhcpcd_conf.txt was saved");
        // deblocam fisierul lock
        flock(dhcpcd_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("dhcpcd_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(dhcpcd_lock);
        });
      }
    );
  });

  // deschidem fisierul lock
  const wpa_lock = fs.openSync(wpa_lock_path, "w+");
  // blocam fisierul lock
  flock(wpa_lock, "ex", (err) => {
    if (err) return console.error("Could not lock wpa_lock file.");
    // fisierul este blocat
    console.log("wpa_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/wpa_conf.txt"),
      write_to_wpa,
      (error) => {
        if (error) return console.error(error);
        console.log("wpa_conf.txt was saved");
        // deblocam fisierul lock
        flock(wpa_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("wpa_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(wpa_lock);
        });
      }
    );
  });

  res.sendStatus(200);
});

app.post("/staticEthernet", (req, res) => {
  // verificam daca body-ul requestului este gol
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(500).send("ERROR: Inputs are empty !");
  }

  let ip = req.body.ipAddress;
  let gateway = req.body.gateway;
  let subnet = req.body.subnet;
  let dns = req.body.dns;
  const write_to_dhcpcd = `interface wlan0
noipv4
noipv6
interface eth0
hostname MetriciDisplayEth
clientid
static ip_address=${ip}/${subnet}
static routers=${gateway}
static domain_name_servers=${dns}
`;
  const write_to_wpa = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
`;

  // deschidem fisierul lock
  const dhcpcd_lock = fs.openSync(dhcpcd_lock_path, "w+");
  // blocam fisierul lock
  flock(dhcpcd_lock, "ex", (err) => {
    if (err) return console.error("Could not lock dhcpcd_lock file.");
    // fisierul este blocat
    console.log("dhcpcd_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/dhcpcd_conf.txt"),
      write_to_dhcpcd,
      (error) => {
        if (error) return console.error(error);
        console.log("dhcpcd_conf.txt was saved");
        // deblocam fisierul lock
        flock(dhcpcd_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("dhcpcd_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(dhcpcd_lock);
        });
      }
    );
  });

  // deschidem fisierul lock
  const wpa_lock = fs.openSync(wpa_lock_path, "w+");
  // blocam fisierul lock
  flock(wpa_lock, "ex", (err) => {
    if (err) return console.error("Could not lock wpa_lock file.");
    // fisierul este blocat
    console.log("wpa_lock is locked.");
    // folosim fs.writeFile() pentru a deschide, scrie si inchide fisierul text
    fs.writeFile(
      path.join(configFilesLocation, "/wpa_conf.txt"),
      write_to_wpa,
      (error) => {
        if (error) return console.error(error);
        console.log("wpa_conf.txt was saved");
        // deblocam fisierul lock
        flock(wpa_lock, "un", (error) => {
          if (error) return console.error(error);
          // fisier deblocat
          console.log("wpa_lock is unlocked.");
          // inchidem fisierul lock
          fs.closeSync(wpa_lock);
        });
      }
    );
  });

  res.sendStatus(200);
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

app.post("/readFileContent", (req, res) => {
  let fileContent = "";
  let fileName = req.body.fileName;
  fs.readFile(
    path.join(configFilesLocation, fileName),
    "utf8",
    (error, data) => {
      if (error) throw error;
      console.log("File name:", fileName);
      fileContent = data;
      console.log("Old Content:");
      console.log(fileContent);
      res.status(200).send(fileContent);
    }
  );
});

app.post("/updateFile", (req, res) => {
  // check if request body is empty
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.sendStatus(500);
  }
  let newFileContent = req.body.content;
  let fileName = req.body.fileName;
  console.log("Server file name: " + fileName);
  console.log("newFileContent: ");
  console.log(newFileContent);
  fs.writeFile(
    path.join(configFilesLocation, fileName),
    newFileContent,
    (error) => {
      if (error) return console.error(error);
      console.log("The file was saved");
      res.sendStatus(200);
    }
  );
});

app.post("/deleteFile", (req, res) => {
  const fileName = req.body.fileName;
  console.log(fileName);
  fs.unlink(path.join(configFilesLocation, fileName), (error) => {
    if (error) {
      console.error(error);
      return;
    }
    res.sendStatus(200);
  });
});

app.post("/changeSettings", (req, res) => {
  // check if request body is empty
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.sendStatus(500);
  }
  let newSettings = req.body;
  console.log(newSettings);

  fs.writeFile(
    path.join(configFilesLocation, "/configuration.txt"),
    newSettings,
    (error) => {
      if (error) return console.error(error);
      console.log("The file was saved");
      res.sendStatus(200);
    }
  );
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

const http_port = 8080;
const http_server = http.createServer(app);

http_server.listen(http_port);

http_server.on("error", onError);
http_server.on("listening", onListening);

console.log(`Server started on http://localhost:${http_port}`);
