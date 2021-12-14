import { SERVER_URL } from "@/config";
import store from "@/store";
import axios from "axios";
axios.defaults.baseURL = `${SERVER_URL}`;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "*/*";

axios.interceptors.request.use(
  (config) => {
    store.commit("setLoading", true);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function getAffiliates() {
  let error = null;
  let result = null;
  try {
    const { data } = await axios.get("?a=Specialisation");
    result = data;
  } catch (e) {
    error = e;
  }
  return [error, result];
}

export async function getPersonnel(deptId) {
  let error = null;
  let result = null;
  try {
    const { data } = await axios.get(
      `?a=Doctor&b=Doctor/specialisation/${deptId}`
    );
    result = data;
  } catch (e) {
    error = e;
  }
  return [error, result];
}

export async function getPersonnelDate({ docId }) {
  let error = null;
  let result = {};
  try {
    const { data } = await axios.get(`?a=Schedule&b=Schedule/${docId}`);
    let allowedDates = [];
    data.forEach((x) => {
      if (x.date) allowedDates.push(x.date);
    });
    result.data = data;
    result.allowedDates = allowedDates;
  } catch (e) {
    error = e;
  }
  return [error, result];
}

export async function Visit({
  birthDate,
  family,
  name,
  ot,
  phone,
  recordId,
  visitId
}) {
  let error = null;
  let result = null;
  try {
    const { data } = await axios.get(
      `?a=Visit&birthDate=${birthDate}&family=${family}&name=${name}&ot=${ot}&phone=${phone}&recordId=${recordId}&visitId=${visitId}`
    );
    result = data;
  } catch (e) {
    error = e;
  }
  return [error, result];
}
