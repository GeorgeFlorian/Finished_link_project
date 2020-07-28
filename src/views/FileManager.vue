<template>
  <section>
    <div class="top_container">
      <div class="mid_container">
        <div class="title">
          <h1>
            File
            <span>Manager</span>
          </h1>
        </div>
        <form @submit.prevent="sendFiles" method="POST" enctype="multipart/form-data">
          <!-- TODO: File Manager Component -->
          <div class="file-manager-container">
            <div class="file-line header">
              <div class="file-name">File name:</div>
              <div class="file-size">Size:</div>
              <div class="action-buttons">Actions:</div>
            </div>
            <div
              :class="`file-line ${file.status ? 'wrong-file' : ''}`"
              v-for="(file, index) in currentFiles"
              :key="index"
            >
              <!-- left  -->
              <div class="file-name">
                {{ file.name }}
                <span v-if="file.status">&nbsp;- {{ file.status }}</span>
              </div>
              <!-- middle  -->
              <div class="file-size">
                {{ file.size }} kb
                <span v-if="file.status">&nbsp;- {{ file.status }}</span>
              </div>
              <!-- right -->
              <div class="action-buttons">
                <span>
                  <i class="far fa-edit"></i>
                </span>
                <span @click.prevent="currentFiles.splice(index, 1)">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <input multiple type="file" @change="selectFile()" ref="files_ref" class="input-field" />
          </div>
          <!-- <span v-if="uploading" class="progress-bar">
              <progress :value="progress" max="100">{{progress}}%</progress>
          </span>-->

          <div class="upload-message" v-if="message">
            <div>{{ message }}</div>
          </div>

          <!-- <button class="button">Send</button> -->
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
      currentFiles: [
        {
          name: "test1",
          size: 1.52,
          type: "text/plain",
          status: "",
        },
        {
          name: "test2",
          size: 1.33,
          type: "text/plain",
          status: "",
        },
        {
          name: "test3",
          size: 1,
          type: "text/plain",
          status: "",
        },
        {
          name: "test4",
          size: 0.85,
          type: "text/plain",
          status: "",
        },
      ],
      // currentFiles: [],
      uploadFiles: [],
      progress: 0,
      message: "",
      uploading: false,
      error: false,
    };
  },
  mounted() {
    // this.getFiles();
  },
  methods: {
    // get file list from Express server
    getFiles() {
      axios
        .get("/getFileList")
        .then((res) => {
          this.currentFiles = [];
          this.currentFiles = [...this.currentFiles, ...res.data];
          console.log(this.currentFiles);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // select files
    selectFile() {
      this.message = "";
      this.progress = 0;
      const selectedFiles = this.$refs.files_ref.files;
      // fill array with files that are going to be uploaded
      this.uploadFiles = [...this.uploadFiles, ...selectedFiles];
      // console.log(files);

      // make an array of file objects from selectedFiles
      // append to currentFiles array
      // used for rendering on client side
      this.currentFiles = [
        ...this.currentFiles,
        ..._.map(selectedFiles, (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          status: this.validate(file),
        })),
      ];
    },
    // validate files
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
    // send file object to server
    async sendFiles() {
      const formData = new FormData();
      var file_count = 0;
      // lodash forEach
      // send only validated (correct) files

      _.forEach(this.uploadFiles, (file) => {
        if (this.validate(file) === "") {
          formData.append("files", file);
          file_count++;
        }
      });

      try {
        this.uploading = true;
        await axios.post("/files", formData, {
          onUploadProgress: (event) =>
            (this.progress = Math.round((event.loaded * 100) / event.total)),
        });
        if (file_count) this.message = "The files have been uploaded.";
        else this.message = "No file has been uploaded.";

        this.uploadFiles = [];
        this.uploading = false;
        this.getFiles();
      } catch (err) {
        this.message = err.response.data.error;
        this.error = true;
        this.uploading = false;
      }
    },
  },
};
</script>

<style scoped>
.wrong-file {
  background: lightcoral;
}

.top_container {
  height: auto;
}

form {
  padding: 0.5em;
}

.file-manager-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.file-line {
  width: 100%;
  border-bottom: 2px solid #383c43;
  margin: 1px 0;
  padding: 2px 10px;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.5px;
  transition: all 0.25s ease-in-out;
  text-rendering: optimizeLegibility;
}

.file-line:hover {
  background: #383c43;
}

.header {
  font-weight: bold;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  border-bottom: 4px solid #383c43;
  font-size: 1.3rem;
}

.header:hover {
  background: rgba(0, 0, 0, 0);
}

.file-size {
  min-width: 90px;
  text-align: right;
}
.header .file-size {
  margin-right:30px;
}

.action-buttons span {
  font-size: 1.4rem;
  transition: color 0.15s ease-in-out;
}

.action-buttons span:last-child {
  margin-left: 10px;
}

.action-buttons span:hover {
  color: rgba(225, 20, 34, 1);
  cursor: pointer;
}

.input-field {
  opacity: 0;
  /* position: absolute; */
}

.upload-message {
  margin: 1em;
}
</style>
