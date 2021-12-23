<script>
import * as api from "../api";

export default {
  data() {
    return {
      tableData: [],
      exclusions: [{id: 139, param: 214}, {id: 21, param: 207}]
    };
  },
  methods: {
    checkURL() {
      let specId = this.$get("specId");
      if (!specId) return;
      specId = parseInt(specId);
      const obj = this.tableData.find(x => x.specId === specId);
      if (!obj) return;
      this.goForth(obj);
    },

    goForth(item) {
      const obj = this.exclusions.find(x => x.id === item.specId);
      if (obj) {
        item.docId = obj.param;
        item.selectedDept = obj.param;
        this.$emit("handleGo", {
          route: "StepSkip",
          item
        })
      } else {
        this.$emit("handleGo", { route: "Step2", id: item.specId, specName: item.specName });
      }
      let docId = this.$get("docId");
      docId ? this.$setRouter(`?specId=${item.specId}&docId=${docId}`) : this.$setRouter(`?specId=${item.specId}`);
    },

    handleBackToSite() {
      window.location.href = "/";
    }
  },
  async mounted() {
    const [error, result] = await api.getAffiliates();
    this.$processResponse(error, result);
    if (error) return;
    this.tableData = result;
    this.checkURL();
  }
};
</script>

<template>
  <div :class="$style.root">
    <v-btn
      small
      rounded
      dark
      color="#3650db"
      @click="handleBackToSite"
    >
      Вернуться на сайт
    </v-btn>
    <div :class="$style.wrapper">
      <table :class="$style.mainTable">
        <thead>
          <tr>
            <th :class="$style.col1">Выберите специальность врача</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in tableData"
            :key="item.index"
            @click="goForth(item)"
          >
            <td :class="$style.overflowWrap">
              <span :class="$style.textOverflow" v-text="item.specName"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style module>
.root {
  width: 100%;
  min-width: 300px;
  max-width: 1024px;
  margin: 0 auto;
  height: 100%;
  min-height: 300px;
  position: relative;
}

.wrapper {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.mainTable {
  width: 100%;
  border-spacing: 1px;
  color: #0009;
}

.mainTable thead > tr > th {
  position: sticky;
  top: 1px;
  font-weight: bold;
  background-color: #f4f5f9;
  z-index: 1;
}

.mainTable td,
.mainTable th {
  outline: 1px solid #008abf;
  padding: 0 5px;
  vertical-align: middle;
}

.mainTable td {
  height: 40px;
  vertical-align: middle;
  cursor: pointer;
}

.mainTable tr {
  transition: all 0.2s ease-in-out 0s;
}

.mainTable tr:nth-child(even) {
  background-color: #f4f5f9;
}

.mainTable tr:hover {
  background-color: #e4eff2;
}

.col1 {
  min-width: 300px;
}

.textCenter {
  text-align: center;
}

.overflowWrap {
  position: relative;
}

.overflowWrap > span {
  display: block;
  position: absolute;
  top: 2px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 5px;
}

.textOverflow {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
