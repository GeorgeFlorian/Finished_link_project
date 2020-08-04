<template>
  <section>
    <div class="top_container">
      <div class="mid_container">
        <div class="title">
          <h1>
            Setup - Change
            <span>Static IP</span> Settings
          </h1>
        </div>
        <div class="inner_container">
          <form
            method="POST"
            name="simple_form"
            @submit.prevent="`${wifi ? sendWifi() : sendEthernet()}`"
          >
            <div class="input_radio">
              <span>Please select the type of connection:</span>
              <br />
              <br />
              <input id="wifi" type="radio" name="connectionType" value="WiFi" />
              <label for="wifi" @click="wifi= true; ethernet= true">WiFi</label>
              <input id="eth" type="radio" name="connectionType" value="Ethernet" />
              <label for="eth" @click="wifi= false; ethernet= true">Ethernet</label>
            </div>
            <div id="wifiFields" v-if="wifi">
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
                  v-model.lazy="ssid"
                />
                <label class="label_" for="networkName">Network Name (SSID)</label>
              </div>
              <div class="input_row">
                <input
                  type="password"
                  class="input_text"
                  placeholder="Type here the Password"
                  id="networkPassword"
                  name="networkPassword"
                  minlength="8"
                  pattern=".{8,63}"
                  title="Enter between 8 and 63 characters"
                  required
                  v-model.lazy="password"
                />
                <label class="label_" for="networkPassword">Password</label>
              </div>
            </div>
            <div id="ethernetFields" v-if="ethernet">
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here IP Address"
                  id="IP"
                  name="IP"
                  required
                  v-model="ipAddress"
                  @change="validIP"
                />
                <label class="label_" for="IP">IP Address</label>
              </div>
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here Gateway"
                  id="Gateway"
                  name="Gateway"
                  required
                  v-model.lazy="gateway"
                />
                <label class="label_" for="Gateway">Gateway</label>
              </div>
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here Subnet Mask"
                  id="SubnetMask"
                  name="SubnetMask"
                  required
                  v-model.lazy="subnet"
                />
                <label class="label_" for="SubnetMask">Subnet Mask</label>
              </div>
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here DNS"
                  id="DNS"
                  name="DNS"
                  required
                  v-model.lazy="dns"
                />
                <label class="label_" for="DNS">DNS</label>
              </div>
            </div>
            <input class="button" type="submit" value="Save Values" />
          </form>
          <div class="message" v-if="message">{{ message }}</div>
          <div class="errors" v-if="errors.length > 0">
            <div v-for="error in errors" :key="error.id">{{error}}</div>
          </div>
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
  name: "Static",
  data() {
    return {
      wifi: false,
      ethernet: false,
      ssid: "",
      password: "",
      ipAddress: "",
      gateway: "",
      subnet: "",
      dns: "",
      message: "",
      dataSent: false,
      errors: [],
    };
  },
  watch: {
    //   ipAddress(value) {
    //     this.validateAdressOnChange(value, "IP");
    //   },
    gateway(value) {
      this.validateAdressOnChange(value, "Gateway");
    },
    subnet(value) {
      this.validateAdressOnChange(value, "SubnetMask");
    },
    dns(value) {
      this.validateAdressOnChange(value, "DNS");
    },
  },
  methods: {
    netmaskToCidr(netmask) {
      return netmask.split(".").reduce((c, o) => c - Math.log2(256 - +o), 32);
    },
    validIP(event) {
      var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      let value = event.target.value;
      let inputName = event.target.name;

      if (!value.match(ipformat)) {
        this.$el.querySelector(`#${inputName}`).classList.remove("correct");
        this.$el.querySelector(`#${inputName}`).classList.add("wrong");
        // this.$el.querySelector(`#${inputName}`).focus();
        let error = `You have entered an invalid ${inputName} Address!`;
        if (!this.errors.includes(error)) this.errors.push(error);
      } else if (value != null) {
        this.$el.querySelector(`#${inputName}`).classList.remove("wrong");
        this.$el.querySelector(`#${inputName}`).classList.add("correct");
        var index = this.errors.indexOf(
          `You have entered an invalid ${inputName} Address!`
        );
        if (index > -1) this.errors.splice(index, 1);
      }
    },
    validateAdressOnChange(value, inputName) {
      var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

      if (!value.match(ipformat)) {
        this.$el.querySelector(`#${inputName}`).classList.remove("correct");
        this.$el.querySelector(`#${inputName}`).classList.add("wrong");
        // this.$el.querySelector(`#${inputName}`).focus();
        let error = `You have entered an invalid ${inputName} Address!`;
        if (!this.errors.includes(error)) this.errors.push(error);
      } else if (value != null) {
        this.$el.querySelector(`#${inputName}`).classList.remove("wrong");
        this.$el.querySelector(`#${inputName}`).classList.add("correct");
        var index = this.errors.indexOf(
          `You have entered an invalid ${inputName} Address!`
        );
        if (index > -1) this.errors.splice(index, 1);
      }
    },
    checkSubmit() {
      var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      var ipaddr = this.ipAddress;
      var gateway = this.gateway;
      var subnet = this.subnet;
      var dns = this.dns;
      if (ipaddr.match(ipformat) == null) {
        let err = "You have entered an invalid IP Address!";
        console.log(err);
        if (!this.errors.includes(err)) this.errors.push(err);
      }
      if (gateway.match(ipformat) == null) {
        let err = "You have entered an invalid Gateway Address!";
        if (!this.errors.includes(err)) this.errors.push(err);
      }
      if (subnet.match(ipformat) == null) {
        let err = "You have entered an invalid SubnetMask Address!";
        if (!this.errors.includes(err)) this.errors.push(err);
      }
      if (dns.match(ipformat) == null) {
        let err = "You have entered an invalid DNS Address!";
        if (!this.errors.includes(err)) this.errors.push(err);
      }

      if (!this.errors.length) {
        return true;
      } else {
        return false;
      }
    },
    sendWifi() {
      if (this.checkSubmit()) {
        server
          .post(
            "/staticWifi",
            {
              ssid: this.ssid,
              password: this.password,
              ipAddress: this.ipAddress,
              gateway: this.gateway,
              subnet: this.netmaskToCidr(this.subnet),
              dns: this.dns,
            },
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              this.dataSent = true;
              this.errors = [];
              this.message = "Settings have been saved.";
              this.ssid = "";
              this.password = "";
              this.ipAddress = "";
              this.gateway = "";
              this.subnet = "";
              this.dns = "";
              this.dataSent = false;
            } else {
              this.errors.push("Something went wrong. Please try again");
              this.dataSent = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.message = "";
            this.dataSent = false;
          });
      }
    },
    sendEthernet() {
      if (this.checkSubmit()) {
        server
          .post(
            "/staticEthernet",
            {
              ipAddress: this.ipAddress,
              gateway: this.gateway,
              subnet: this.netmaskToCidr(this.subnet),
              dns: this.dns,
            },
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              this.dataSent = true;
              this.errors = [];
              this.message = "Settings have been saved.";
              this.ipAddress = "";
              this.gateway = "";
              this.subnet = "";
              this.dns = "";
              this.dataSent = false;
            } else {
              this.errors.push("Something went wrong. Please try again");
              this.dataSent = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.message = "";
            this.dataSent = false;
          });
      }
    },
  },
  computed: {},
};
</script>

<style scoped>
/* DHCP and Static IP Pages - START */
.top_container {
  height: auto;
}
.mid_container .inner_container form {
  justify-content: flex-start;
}
.setting {
  color: #96ede5;
}
#wifiFields {
  width: 100%;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
#ethernetFields {
  width: 100%;
  flex-direction: column;
  align-items: center;
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

.message,
.errors {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #14e16d;
  padding: 0.5em;
  margin: 0.5em;
}

.errors {
  color: #e11422;
}
</style>
