<template>
  <section>
    <div class="top_container">
      <div class="mid_container">
        <div class="title">
          <h1>
            Setup - Change
            <span>DHCP IP</span> Settings
          </h1>
        </div>
        <div class="inner_container">
          <div class="input_radio">
            <span>Please select the type of connection:</span>
            <br />
            <br />
            <input id="wifi" type="radio" name="connectionType" value="WiFi" />
            <label for="wifi" @click="wifi = true; ethernet = false; reset()">WiFi</label>
            <input id="eth" type="radio" name="connectionType" value="Ethernet" />
            <label for="eth" @click="wifi = false; ethernet = true; reset()">Ethernet</label>
          </div>
          <div class="inputs-wrapper" v-if="wifi">
            <div class="input_row">
              <input
                type="text"
                class="input_text"
                placeholder="Type here the Network Name (SSID)"
                id="networkName"
                name="networkName"
                title="Enter between 5 and 30 characters"
                required
                v-model.lazy="ssid"
                @change="isSsidGood"
              />
              <label class="label_" for="networkName">Network Name (SSID)</label>
            </div>
            <div class="input_row">
              <input
                type="password"
                class="input_text"
                placeholder="Type here here Password"
                id="networkPassword"
                name="networkPassword"
                title="Enter between 8 and 63 characters"
                required
                v-model.lazy="password"
                @change="isPasswordGood"
              />
              <label class="label_" for="networkPassword">Password</label>
            </div>
          </div>
          <button class="button" v-if="wifi" @click.prevent="sendWifi">Save Values</button>
          <button class="button" v-if="ethernet" @click.prevent="sendEthernet">Save Values</button>
        </div>
        <div class="correct" v-if="message">{{message}}</div>

        <div class="errors" v-if="errorsSsid.length > 0">
          <div v-for="error in errorsSsid" :key="error.id">{{error}}</div>
        </div>
        <div class="errors" v-if="errorsPassword.length > 0">
          <div v-for="error in errorsPassword" :key="error.id">{{error}}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

const serverURL = location.origin;
const server = axios.create({ baseURL: serverURL, timeout: 5000 });

export default {
  name: "DHCP",
  data() {
    return {
      wifi: false,
      ethernet: false,
      ssid: "",
      password: "",
      message: "",
      errorsSsid: [],
      errorsPassword: [],
    };
  },
  methods: {
    reset() {
      this.message = "";
      this.errorsSsid = [];
      this.errorsPassword = [];
    },
    isSsidGood(event) {
      let ssid = event.target.value;
      this.errorsSsid = [];
      if (ssid === "") {
        let err = "Network Name (SSID) is empty !";
        if (!this.errorsSsid.includes(err)) this.errorsSsid.push(err);
      } else if (ssid.length < 5) {
        let err = "Network Name (SSID) is too short: minimum 5 characaters !";
        if (!this.errorsSsid.includes(err)) this.errorsSsid.push(err);
      } else if (ssid.length > 30) {
        let err = "Network Name (SSID) is too long: maximum 30 characaters !";
        if (!this.errorsSsid.includes(err)) this.errorsSsid.push(err);
      } else {
        this.errorsSsid = [];
      }
    },
    isPasswordGood(event) {
      let password = event.target.value;
      this.errorsPassword = [];
      if (password === "") {
        let err = "Network Password is empty !";
        if (!this.errorsPassword.includes(err)) this.errorsPassword.push(err);
      } else if (password.length < 8) {
        let err = "Network Password is too short: minimum 8 characaters !";
        if (!this.errorsPassword.includes(err)) this.errorsPassword.push(err);
      } else if (password.length > 63) {
        let err = "Network Password is too long: maximum 63 characaters !";
        if (!this.errorsPassword.includes(err)) this.errorsPassword.push(err);
      } else {
        this.errorsPassword = [];
      }
    },
    checkSubmit() {
      let ssid = this.ssid;
      let password = this.password;

      if (ssid === "") {
        let err = "Network Name (SSID) is empty !";
        if (!this.errorsSsid.includes(err)) this.errorsSsid.push(err);
      } else if (ssid.length < 5) {
        let err = "Network Name (SSID) is too short: minimum 5 characaters !";
        if (!this.errorsSsid.includes(err)) this.errorsSsid.push(err);
      } else if (ssid.length > 30) {
        let err = "Network Name (SSID) is too long: maximum 30 characaters !";
        if (!this.errorsSsid.includes(err)) this.errorsSsid.push(err);
      } else {
        this.errorsSsid = [];
      }

      if (password === "") {
        let err = "Network Password is empty !";
        if (!this.errorsPassword.includes(err)) this.errorsPassword.push(err);
      } else if (password.length < 8) {
        let err = "Network Password is too short: minimum 8 characaters !";
        if (!this.errorsPassword.includes(err)) this.errorsPassword.push(err);
      } else if (password.length > 63) {
        let err = "Network Password is too long: maximum 63 characaters !";
        if (!this.errorsPassword.includes(err)) this.errorsPassword.push(err);
      } else {
        this.errorsPassword = [];
      }

      if (!this.errorsSsid.length && !this.errorsPassword.length) {
        return true;
      } else {
        return false;
      }
    },
    sendWifi() {
      if (this.checkSubmit()) {
        server
          .post(
            "/dhcpWifi",
            {
              type: "WiFi",
              ssid: this.ssid,
              password: this.password,
            },
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              this.message = "DHCP WiFi settings have been saved.";
              this.errors = [];
              this.ssid = "";
              this.password = "";
              this.wifi = false;
              this.ethernet = false;
            } else {
              this.errors.push("Something went wrong. Please try again");
              this.message = "";
            }
          })
          .catch((error) => {
            this.message = "";
            console.log(error);
          });
      }
    },
    sendEthernet() {
      server
        .post(
          "/dhcpEth",
          { type: "Ethernet" },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.message = "DHCP Ethernet settings have been saved.";
            this.errors = [];
            this.ssid = "";
            this.password = "";
            this.wifi = false;
            this.ethernet = false;
          } else {
            this.errors.push("Something went wrong. Please try again");
            this.message = "";
          }
        })
        .catch((error) => {
          this.message = "";
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.top_container {
  height: auto;
}

.mid_container .inner_container {
  justify-content: center;
  align-items: center;
}

.inputs-wrapper {
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.input_radio {
  margin: 20px 0;
  color: white;
  text-align: center;
}

.input_radio input {
  display: none;
}

.input_radio span {
  font-size: 20px;
  color: white;
}
.input_radio label {
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  line-height: 45px;
  height: 45px;
  width: 150px;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.input_radio label:first-of-type {
  margin-right: 5px;
}

.input_radio label:hover,
.input_radio input[type="radio"]:checked + label {
  color: red;
  background-color: rgba(0, 0, 0, 0.5);
}

.correct,
.errors {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #14e16d;
  padding: 0.5em;
}

.errors {
  color: #e11422;
}
</style>
