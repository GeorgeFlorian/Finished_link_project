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
          <div class="input_row">
            <input
              class="input_text"
              id="getURL"
              type="url"
              inputmode="url"
              placeholder="Enter URL"
              title="URL"
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
              @input="changeBrightness"
            />
            <label class="label_" for="getBrightness">Brightness (&#37;)</label>
          </div>
          <!-- <input class="button" type="submit" value="Save All Values" @click="saveSettings"/> -->
          <button class="button" @click="saveSettings">Save all Values</button>
        </div>
      </div>
    </div>
    <div class="bottom_container">
      <div class="title">
        <h1>Logs</h1>
      </div>
      <div class="log_container"></div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "Home",
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
    };
  },
  mounted() {
    this.getDisplaySettings();
  },
  methods: {
    getDisplaySettings() {
      axios
        .get("/getDisplaySettings")
        .then((res) => {
          this.oldSettings.url = res.data.line0;
          this.oldSettings.urr = res.data.line1;
          this.oldSettings.brightness = res.data.line2;
          console.log(this.oldSettings);
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
      axios
        .post("/changeSettings", this.newSettings)
        .then((res) => {
          console.log("Save settings:", res.status);
          // this.getDisplaySettings();
          // Settings were saved
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
  padding: 1em;
}

.right_container .inner_container {
  align-items: center;
}
</style>
