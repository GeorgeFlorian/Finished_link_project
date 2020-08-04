<template>
  <div>
    <textarea v-model="sendText" @change="changed = true" @keyup="changed = true"></textarea>
    <div class="buttons">
      <button @click.prevent="saveChanges">Save Changes</button>
      <button @click.prevent="discardChanges">Discard Changes</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Editor",
  props: ["fileText", "fileName"],
  data() {
    return {
      changed: false,
      text: this.fileText,
      name: this.fileName,
      sendText: "",
    };
  },
  mounted() {
    this.copyText();
  },
  computed: {
    getCurrentText() {
      return this.text;
    }
  },
  methods: {
    copyText() {
      this.sendText = this.getCurrentText;
    },
    emitToParent() {
      // this.$parent.$emit("custom-event", this.changed);
      this.$parent.$emit("custom-event", this.sendText, this.name);
    },
    saveChanges() {
      if (this.changed) {
        this.emitToParent();
        this.$emit("close");
        this.changed = false;
      } else {
        this.$emit("close");
      }
    },
    discardChanges() {
      this.text = this.fileText;
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
* {
  color: black;
}

div {
  width: 100%;
  height: 100%;
}

textarea {
  resize: none;
  border: none;
  width: 100%;
  height: 80%;
  padding: 1em;
}

.buttons {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
}

button {
  position: relative;
  display: block;
  width: 150px;
  height: 30px;
  margin: 0 10px;
  border: none;
  background: teal;
  color: white;
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: all 0.2s ease-in-out;
}

button:hover {
  cursor: pointer;
  background: rgb(28, 216, 216);
}
</style>