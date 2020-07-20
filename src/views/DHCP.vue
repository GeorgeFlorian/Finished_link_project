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
          <form action="javascript:void(0);" @submit="sendData" novalidate="true">
            <div class="input_radio">
              <span>Please select the type of connection:</span>
              <br />
              <br />
              <input id="wifi" type="radio" name="connectionType" value="WiFi" />
              <label for="wifi" @click="visible = true">WiFi</label>
              <input id="eth" type="radio" name="connectionType" value="Ethernet" />
              <label for="eth" @click="visible = false">Ethernet</label>
            </div>
            <div id="dhcpFields" v-if="visible">
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here the Network Name (SSID)"
                  id="networkName"
                  name="networkName"
                  pattern=".{5,30}"
                  title="Enter between 5 and 30 characters"
                  required
                  v-model="ssid"
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
                  minlength="8"
                  pattern=".{8,63}"
                  title="Enter between 8 and 63 characters"
                  required
                  v-model="password"
                />
                <label class="label_" for="networkPassword">Password</label>
              </div>
            </div>
            <input class="button" type="submit" name="saveDHCP" value="Save Values" />
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

const serverURL = location.origin;
const server = axios.create({ baseURL: serverURL });

export default {
  name: "DHCP",
  data() {
    return {
      visible: false,
      ssid: "",
      password: ""
    };
  },
  methods: {
    sendData: function() {
      if(!this.visible) {
        // nothing
      }
      if (this.ssid === "" || this.password === "") return;
      let currentUrl = window.location.pathname;
      console.log("currentUrl:");
      console.log(currentUrl);
      server
        .post(currentUrl, { ssid: this.ssid, password: this.password })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
/* DHCP and Static IP Pages - START */

.mid_container .inner_container form {
  justify-content: flex-start;
}

.setting {
  color: #96ede5;
}

#dhcpFields {
  width: 100%;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.input_radio {
  margin-top: 20px;
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

.input_row .wrong {
  color: #e11422;
  font-weight: 700;
}
.input_row .correct {
  color: #14e16d;
  font-weight: 700;
}
/* DHCP and Static IP Pages - END */
</style>
