<template>
    <div class="date-picker-container">
        <VueDatePicker :model-value="date" @update:model-value="handleDate" :enable-time-picker="false" :disabled-dates="disableDates" :max-date="new Date()" auto-apply placeholder="Select Date" />
    </div>
  </template>
  
  <script>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import axios from 'axios';
  import moment from 'moment';
  import '@vuepic/vue-datepicker/dist/main.css'
  
  export default {
    components: { VueDatePicker },
    props: ["apiRedirect", "websiteRedirect"],
    data() {
        return {
            date: null,
            validDates: [],
        };
    },
    methods: {
        handleDate(newDate) {
            this.date = newDate;
            this.$emit('date-changed', newDate);
        },
        getValidDates() {
            axios.get(`${this.apiRedirect}/lookielookie/get_valid_dates`)
                .then(response => {
                    this.validDates = response.data.map(d => d.split("T")[0])
                })
                .catch(error => {
                    console.error('Failed to fetch data:', error);
                });
        },
        disableDates (d) {
            const date = moment(d);
            const dateStr = date.format().split('T')[0];
            const day = date.isoWeekday();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (day === 0 || day === 6 || date >= today) {
                return true
            } else if (!this.validDates.includes(dateStr)) {
                return true
            } else {
                return false
            }
        }
    },
    mounted () {
        this.getValidDates();
    },
  };
  </script>
  
  <style>
  .date-picker-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  </style>
  