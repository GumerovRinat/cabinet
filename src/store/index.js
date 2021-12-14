import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false
  },
  getters: {
    isAuth(state) {
      return state.token !== null;
    }
  },
  mutations: {
    setLoading(state, param) {
      state.loading = param;
    }
  }
});
