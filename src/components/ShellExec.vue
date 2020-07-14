<template>
  <div id="wrapper">
    <!-- <div class="input_row">
      <input type="text" class="input_text" id="shell" v-model="shell_command" />
      <label class="label_" for="shell">Type Shell Command</label>
    </div>-->
    <button type="button" class="button" @click="restartDevice">Restart Device</button>
  </div>
</template>

<script>
import axios from "axios";

const serverURL = location.origin;
const server = axios.create({ baseURL: serverURL });

export default {
  name: "ShellExec",
  components: {},
  data() {
    return {};
  },
  methods: {
    restartDevice: function() {
      server
        .post("/home", { command: "ls -l"})
        // server.post("/home", "sudo reboot")
        .then(res => {
          console.log("res.data: ");
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
#wrapper {
  width: 500px;
  height: 150px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}

.button {
  display: inline-block;
}
</style>
