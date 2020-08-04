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
            <label for="wifi" @click="wifi = true; ethernet = false; correct=''; wrong=''">WiFi</label>
            <input id="eth" type="radio" name="connectionType" value="Ethernet" />
            <label for="eth" @click="wifi = false; ethernet = true; correct=''; wrong=''">Ethernet</label>
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
              />
              <label class="label_" for="networkPassword">Password</label>
            </div>
          </div>
          <button class="button" v-if="wifi" @click.prevent="sendWifi">Save WiFi</button>
          <button class="button" v-if="ethernet" @click.prevent="sendEthernet">Save Ethernet</button>
        </div>
        <div class="correct" v-if="correct">{{correct}}</div>
        <div class="wrong" v-if="wrong">{{wrong}}</div>
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
      correct: "",
      wrong: "",
    };
  },
  methods: {
    isSsidGood(ssid) {
      this.wrong = "";
      if (ssid === "") {
        this.wrong = "Network Name (SSID) is empty !";
        return false;
      }
      if (ssid < 5) {
        this.wrong =
          "Network Name (SSID) is too short: minimum 5 characaters !";
        return false;
      }
      if (ssid > 30) {
        this.wrong =
          "Network Name (SSID) is too long: maximum 30 characaters !";
        return false;
      }
      return true;
    },
    isPasswordGood(password) {
      this.wrong = "";
      if (password === "") {
        this.wrong = "Network Password is empty !";
        return false;
      }
      if (password < 8) {
        this.wrong = "Network Password is too short: minimum 8 characaters !";
        return false;
      }
      if (password > 63) {
        this.wrong = "Network Password is too long: maximum 63 characaters !";
        return false;
      }
      return true;
    },
    sendWifi() {
      if (this.isSsidGood(this.ssid) && this.isPasswordGood(this.password)) {
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
              this.correct = "Settings have been saved.";
              this.wrong = "";
              this.ssid = "";
              this.password = "";
            } else {
              this.wrong = "Something went wrong. Please try again";
              this.correct = "";
            }
          })
          .catch((error) => {
            this.wrong = "";
            this.correct = "";
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
            this.correct = "Settings have been saved.";
            this.wrong = "";
            this.ssid = "";
            this.password = "";
          } else {
            this.wrong = "Something went wrong. Please try again";
            this.correct = "";
          }
        })
        .catch((error) => {
          this.wrong = "";
          this.correct = "";
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
.wrong {
  text-align: center;
  padding: 0.5em;
  margin: 0.5em;
  font-weight: bold;
  font-size: 1.2em;
}

.wrong {
  color: #e11422;
}
.correct {
  color: #14e16d;
}
</style>
