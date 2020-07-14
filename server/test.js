const { exec } = require("child_process");


async function shell(command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async function shellExec(command) {
    let { stdout } = await shell(command);
    for (let line of stdout.split("\n")) {
      console.log(`ls: ${line}`);
    }
  }

  shellExec();