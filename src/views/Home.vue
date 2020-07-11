<template>
  <section>
      <div class="top_container">
          <div class="left_container">
              <div class="title">
                  <h1>Current Settings</h1>
              </div>
              <div class="inner_container">
                  <p>URL: <span></span>
                  </p>
                  <p>URL Refresh Interval: <span></span>(s)
                  </p>
                  <p>Brightness: <span></span>(&#37;)</p>
              </div>
          </div>
          <div class="right_container">
              <div class="title">
                  <h1>Change Settings</h1>
              </div>
              <div class="inner_container">
                  <form method="post" action="">
                      <div class="input_row">
                          <input class="input_text" id="getURL" type="url" inputmode="url" placeholder="Enter URL"
                              name="getURL" value="" title="URL" />
                          <label class="label_" for="getURL">URL Link</label>
                      </div>
                      <div class="input_row">
                          <input class="input_text" id="getURR" inputmode="numeric"
                              title="Enter a number of seconds between 1 and 99" type="text" pattern="([0-9]{1,2})"
                              oninvalid="this.setCustomValidity('Please enter a number between 1 and 99')"
                              onchange="try{setCustomValidity('')}catch(e){}" oninput="setCustomValidity(' ')"
                              maxlength="2" placeholder="Enter URL Refresh Interval in seconds" name="getURR"
                              value="">
                          <label class="label_" for="getURR">URL Refresh Interval (s)</label>
                      </div>
                      <div class="input_row">
                          <input class="input_text" id="getBrightness" inputmode="numeric" type="text" maxlength="2"
                              pattern="([0-9]{1,2})"
                              oninvalid="this.setCustomValidity('Please enter a number between 2 and 99')"
                              onchange="try{setCustomValidity('')}catch(e){}" oninput="setCustomValidity(' ')"
                              placeholder="Enter brightness (2-99)" name="getBrightness" value=""
                              title="Enter a Brightness value between 2 and 99">
                          <label class="label_" for="getBrightness">Brightness (&#37;)</label>
                      </div>
                      <input class="button" type="submit" name="save_values" value="Save All Values" />
                  </form>
              </div>
          </div>
      </div>
      <div class="bottom_container">
          <div class="title">
              <h1>Logs</h1>
          </div>
          <div class="log_container">
          </div>
      </div>
  </section>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
  
</style>
