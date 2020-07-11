const { exec } = require("child_process");


async function shell() {
    return new Promise((resolve, reject) => {
      exec("ls -la", (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async function shellExec() {
    let { stdout } = await shell();
    for (let line of stdout.split("\n")) {
      console.log(`ls: ${line}`);
    }
  }

  shellExec();