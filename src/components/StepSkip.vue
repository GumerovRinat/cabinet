<script>
import * as api from "../api";

export default {
  props: {
    params: {
      type: Object
    }
  },
  data() {
    return {
      dateData: null,
      timeData: [],
      selectedItem: {
        id: null,
        date: null,
        name: null
      },
      dateMin: null,
      dateMax: null
    };
  },
  methods: {
    resetSelections() {
      this.selectedItem.date = null;
      this.selectedItem.name = null;
      this.dateData = null;
      this.timeData = [];
    },

    async handleDocSelect(item) {
      this.resetSelections();
      const [error, result] = await api.getPersonnelDate(item);
      this.$processResponse(error, result);
      if (error) return;
      this.selectedItem.id = item.docId;
      this.selectedItem.name = this.params.item.specName;
      this.dateData = result;
    },

    setCalendarRange() {
      this.dateMin = new Date();
      this.dateMax = this.$d(
        new Date(this.dateMin.getFullYear(), this.dateMin.getMonth() + 2, 0)
      );
      this.dateMin = this.$d(this.dateMin);
    },

    getAllowedDates(arg) {
      if (!this.dateData || !this.dateData.data.length) return;
      return this.dateData.allowedDates.includes(arg);
    },

    handleDateChange(arg) {
      if (!this.dateData.data.length) return;
      let arr = [];
      this.dateData.data.forEach((x) => {
        if (x.date === arg) arr.push(x);
      });
      this.timeData = arr.length ? arr : [];
    },

    handleBack() {
      this.$setRouter();
      this.$emit("handleGo", { route: "Step1", id: null });
    },

    handleBackToSite() {
      window.location.href = "/";
    }
  },
  async mounted() {
    this.setCalendarRange();
    this.handleDocSelect(this.params.item);
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
      :class="$style.marginRight"
      @click="handleBackToSite"
    >
      Вернуться на сайт
    </v-btn>
    <v-btn
      small
      rounded
      dark
      color="#3650db"
      @click="handleBack()"
    >
      <v-icon left>
        mdi-arrow-expand-left
      </v-icon>
      Назад
    </v-btn>
    <div :class="$style.wrapper">
      <div v-if="selectedItem.id" :class="$style.calendarWrap">
        <v-date-picker
          v-model="selectedItem.date"
          :allowed-dates="getAllowedDates"
          full-width
          :first-day-of-week="1"
          locale="RU-ru"
          color="#3650db"
          :min="dateMin"
          :max="dateMax"
          @change="handleDateChange"
        />
        <div v-if="selectedItem.date" :class="$style.timeWrap">
          <div
            v-for="item in timeData"
            :key="item.recordId"
            v-text="item.time"
            @click="
              $emit('handleGo', {
                route: 'Step3',
                item: {
                  docId: params.item.docId,
                  selectedDept: params.id,
                  selectedTime: item.recordId,
                  params: selectedItem,
                  time: item.time
                }
              })
            "
          ></div>
        </div>
      </div>
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

.marginRight {
  margin-right: 20px;
}

.wrapper {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.tableWrap {
  flex: 1;
  min-height: 200px;
  overflow: auto;
}

.calendarWrap {
  padding-top: 10px;
  display: flex;
  height: 388px;
}

.calendarWrap > *:first-child {
  flex: 1;
  padding-right: 10px;
}

.timeWrap {
  width: 160px;
  padding: 10px;
  background-color: #f4f5f9;
  text-align: center;
  overflow: auto;
}

.timeWrap > * {
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
  transition: color 0.2s ease-in-out 0s;
}

.timeWrap > *:hover {
  color: #3650db;
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
}

.mainTable tr:nth-child(even) {
  background-color: #f4f5f9;
}

.col1 {
  min-width: 300px;
}

.mainTable tr {
  transition: all 0.2s ease-in-out 0s;
  cursor: pointer;
}

.mainTable tr:hover {
  background-color: #e4eff2;
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
