<template>
  <section>
    <div class="top_container update_container">
      <div class="mid_container">
        <div class="title">
          <h1>
            Setup -
            <span class="setting">Update</span> Firmware
          </h1>
        </div>
        <div class="update_text_container">
          Please upload the provided
          <span style="color:#ea5a64">Metrici_MP_Display.zip</span> archive and then
          <span style="color:#ea5a64">Metrici_MP_Display</span> file.
          <br />
          <br />Notes:
          <br />(1): First upload
          <span style="color:#ea5a64">Metrici_MP_Display.zip</span> and then
          <span style="color:#ea5a64">Metrici_MP_Display</span>.
          <br />(2): Not uploading the files in the above mentioned order will stop the display from working correctly.
          <br />(3): Your settings are safe. Updating the device won't change the configuration.
          <br />(4): You will be asked for a code
          <span style="color:#96ede5">only</span> when uploading
          <span style="color:#ea5a64">Metrici_MP_Display.zip</span>.
          <br />(5): The code will be provided by Metrici alongside
          <span style="color:#ea5a64">Metrici_MP_Display.zip</span>.
          <br />(6): After pressing the
          <span style="color:#96ede5">Update</span> button you will be prompted with a success or failure message.
        </div>
        <form method="POST" enctype="multipart/form-data">
          <div>
            <label class="button file_input_label" id="special_label" for="files">Select files</label>
            <input type="file" id="files" name="uploaded_file" />
            <input class="button upload_button" type="submit" name="update_button" value="Update" />
          </div>
          <div id="input_code">
            <div class="input_row">
              <input
                type="text"
                class="input_text"
                id="file_code"
                placeholder="Type here the provided code"
                name="file_code"
                value
                minlength="32"
                title="Enter the provided code"
              />
              <label class="label_" for="file_code">Enter provided code</label>
            </div>
          </div>
        </form>
      </div>
    </div>
    <ShellExec></ShellExec>
  </section>
</template>

<script>
import ShellExec from "../components/ShellExec";

export default {
  name: 'FileManager',
  components: {
    ShellExec
  }

}
</script>

<style scoped>
/* Update Page - START */
.update_container {
  height: auto;
}

.update_text_container {
  padding: 0.65em;
  letter-spacing: 0.5px;
  line-height: 1.4em;
}

.update_container form {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.update_container form div {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
}

.file_input_label {
  display: block;
}

#files {
  display: none;
}
.upload_button {
  background-color: #237988;
}

.upload_button:hover,
.upload_button:focus {
  background-color: #33afc5;
  outline: 0;
}

#input_code {
  display: none;
}

#input_code .label_ {
  left: 0;
}

/* Update Page - END */
</style>