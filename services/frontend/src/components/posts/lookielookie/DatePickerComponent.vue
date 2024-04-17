<template>
    <div class="date-picker-container">
        <VueDatePicker :model-value="date" @update:model-value="handleDate" :enable-time-picker="false" auto-apply placeholder="Select Date" />
    </div>
  </template>
  
  <script>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  
  export default {
    components: { VueDatePicker },
    data() {
        return {
            date: null,
        };
    },
    methods: {
        handleDate(newDate) {
            this.date = newDate;
            this.$emit('date-changed', newDate);
        },
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
  