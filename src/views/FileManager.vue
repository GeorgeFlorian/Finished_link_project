<template>
  <section>
    <div
      @drop.prevent="drop"
      @dragover.prevent
      @dragenter.prevent="dragEnter"
      @dragleave.prevent="dragLeave"
      :class="
        `drop-zone ${dragging ? 'dragging' : ''} ${
          dragging ? 'inFront' : 'behind'
        }`
      "
    >
      <span>Drag and drop files here</span>
    </div>
    <div class="top_container">
      <div class="mid_container">
        <div class="title">
          <h1>
            File
            <span>Manager</span>
          </h1>
        </div>

        <!-- TODO: File Manager Component -->
        <div v-cloak class="file-manager">
          <div class="file-line header">
            <div class="file-name">File name:</div>
            <div class="file-size">Size:</div>
            <div class="action-buttons">Actions:</div>
          </div>

          <draggable
            class="file-manager draggable"
            v-model="currentFiles"
            ghost-class="ghost"
            @end="onEnd"
          >
            <transition-group
              class="file-manager transitionGroup"
              type="transition"
              name="flip-list"
            >
              <div
                :class="`sortable file-line ${file.status ? 'wrong-file' : ''}`"
                v-for="(file, index) in currentFiles"
                :key="file.name"
                @mousedown="mouseDown"
                @dragend="mouseUp"
                @mouseup="mouseUp"
              >
                <!-- left  -->
                <div class="file-name">
                  {{ file.name }}
                  <span v-if="file.status">
                    <br />
                    {{ file.status }}
                  </span>
                </div>
                <!-- middle  -->
                <div class="file-size">{{ file.size }} kb</div>
                <!-- right -->
                <div class="action-buttons">
                  <span @click="editFile(index)">
                    <i class="far fa-edit"></i>
                  </span>

                  <span @click.prevent="deleteFile(index)">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
        <!-- <span v-if="uploading" class="progress-bar">
              <progress :value="progress" max="100">{{progress}}%</progress>
        </span>-->

        <div class="upload-message" v-if="message">{{ message }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import draggable from "vuedraggable";
import axios from "axios";
import _ from "lodash";
import VModal from "vue-js-modal";
import Editor from "../components/Editor";

Vue.use(VModal, { dialog: true });

const serverURL = location.origin;
const server = axios.create({ baseURL: serverURL, timeout: 5000 });

export default {
  name: "FileManager",
  components: {
    draggable,
  },
  data() {
    return {
      currentFiles: [],
      uploadFilesArray: [],
      progress: 0,
      message: "",
      uploading: false,
      dragging: false,
      oldIndex: "",
      newIndex: "",
      fileCount: 0,
      drag_counter: 0,
      inFront: true,
      mouse_hold: false,
      fileText: "",
    };
  },
  mounted() {
    this.getFiles();
  },
  methods: {
    mouseDown() {
      this.mouse_hold = true;
    },
    mouseUp() {
      this.mouse_hold = false;
    },
    dragEnter(event) {
      if (this.mouse_hold) return;
      event.preventDefault();
      this.drag_counter++;
      this.dragging = true;
    },
    dragLeave(event) {
      if (this.mouse_hold) return;
      event.preventDefault();
      if (this.drag_counter > 0) this.drag_counter--;
      if (this.drag_counter === 0) {
        this.dragging = false;
        this.inFront = false;
      }
    },
    drop(event) {
      if (this.mouse_hold) return;
      event.preventDefault();
      this.drag_counter = 0;
      this.dragging = false;
      this.inFront = false;
      this.uploadFiles(event);
    },
    onEnd(event) {
      this.oldIndex = event.oldIndex;
      this.newIndex = event.newIndex;
    },
    // get file list from Express server
    getFiles() {
      server
        .get("/getFileList")
        .then((res) => {
          this.currentFiles = [];
          // a string array containing the file names
          // fill currentFiles array with file objects from File API files
          // used for rendering file list on client side
          this.currentFiles = [...this.currentFiles, ...res.data];
          this.fileCount = this.currentFiles.length;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteFile(id) {
      this.fileCount--;
      server
        .post("/deleteFile", { fileName: this.currentFiles[id].name })
        .then((res) => {
          console.log("Delete File:", res.status);
          this.message = this.currentFiles[id].name + " has been deleted";
          this.getFiles();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // facem un request POST catre server
    // pentru a uploada fisierele
    async uploadFiles(event) {
      this.addFile(event);
      const formData = new FormData();
      var uploaded_files_count = 0;

      // lodash forEach
      // send only validated (correct) files
      _.forEach(this.uploadFilesArray, (file) => {
        if (this.validate(file) === "") {
          formData.append("files", file);
          uploaded_files_count++;
        }
      });

      try {
        this.uploading = true;
        await server.post("/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) =>
            (this.progress = Math.round((event.loaded * 100) / event.total)),
        });

        this.uploadFilesArray = [];
        this.uploading = false;
        this.getFiles();
        if (uploaded_files_count)
          this.message = "The files have been uploaded.";
        else this.message = "No file has been uploaded.";
      } catch (error) {
        this.message = error.response.data.error;
        this.uploading = false;
        this.getFiles();
      }
    },
    // populam array-urile currentFiles si uploadFilesArray
    // cu fisierele obtinute din drag and drop
    addFile(e) {
      this.message = "";
      this.progress = 0;
      this.dragging = false;
      let droppedFiles = e.dataTransfer.files;
      //if no files were dropped, then return
      if (!droppedFiles) return;
      // fill array with File API files that are going to be uploaded
      this.uploadFilesArray = [];
      this.uploadFilesArray = [...this.uploadFilesArray, ...droppedFiles];
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
    async editFile(id) {
      try {
        const res = await server.post("/readFileContent", {
          fileName: this.currentFiles[id].name,
        });
        // console.log(res.data);
        this.fileText = "";
        this.fileText = res.data;
      } catch (error) {
        console.error(error);
      }
      this.openModal(id);
    },
    openModal(id) {
      this.$modal.show(
        Editor,
        {
          fileText: this.fileText,
          fileName: this.currentFiles[id].name,
        },
        {},
        {
          "custom-event": (text, name) => {
            this.fileText = text;
            console.log("Inside parent: ");
            console.log(this.fileText);
            console.log("custom-event File name: " + name);
            this.updateFile(this.fileText, name);
          },
        }
      );
    },
    updateFile(newContent, name) {
      server
        .post("/updateFile", {
          content: newContent,
          fileName: name,
        })
        .then((res) => {
          console.log("Update File:", res.status);
          this.message = name + " has been updated";
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.top_container {
  height: auto;
  z-index: 10;
}

.file-manager {
  padding: 0.5em;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.draggable,
.transitionGroup {
  padding: 0;
}

.draggable {
  margin-bottom: 20px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  font-weight: bold;
  border-left: 4px solid #96ede5;
  color: white;
}

.file-line {
  width: 100%;
  border-bottom: 2px solid #383c43;
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

.file-name {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  min-width: 90px;
  text-align: right;
}
.header .file-size {
  margin-left: 30px;
}

.action-buttons span {
  pointer-events: auto;
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

.upload-message {
  width: auto;
  position: relative;
  margin: 0 auto;
  text-align: center;
  margin: 0.5em;
  padding: 0.5em;
}
.wrong-file {
  background-color: #7c3a42;
}

.wrong-file:hover {
  background-color: #af535e;
}

.drop-zone {
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  min-height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.dragging {
  background: pink;
  opacity: 0.5;
}

.dragging * {
  pointer-events: none;
}

.inFront {
  z-index: 1000;
}

.behind {
  z-index: 1;
}
</style>
