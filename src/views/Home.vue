<template>
  <section>
    <div class="top_container">
      <div class="left_container">
        <div class="title">
          <h1>Current Settings</h1>
        </div>
        <div class="inner_container">
          <p>
            Current IP:
            <span>{{ip}}</span>
          </p>
          <p>
            URL:
            <span>{{oldSettings.url}}</span>
          </p>
          <p>
            URL Refresh Interval:
            <span>{{oldSettings.urr}}</span>(s)
          </p>
          <p>
            Brightness:
            <span>{{oldSettings.brightness}}</span>(&#37;)
          </p>
        </div>
      </div>
      <div class="right_container">
        <div class="title">
          <h1>Change Settings</h1>
        </div>
        <div class="inner_container">
          <form method="post" @submit.prevent="saveSettings">
            <div class="input_row">
              <input
                class="input_text"
                id="getURL"
                type="url"
                inputmode="url"
                placeholder="Enter URL"
                title="URL"
                v-model.lazy="newSettings.url"
                @input="changeUrl"
              />
              <label class="label_" for="getURL">URL Link</label>
            </div>
            <div class="input_row">
              <input
                class="input_text"
                id="getURR"
                inputmode="numeric"
                title="Enter a number of seconds between 1 and 99"
                type="text"
                pattern="([0-9]{1,2})"
                oninvalid="this.setCustomValidity('Please enter a number between 1 and 99')"
                onchange="try{setCustomValidity('')}catch(e){}"
                oninput="setCustomValidity(' ')"
                maxlength="2"
                placeholder="Enter URL Refresh Interval in seconds"
                v-model.lazy="newSettings.urr"
                @input="changeUrr"
              />
              <label class="label_" for="getURR">URL Refresh Interval (s)</label>
            </div>
            <div class="input_row">
              <input
                class="input_text"
                id="getBrightness"
                inputmode="numeric"
                type="text"
                maxlength="2"
                pattern="([0-9]{1,2})"
                oninvalid="this.setCustomValidity('Please enter a number between 2 and 99')"
                onchange="try{setCustomValidity('')}catch(e){}"
                oninput="setCustomValidity(' ')"
                placeholder="Enter brightness (2-99)"
                title="Enter a Brightness value between 2 and 99"
                v-model.lazy="newSettings.brightness"
                @input="changeBrightness"
              />
              <label class="label_" for="getBrightness">Brightness (&#37;)</label>
            </div>
            <button type="submit" class="button">Save all Values</button>
          </form>
          <div class="correct" v-if="message">{{ message }}</div>
          <div class="wrong" v-if="wrong">{{ wrong }}</div>
        </div>
      </div>
    </div>
    <div class="bottom_container">
      <div class="title">
        <h1>Logs</h1>
      </div>
      <div class="log_container">
        <!-- <p v-for="log in logs" :key="log.name"> {{ log }} </p> -->
        <Logs></Logs>
      </div>
    </div>
    <ShellExec></ShellExec>
  </section>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import ShellExec from "@/components/ShellExec";
import Logs from "@/components/Logs";
import { mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    ShellExec,
    Logs,
  },
  data() {
    return {
      oldSettings: {
        url: "",
        urr: "",
        brightness: "",
      },
      newSettings: {
        url: "",
        urr: "",
        brightness: "",
      },
      ip: location.host,
      wrong: "",
      message: "",
    };
  },
  mounted() {
    this.getDisplaySettings();
  },
  methods: {
    ...mapActions(["addLog"]),
    getTime() {
      const today = new Date();
      let HH = today.getHours();
      HH = ("0" + HH).slice(-2);
      let MM = today.getMinutes();
      MM = ("0" + MM).slice(-2);
      let SS = today.getSeconds();
      SS = ("0" + SS).slice(-2);
      const time = `${HH}:${MM}:${SS}`;
      return time;
    },
    getDisplaySettings() {
      axios
        .get("/getDisplaySettings")
        .then((res) => {
          this.oldSettings.url = res.data.line0;
          this.oldSettings.urr = res.data.line1;
          this.oldSettings.brightness = res.data.line2;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    changeUrl: _.debounce(function (e) {
      this.newSettings.url = e.target.value;
    }, 500),
    changeUrr: _.debounce(function (e) {
      this.newSettings.urr = e.target.value;
    }, 500),
    changeBrightness: _.debounce(function (e) {
      this.newSettings.brightness = e.target.value;
    }, 500),
    saveSettings() {
      var counter = 3;
      if (this.newSettings.url === "") {
        this.newSettings.url = this.oldSettings.url;
        counter--;
      } else {
        this.addLog(`${this.getTime()} - New URL: ${this.newSettings.url}`);
      }
      if (this.newSettings.urr === "") {
        this.newSettings.urr = this.oldSettings.urr;
        counter--;
      } else {
        this.addLog(
          `${this.getTime()} - New Refresh Interval: ${this.newSettings.urr}`
        );
      }
      if (this.newSettings.brightness === "") {
        this.newSettings.brightness = this.oldSettings.brightness;
        counter--;
      } else {
        this.addLog(
          `${this.getTime()} - New Brightness: ${this.newSettings.brightness}`
        );
      }

      if (counter == 0) {
        this.wrong = "Inputs are empty";
        this.message = "";
        this.newSettings.url = "";
        this.newSettings.urr = "";
        this.newSettings.brightness = "";
        return;
      }

      axios
        .post("/changeSettings", this.newSettings)
        .then((res) => {
          // resetam valorile din input
          this.newSettings.url = "";
          this.newSettings.urr = "";
          this.newSettings.brightness = "";
          
          if (counter == 1) {
            this.message = "Value was saved.";
            this.wrong = "";
          } else {
            this.message = "Values were saved.";
            this.wrong = "";
          }
          console.log("Save settings:", res.status);
          this.addLog(`${this.getTime()} - Save Settings status: ${res.status}`);
          this.addLog(`${this.getTime()} - The new settings have been saved.`);

          // updatam valorile din interfata
          this.getDisplaySettings();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.left_container p {
  padding: 1.3em 0.4em;
}

.left_container .inner_container {
  justify-content: flex-start;
}

.right_container .inner_container {
  align-items: center;
}

form {
  width: 100%;
  justify-content: flex-start;
}

.correct,
.wrong {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #14e16d;
  padding: 0.5em;
  margin: 0.5em;
}

.wrong {
  color: #e11422;
}

.log_container {
  padding: 0.5em;
}
</style>
