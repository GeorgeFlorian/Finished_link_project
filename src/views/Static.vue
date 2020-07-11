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
            @submit="ValidateIPaddressOnSubmit"
            novalidate="true"
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
                  id="ipAddress"
                  name="ipAddress"
                  required
                  v-model.lazy="ipAddress"
                />
                <label class="label_" for="ipAddress">IP Address</label>
              </div>
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here Gateway"
                  id="gateway"
                  name="gateway"
                  required
                  v-model.lazy="gateway"
                />
                <label class="label_" for="gateway">Gateway</label>
              </div>
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here Subnet Mask"
                  id="subnet"
                  name="subnet"
                  required
                  v-model.lazy="subnet"
                />
                <label class="label_" for="subnet">Subnet Mask</label>
              </div>
              <div class="input_row">
                <input
                  type="text"
                  class="input_text"
                  placeholder="Type here DNS"
                  id="dns"
                  name="dns"
                  required
                  v-model.lazy="dns"
                />
                <label class="label_" for="dns">DNS</label>
              </div>
            </div>
            <input class="button" type="submit" name="saveStatic" value="Save Values" />
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Static",
  data() {
    return {
      wifi: false,
      ethernet: false,
      ipAddress: "",
      gateway: "",
      subnet: "",
      dns: ""
    };
  },
  watch: {
    ipAddress(value) {
      this.ipAddress = value;
      this.ValidateIPaddressOnChange(value, "ipAddress");
    },
    gateway(value) {
      this.gateway = value;
      this.ValidateIPaddressOnChange(value, "gateway");
    },
    subnet(value) {
      this.subnet = value;
      this.ValidateIPaddressOnChange(value, "subnet");
    },
    dns(value) {
      this.dns = value;
      this.ValidateIPaddressOnChange(value, "dns");
    }
  },
  methods: {
    ValidateIPaddressOnChange: function(value, inputName) {
      var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      var strtype = "";
      switch (inputName) {
        case "ipAddress":
          strtype = "IP Address";
          break;
        case "gateway":
          strtype = "Gateway";
          break;
        case "dns":
          strtype = "DNS";
          break;
        case "subnet":
          strtype = "Subnet Mask";
          break;
      }

      if (!value.match(ipformat)) {
        this.$el.querySelector(`#${inputName}`).classList.remove("correct");
        this.$el.querySelector(`#${inputName}`).classList.add("wrong");
        this.$el.querySelector(`#${inputName}`).focus();
        alert(strtype + " is invalid!");
      } else if (value != null) {
        this.$el.querySelector(`#${inputName}`).classList.remove("wrong");
        this.$el.querySelector(`#${inputName}`).classList.add("correct");
      }
    },
    ValidateIPaddressOnSubmit: function(e) {
      var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      var ipaddr = this.ipAddress;
      var gateway = this.gateway;
      var subnet = this.subnet;
      var dns = this.dns;
      var errors = [];

      if (ipaddr.match(ipformat)) {
        this.$el.querySelector(`#ipAddress`).focus();
      } else {
        errors.push("You have entered an invalid IP Address!");
        alert("You have entered an invalid IP Address!");
        this.$el.querySelector(`#ipAddress`).focus();
      }

      if (gateway.match(ipformat)) {
        this.$el.querySelector(`#gateway`).focus();
      } else {
        errors.push("You have entered an invalid GATEWAY Address!");
        window.alert("You have entered an invalid GATEWAY Address!");
        this.$el.querySelector(`#gateway`).focus();
      }

      if (subnet.match(ipformat)) {
        this.$el.querySelector(`#subnet`).focus();
      } else {
        errors.push("You have entered an invalid SUBNET Address!");
        window.alert("You have entered an invalid SUBNET Address!");
        this.$el.querySelector(`#subnet`).focus();
      }

      if (dns.match(ipformat)) {
        this.$el.querySelector(`#dns`).focus();
      } else {
        errors.push("You have entered an invalid DNS Address!");
        window.alert("You have entered an invalid DNS Address!");
        this.$el.querySelector(`#dns`).focus();
      }
      
      if (!errors.length) {
        return true;
      }

      e.preventDefault();
    }
  },
  computed: {}
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
/* DHCP and Static IP Pages - END */
</style>