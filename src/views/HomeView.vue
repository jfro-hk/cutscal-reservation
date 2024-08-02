<template>
  <ReservationTemp @status="handleStatus" :employers="employers" :services="services" :schedule="schedule" :orders="orders"
                   :available-times-by-day="availableTimesByDay" :frame-token="this.$route.params.id"/>
</template>

<script>

import moment from 'moment';
import ReservationTemp from '../components/ReservationTemp.vue';
import axios from "axios";
import {config} from "@/config";

export default {
  components: {
    ReservationTemp,
  },

  data() {
    return {
      status:null,
      current: 1,
      date: null,
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Price', value: 'price', align: 'end'}
      ],
      selected: [],
      selectedIndices: [],
      selectedEmployer: [],
      errors: {},
      orders: {},
      employers: {},
      services: [],
      schedule: [],
      availableTimesByDay: []
    };
  },

  watch: {
    status(newSchedule){
      if (newSchedule === 200){
        this.fetchData()
      }
    },
  },
  methods: {
    fetchData() {
      const apiUrl = config.url.api.tempData + this.$route.params.id;
console.log('apiUrl',apiUrl)
      return axios.get(apiUrl)

          .then((response) => {
            // console.log('response',response)

            this.employers = response.data.employers.data;
            this.services = response.data.services;
            this.schedule = response.data.schedule;
            this.orders = response.data.orders;
            this.availableTimesByDay = response.data.availableTimesByDay;
            this.disabledTimesByDay = response.data.disabledTimesByDay;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    handleStatus(e){
      console.log(e)
      // if (e === 200){
        this.status = e
      // }
    },
    setCookie() {

      // $cookies.set('r-token',this.rToken)
      // this.rToken = usePage().url.replace('/make-a-reservation/','')
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
    isSelected(index) {
      return this.selectedIndices.includes(index);
    },
  },

  mounted() {
    this.setCookie()
    this.fetchData()
  }
}
</script>

