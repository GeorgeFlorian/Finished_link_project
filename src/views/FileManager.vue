<template>
  <section>
    <div class="top_container">
      <div class="mid_container">
        <div class="title">
          <h1>
            File
            <span class="setting">Manager</span>
          </h1>
        </div>
        <form @submit.prevent="sendFile" method="POST" enctype="multipart/form-data">
          <div v-if="message">
            <div>{{message}}</div>
          </div>
          <label for="file" class="choose-file-container">
            <span>Choose a File</span>
            <input
              multiple
              type="file"
              @change="selectFile()"
              ref="files_ref"
              class="file-input"
              id="file"
            />
          </label>
          
          <div class="file-manager">
            <div
              :class="`file-line ${file.status ? 'wrong-file' : ''}`"
              v-for="(file, index) in files"
              :key="index"
            >
              <!-- left side  -->
              <div class="left-side">
                {{file.name}}
                <span v-if="file.status">&nbsp;- {{file.status}}</span>
              </div>
              <!-- right side -->
              <div
                class="right-side"
                @click.prevent="files.splice(index, 1); uploadFiles.splice(index, 1)"
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </div>
            </div>
          </div>

          <div class="drop-zone">
            <span>Drag and drop files here</span>
          </div>

          <button class="button">Send</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "FileManager",
  data() {
    return {
      files: [],
      uploadFiles: [],
      message: "",
      error: false,
    };
  },
  methods: {
    // select and validate files
    selectFile() {
      const files = this.$refs.files_ref.files;
      this.uploadFiles = [...this.uploadFiles, ...files];

      // making an array of file objects
      // used for rendering on client side
      this.files = [
        ...this.files,
        ..._.map(files, (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          status: this.validate(file),
        })),
      ];
    },
    validate(file) {
      const MAX_SIZE = 1000;
      const allowedTypes = ["text/plain"];

      if (!allowedTypes.includes(file.type)) {
        return "Only text files are allowed";
      }
      
      if (file.size > MAX_SIZE) {
        return `File too large. Max size is ${MAX_SIZE / 1000}kb`;
      }

      return ""; // empty string = false
    },
    async sendFile() {
      const formData = new FormData();
      // lodash forEach
      _.forEach(this.uploadFiles, file => {
        if(this.validate(file) === "") {
          formData.append('files', file);
        }
      });

      try {
        await axios.post("/files", formData);
        this.message = "Files has been uploaded";
        this.files = [];
        this.uploadFiles = [];
      } catch(err) {
        this.message = err.response.data.error;
        this.error = true;
      }
    },
  },
};
</script>

<style scoped>
/* Update Page - START */
.top_container {
  height: auto;
}

form {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.choose-file-container {
  margin: 1em;
}

.choose-file-container span {
  padding: 0.5em;
  display: block;
  background-color: #16c8b1;
  color: black;
  transition: all 0.25s ease-in-out;
}

.choose-file-container span:hover {
  background-color: #0e8374;
  cursor: pointer;
}

.file-input {
  display: none;
}

.file-manager {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #0e8374;
  color: black;
  font-weight: bold;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.file-line {
  height: auto;
  width: 90%;
  background: #16c8b1;
  margin: 0.5em;
  padding: 0.2em 1em;
  display: flex;
  justify-content: space-between;
  /* transition: all 0.25s ease-in-out; */
}

.file-line:hover {
  filter: brightness(80%);
  cursor: pointer;
}

.wrong-file {
  background: lightcoral;
}

.drop-zone {
  width: 50%;
  margin-top: 20px;
  height: 200px;
  background: #0e8374;
  text-align: center;
  line-height: 200px;
  transition: all 0.25s ease-in-out;
}

.drop-zone:hover {
  background: #16c8b1;
}

/* Update Page - END */
</style>
