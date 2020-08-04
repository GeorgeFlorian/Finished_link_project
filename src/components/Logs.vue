<template>
  <div id="wrapper">
    <div v-for="(log, index) in rev" :key="index">{{ log }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Logs",
  data() {
    return {
      timestamp: "",
    };
  },
  computed: {
    ...mapState(["logs"]),
    rev() {
      let reverseArray = [...reverseArray, ...this.logs];
      reverseArray.reverse();
      return reverseArray;
    },
  },
  methods: {},
};
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 1.1em;
  letter-spacing: 0.4px;
}
</style>
