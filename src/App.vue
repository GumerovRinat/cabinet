<script>
import Vue from "vue";
import Step1 from "./components/Step1.vue";
import StepSkip from "./components/StepSkip.vue";
import Step2 from "./components/Step2.vue";
import Step3 from "./components/Step3.vue";

export default {
  name: "App",
  components: {
    Step1,
    StepSkip,
    Step2,
    Step3
  },
  data() {
    return {
      snackbar: null,
      snackbarText: null,
      snackbarColor: null,
      snackbarTimeout: null,
      params: {},
      layout: Step1
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    handleGo(arg) {
      this.params = arg;
      this.layout = arg.route;
    }
  },
  mounted() {
    Vue.prototype.$message = (text) => {
      this.snackbarText = text;
      this.snackbarColor = "#67c23a";
      this.snackbarTimeout = 3000;
      this.snackbar = true;
    };

    Vue.prototype.$message.error = (text) => {
      this.snackbarText = text;
      this.snackbarColor = "#e3605a";
      this.snackbarTimeout = 3000;
      this.snackbar = true;
    };

    Vue.prototype.$processResponse = (error, result) => {
      if (error && error.response) {
        this.$message.error(error.response.data);
      } else if (result && result.transCode) {
        this.$message(result.transCode);
      }
      this.$store.commit("setLoading", false);
    };
  }
};
</script>

<template>
  <v-app :class="$style.root">
    <div v-if="loading" :class="$style.preloader">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <component :is="layout" :params="params" @handleGo="handleGo" />
    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbarColor"
      :timeout="snackbarTimeout"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<style module>
.root {
  height: 100%;
  position: relative;
}

.preloader {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 99;
}
</style>
