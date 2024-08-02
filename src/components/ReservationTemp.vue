<template>
  <div class="row justify-center mt-16">
    <div class="wrapper d-flex flex-column align-center justify-center ">
      <v-alert v-if="status === 400 && checker === -1"  width="470" closable :text="text" type="warning"></v-alert>
      <v-card
          :loading="loading"
          class="mx-auto my-5"
          :max-width="$vuetify.display.mobile ? 350 : 474">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
              :active="isActive"
              color="deep-purple"
              height="4"
              indeterminate
          ></v-progress-linear>
        </template>
        <v-card-item>

          <v-card-title>{{
              current == 1 ? 'Calendar' :
                  current == 2 ? 'Services' :
                      current == 3 ? 'Barbers' :
                          current == 4 ? 'Time' :
                              current == 5 ? 'Personal information' : 'Thank you'
            }}
          </v-card-title>

          <v-card-subtitle>

          </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-row
              align="center"
              class="mx-0"
          >

          </v-row>

          <div class="my-4 text-subtitle-1">
          </div>

          <div v-if="current == 1" class="d-flex justify-center">
            <v-date-picker
                ref="datePicker"
                :allowed-dates="allowedDates"
                :min="new Date()"
                :max="new Date(new Date().setDate(new Date().getDate() + 30))"
                v-model="date"/>
            <!--          <flatpickr  v-model="date" :config="config" class="form-control"/>-->
          </div>
          <div v-if="current == 2">
            <v-sheet border>
              <v-table>
                <thead>
                <tr>
                  <th>Name</th>
                  <th class="text-end">Price</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in services" :key="item.id"
                    class="cursor-pointer"
                    :class=" selectedIndices.includes(item.id) ? 'chip-hovered' :'' "

                    @click="toggleSelection(item.id)">
                  <td v-text="item.name"></td>
                  <td class="text-end" v-text="item.price"></td>
                </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </div>
          <div v-if="current == 3">
            <v-sheet border>
              <v-table>
                <thead>
                <tr>
                  <th>Name</th>
                  <th class="text-end">Avatar</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in employers" :key="item.id"
                    :style="`cursor: pointer; ${selectedEmployer.includes(item.id) ? 'background-color: #f2f8ff;' : ''} `"
                    @click="toggleSelectionEmployees(item.id)">
                  <td>{{ item.name }}</td>
                  <td class="text-end">
                    <v-avatar>
                      <v-img
                          :src="item.avatar ?? 'https://i.postimg.cc/yNyvjQPJ/defult-user-img.png'"/>
                    </v-avatar>
                  </td>
                </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </div>

          <div v-if="current == 4">
            <v-card-title>Availability ({{ formatDate(date) }} at {{ selectedTime.toString() }})
            </v-card-title>
            <div class="px-4">
              <v-chip-group v-for="(item, index) in availableTimesByDay" :key="index">
                <v-chip
                    v-for="(t, index) in filterAvailableTimes(item.times,item)"
                    :key="index"
                    :class=" selectedTime.includes(t) ? 'chip-hovered' :'' "
                    @click="toggleSelectionTime(t)"
                >
                  <!--                {{t + ':00'+this.date}}-->
                  <!--                {{t + ':00'+this.date}}-->
                  <!--                {{orders.map((a) => a.time+a.date)}}-->
                  <!--                {{ orders.map((a) => a.time + a.date).includes(t + ':00' + date) }}-->
                  {{ t }}
                </v-chip>
              </v-chip-group>

            </div>
          </div>
          <div v-if="current == 5">
            <v-form ref="form" v-model="valid">
              <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Name"
                  required
              />
              <div v-if="error && error.name">{{ error.name.toString() }}</div>
              <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  type="email"
                  label="E-mail (Optional)"
              />
              <div v-if="error && error.email">{{ error.email.toString() }}</div>
              <v-text-field
                  v-model="phone"
                  :rules="phoneRules"
                  label="Phone"
                  type="number"
                  required
              />
              <div v-if="error && error.phone">{{ error.phone.toString() }}</div>

            </v-form>
          </div>
          <div v-if="current == 'thx'">
            <v-sheet class="position-relative"
                     min-height="450">
              <v-fade-transition hide-on-leave>
                <v-card
                    append-icon="$close"
                    class="mx-auto"
                    elevation="16"
                    max-width="500"
                    title="Success"
                >
                  <template v-slot:append>
                    <v-btn icon="$close" variant="text" @click="current = 1"></v-btn>
                  </template>

                  <v-divider></v-divider>

                  <div class="py-12 text-center">
                    <v-icon
                        class="mb-6"
                        color="success"
                        icon="mdi-check-circle-outline"
                        size="128"
                    ></v-icon>

                    <div class="text-h4 font-weight-bold">Thank you</div>
                    <h4>Thank you the reservation has made place check your email or your phone number for the
                      reservation
                      details</h4>
                  </div>

                  <v-divider></v-divider>
                  <div class="pa-4 text-end">
                    <v-btn
                        class="text-none"
                        color="medium-emphasis"
                        min-width="92"
                        rounded
                        variant="outlined"
                        @click="current = 1"
                    >
                      Back
                    </v-btn>
                  </div>
                </v-card>
              </v-fade-transition>
            </v-sheet>
          </div>
        </v-card-text>
        <v-divider class="mx-4 mb-1"></v-divider>
        <v-card-actions>
          <v-btn v-if="current >= 2" class="ml-2" @click="current --">Previous</v-btn>
          <v-btn v-if="showNextButton()" @click="current ++">Next</v-btn>
          <v-btn v-if="current == 5" @click="submit">Reserve
            <template v-slot:loader>
              <v-progress-linear indeterminate></v-progress-linear>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
// import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import {config} from "@/config";
// eslint-disable-next-line no-unused-vars
import Cookies from "js-cookie"
// import config from '../config'

export default {
  components: {
    // flatpickr,
  },
  props: {
    orders: Object,
    employers: Object,
    services: Array,
    schedule: Array,
    availableTimesByDay: Array,
    frameToken: String,
  },
  data: () => ({
    status:null,
    text:null,
    allowed: false,
    current: 1,
    datesData: [],
    loading: false,
    config: null,
    date: null,
    checker:0,
    result: [],
    headers: [
      {text: 'Name', value: 'name'},
      {text: 'Price', value: 'price', align: 'end'}
    ],
    selected: [],
    selectedIndices: [],
    selectedEmployer: [],
    selectedTime: [],
    valid: true,
    name: '',
    email: '',
    phone: '',
    error: {},
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length >= 3) || 'Name must be at least 3 characters'
    ],
    emailRules: [
      v => (!v || /.+@.+\..+/.test(v)) || 'E-mail must be valid'
    ],
    phoneRules: [
      v => !!v || 'Phone is required',
      v => (v && v.length >= 10) || 'Phone number must be at least 10 digits'
    ]
  }),


  methods: {
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    showNextButton() {
      if (this.status !==  400){
      if (this.current == 1 && this.date != null) return true;
      if (this.current == 2 && this.selectedIndices.length > 0) return true;
      if (this.current == 3 && this.selectedEmployer.length > 0) return true;
      if (this.current == 4 && this.selectedTime.length > 0) return true;
      }
      // if (this.current < 5) return true;
      return false;
    },
    getDayNumber(date) {
      return new Date(date).getDay();
    },
    formatDate(date) {
      return moment(date).format('dddd');
    },
    toggleSelection(itemId) {
      const index = this.selectedIndices.indexOf(itemId);
      if (index === -1) {
        this.selectedIndices.push(itemId);
      } else {
        this.selectedIndices.splice(index, 1);
      }
    },
    toggleSelectionEmployees(itemId) {
      const index = this.selectedEmployer.indexOf(itemId);
      if (index === -1) {
        this.selectedEmployer.splice(0, this.selectedEmployer.length);
        this.selectedEmployer.push(itemId);
      } else {
        this.selectedEmployer.splice(index, 1);
      }
    },
    toggleSelectionTime(itemId) {
      const index = this.selectedTime.indexOf(itemId);
      if (index === -1) {
        this.selectedTime.splice(0, this.selectedTime.length);
        this.selectedTime.push(itemId);
      } else {
        this.selectedTime.splice(index, 1);
      }
    },
    isSelected(index) {
      return this.selectedIndices.includes(index);
    },

    isDayUnavailable() {
      const dayIndex = this.date.getDay();
      const daySchedule = this.schedule.find(item => item.id === dayIndex);
      return !daySchedule || daySchedule.openingTime === null || daySchedule.closingTime === null;
    },
    submit() {
      this.loading = true;
      /* eslint-disable */
      const data = {
        frameToken: this.frameToken,
        name: this.name,
        email: this.email,
        phone: this.phone,
        barber: this.selectedEmployer.toString(),
        service: this.selectedIndices,
        date: moment(this.date).format('YYYY-MM-DD'),
        time: this.selectedTime.toString(),
      };
      if (data) {

        axios.post(config.url.api.tempStore + this.frameToken, data)
            .then((response) => {
              // this.data = response.data
              if (response.data.status === 200) {
                this.$emit('status', response.data.status)
                this.current = 'thx'
                this.$refs.form.reset()
                this.selected = []
                this.selectedIndices = []
                this.selectedEmployer = []
                this.selectedTime = []
                this.date = null
              }
            })
            .catch((error) => {
              this.error = error.response.data.error
              console.log(error.response.data.error)
            });
      }
    },
    formatedDate(date) {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      return moment(date).format('YYYY-MM-DD');
      // return formattedDate.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    },
    filterAvailableTimes2() {

      return (times, item) => {
        return times.filter((time) => item.dayId === this.getDayNumber(this.date) && !this.orders.map((a) => a.time + a.date).includes(time + ':00' + moment(this.date).format('YYYY-MM-DD')) );
      };
    },
  },
  watch: {
    loading(val) {
      if (!val) return

      setTimeout(() => (this.loading = false), 2000)
    },
  },
  computed: {

    availabilityData() {
      const result = [];

      this.availableTimesByDay.forEach(item => {
        const data = {
          dayId: item.dayId,
          availableTimes: item.times.filter(time =>
              item.dayId === this.getDayNumber(this.date) &&
              !this.orders.map(a => a.time + a.date).includes(time + ':00' + moment(this.date).format('YYYY-MM-DD'))
          ),
        };
        if (data) {
          result.push({data});

        }
      });

      return result;
    },
    filterAvailableTimesyy() {

      return (times, item) => {
        return times.filter((time) => item.dayId === this.getDayNumber(this.date) && !this.orders.map((a) => a.time + a.date).includes(time + ':00' + moment(this.date).format('YYYY-MM-DD'))
        );
      };
    },
    filterAvailableTimes() {

      return (times, item) => {
        return times.filter((time) => item.dayId === this.getDayNumber(this.date) && !this.orders.map((a) => a.time + a.date).includes(time + ':00' + moment(this.date).format('YYYY-MM-DD')));
      };
    },
    test() {
      return (date) => {
        const currentDate = moment(date).format('YYYY-MM-DD');
        const dayIndex = date.getDay();
        const daySchedule = this.schedule.find(item => item.id === dayIndex);

        if (
            daySchedule &&
            daySchedule.openingTime !== null &&
            daySchedule.closingTime !== null
        ) {
          const allTimesBooked = this.orders.every(
              (order) => order.date === currentDate
          );

          return !allTimesBooked;
        }

        return false;
      };
    },
    allowedDates() {
      return (date) => {
        const dayIndex = date.getDay();
        const daySchedule = this.schedule.find(item => item.id === dayIndex);

        if (
            daySchedule &&
            daySchedule.openingTime !== null &&
            daySchedule.closingTime !== null
        ) {
          const currentDate = moment(date).format('YYYY-MM-DD');
          const dayId = this.getDayNumber(date);

          const availableTimes = this.availableTimesByDay.filter(time => time.dayId === dayId);
          const unavailableTimes = this.orders.map(order => order.time + order.date);

          const allowedTimes = availableTimes.filter(time =>
              !unavailableTimes.includes(time + ':00' + currentDate)
          );

          return allowedTimes.length > 0;
        }

        return false;
      };
    }



  },
};
</script>
<style>
.v-card .v-card-text{
  min-width: 475px ;
}
@media (max-width: 500px) {
  .v-card .v-card-text{
    min-width: auto;  }
  .v-date-picker {
    width: 200px;
  }

}
.chip-hovered {
  background-color: #f2f8ff;
  border: 1px solid #0a53be;
}
.v-date-picker-month__day--selected .v-btn {
  background-color: #0a53be;
}
.v-date-picker-month__day--selected .v-btn__content {
  color: #fff !important;
}
.v-date-picker div:first-child .v-picker-title,
.v-date-picker div:first-child .v-picker__header {
  display: none !important;

}

.v-date-picker {
  width: 435px;
}

.v-date-picker-controls__date {
  margin-inline-end: 4px;
  font-size: 1rem;
  font-weight: 600 !important;

}

.v-btn--icon {
  border-radius: 50%;
  min-width: 0;
  width: 40px;
  height: 40px !important;
  padding: unset !important;
}

.v-date-picker-month__day {


}

.v-date-picker-month__day .v-btn--variant-outlined {
  background-color: #feeceb;
  color: #feeceb;
  border-radius: 50%;


}

.v-date-picker-month__day .v-btn__content {
  color: #39a5f2;
}

/* EDITABLE */
/*
.v-date-picker-month {
  display: flex;
  justify-content: center;
  min-width: 388px;
  --v-date-picker-month-day-diff: 4px;
}
.v-date-picker-month {
  padding: 0 14px 12px;
}*/
</style>