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
      dateWrap: false,
      showForm: true,
      showTicket: false,
      family: null,
      name: null,
      ot: null,
      birth: "1980-01-01",
      menu: false,
      phone: null,
      rules: [(value) => !!value || "Обязательное поле"],
      errFamily: null,
      errName: null,
      errOt: null,
      errBirth: null,
      errPhone: null
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  methods: {
    async handleSend() {
      if (!this.family || this.family.length < 2) {
        this.errFamily = "Значение менее 2-х символов";
        return;
      }
      if (!this.name || this.name.length < 2) {
        this.errName = "Значение менее 2-х символов";
        return;
      }
      if (!this.ot || this.ot.length < 2) {
        this.errOt = "Значение менее 2-х символов";
        return;
      }
      if (!this.birth) {
        this.errBirth = "Обязательное поле";
        return;
      }
      if (!this.phone) {
        this.errPhone = "Обязательное поле";
        return;
      }
      if (window.fbq) window.fbq("track", "Lead");
      let obj = {
        visitId: 0,
        recordId: this.params.item.selectedTime,
        family: this.family,
        name: this.name,
        ot: this.ot,
        birthDate: this.birth,
        phone: this.phone
      };
      const [error, result] = await api.Visit(obj);
      this.$processResponse(error, result);
      if (!error) {
        this.showForm = false;
        this.errFamily = null;
        this.errName = null;
        this.errOt = null;
        this.errBirth = null;
        this.errPhone = null;
        this.showForm = false;
        this.showTicket = true;
      }
    },

    stepBack() {
      !this.params.item.docId ? this.$emit('handleGo', { route: 'Step2', id: this.params.item.selectedDept }) : this.$emit('handleGo', { route: 'StepSkip', item: this.params.item });
    },

    handleClickOutside(e) {
      if (!e.target.classList.contains("v-overlay__scrim")) return;
      this.showForm = false;
      this.stepBack();
    },

    save(date) {
      this.$refs.menu.save(date);
    },

    handlePrint() {
      if (!this.$refs.ticket) return;
      let el = {};
      if (document.getElementById("pFrame") === null) {
        el = document.createElement("iframe");
        el.id = "pFrame";
        document.body.appendChild(el);
      } else {
        el = document.getElementById("pFrame");
      }
      let container = el.contentWindow.document;
      container.open();
      container.write(
        `${this.$refs.ticket.innerHTML}<style type="text/css" media="print">@page {size: auto; margin: 0}span {margin-left: 10px}</style>`
      );
      container.close();
      el.contentWindow.focus();
      el.contentWindow.print();
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
      @click="stepBack"
    >
      <v-icon left>
        mdi-arrow-expand-left
      </v-icon>
      Назад
    </v-btn>
    <v-dialog
      v-model="showForm"
      persistent
      max-width="290"
      v-click-outside="handleClickOutside"
    >
      <v-card>
        <v-card-title class="headline">
          Заполните форму
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="family"
            :rules="rules"
            :error-messages="errFamily"
            label="Фамилия"
            @input="() => (errFamily = null)"
          />
          <v-text-field
            v-model="name"
            :rules="rules"
            :error-messages="errName"
            label="Имя"
            @input="() => (errName = null)"
          />
          <v-text-field
            v-model="ot"
            :rules="rules"
            :error-messages="errOt"
            label="Отчество"
            @input="() => (errOt = null)"
          />
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="birth"
                label="Дата рождения"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="birth"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              :first-day-of-week="1"
              :locale="$store.state.lang"
              @change="save"
            />
          </v-menu>
          <v-text-field
            v-model="phone"
            :rules="rules"
            :error-messages="errPhone"
            label="Телефон"
            return-masked-value
            prefix="+7"
            v-mask="'(###)-###-##-##'"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small rounded dark color="#3650db" @click="handleSend">
            Записаться
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="showTicket" :class="$style.ticket">
      <div>
        <div ref="ticket">
          <p :class="$style.textCenter">Вы записаны на приём</p>
          <p>
            <strong>ФИО врача:</strong>
            <span :class="$style.text" v-text="params.item.params.name"></span>
          </p>
          <p>
            <strong>Дата:</strong
            ><span :class="$style.text" v-text="params.item.params.date"></span>
          </p>
          <p>
            <strong>Время:</strong
            ><span :class="$style.text" v-text="params.item.time"></span>
          </p>
        </div>
        <p>
          <v-btn
            :class="$style.button"
            small
            rounded
            dark
            color="#3650db"
            @click="handlePrint"
          >
            Распечатать
          </v-btn>
        </p>
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

.form {
  width: 100%;
  max-width: 400px;
  min-width: 200px;
  margin: 20px auto 0;
  padding: 10px;
  background-color: #f4f5f9;
  text-align: center;
}

.ticket {
  display: flex;
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.textCenter {
  text-align: center;
}

.text {
  margin-left: 10px;
}

.ticket > div {
  width: 100%;
  max-width: 430px;
  background-color: #f7f7f7;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.button {
  width: 100%;
}

iframe {
  display: none;
}
</style>
