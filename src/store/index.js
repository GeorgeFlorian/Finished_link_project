import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logs: [],
  },
  getters: {},
  mutations: {
    ADD_LOG: (state, log) => {
      if (state.logs.length < 15) {
        state.logs.push(log);
      } else {
        state.logs.shift();
        state.logs.push(log);
      }
    },
  },
  actions: {
    addLog: (context, log) => {
      context.commit("ADD_LOG", log);
    },
  },
  modules: {},
});
