import Vue from "vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import { VueMaskDirective } from "v-mask";
Vue.directive("mask", VueMaskDirective);

Vue.config.productionTip = false;

Vue.prototype.$d = (date) => {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
};

Vue.prototype.$get = (keys) => {
  function getElement(arr, keys) {
    let key = keys.shift();
    return keys.length ? getElement(arr[key], keys) : arr[key];
  }
  function setElement(arr, keys, value) {
    let key = keys.shift();
    if (keys.length) {
      arr[key] = {};
      setElement(arr[key], keys, value);
    } else {    
      if (!key) {
        key = 0;
        while (key in arr) {
            key++;
        }
      }
      arr[key] = value;
    }
  }
  let get = {};
  window.location.search.slice(1).split('&').forEach(function(item) {
    let data = item.split('=');
    let key = data[0].replace(/\[.*/, '');
    let value = data[1] ? data[1] : '';
    if (data[0] !== key) {
      let subkeys = (/(?<=\[).*?(?=\])/g);
      get[key] = get[key] ? get[key] : {};
      setElement(get[key], subkeys, value);
    } else {
      get[key] = value;
    }
  });
  if (keys) {
    return getElement(get, keys.constructor !== Array ? keys.split() : keys);
  }
  return get;
}

Vue.prototype.$setRouter = (arg = null) => {
  arg ? window.history.pushState({}, document.title, arg) : window.history.replaceState({}, document.title, `${location.protocol}//${location.host}${location.pathname}`);
}

new Vue({
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
