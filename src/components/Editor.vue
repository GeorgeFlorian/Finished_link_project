<template>
  <div>
      <textarea :value="text" @change="check"></textarea>
  </div>
</template>

<script>
export default {
  name: "Editor",
  props: ["fileText"],
  data() {
    return {
      changed: false,
      text: this.fileText,
    }
  },
  methods: {
    check() {
      console.log("I changed");
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
  width: 100%;
  height: 100%;
}
</style>