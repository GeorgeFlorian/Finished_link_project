<template>
  <div id="wrapper">
    <button type="button" class="button" @click="restartDevice">Restart Device</button>
    <div class="message" v-if="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from "axios";

const serverURL = location.origin;
const server = axios.create({ baseURL: serverURL });

export default {
  name: "ShellExec",
  data() {
    return {
      message: '',
    };
  },
  methods: {
    restartDevice() {
      this.message = '';
      // echo user_sudo_password ne permite sa trimitem parola de sudo a utilizatorul
      // binteinteles ca aceasta metoda nu se recomanda in versiunile de productie
      // aici o folosim doar pentru a demonstra capabilitatea de a rula comenzi shell folosind Vue si Express
        server.post("/restart", { command: "echo user_sudo_password | sudo -S reboot"})
        .then(res => {
          console.log("Request Status ", res.status);
          this.message = res.data;
        })
        .catch(error => {
          this.message = '';
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
#wrapper {
  width: auto;
  height: auto;
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

.message {
  text-align: center;
  padding: 0.5em;
  margin: 0.5em;
  color: #14e16d;
}
</style>
