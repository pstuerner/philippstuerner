<template>
    <div class="sidebar custom-sidebar">
        <ul class="nav flex-column" style="padding-left: 1.25em; list-style-type: disc">
            <li class="nav-item" v-for="(yearData, year) in sidebarData" :key="year">
                <router-link :to="{ name: 'EverydaysYear', params: { year: +year, month: 1, day: 1 }}"><span style="cursor: pointer;">{{ year }}</span></router-link>
                <!-- <span style="cursor: pointer;" @click="select('year',year,1,1)">{{ year }}</span> -->
                <ul style="padding-left: 0.5em; list-style-type: disc">
                    <li class="nav-item" v-for="(calendarWeekData, calendarWeek) in yearData" :key="calendarWeek">
                        <router-link :to="{ name: 'EverydaysCalendarWeek', params: { year: year, month: calendarWeekData.days[0]['month'], day: calendarWeekData.days[0]['day'] }}"><span style="cursor: pointer;">{{ calendarWeek }} - {{ calendarWeekData.topic }}</span></router-link>
                        <!-- <span style="cursor: pointer;" @click="select('calendarweek',year,calendarWeekData.days[0]['month'],calendarWeekData.days[0]['day'])">{{ calendarWeek }} - {{ calendarWeekData.topic }}</span> -->
                        <ul style="padding-left: 0.75em; list-style-type: disc;">
                            <li class="nav-item" v-for="day in calendarWeekData.days" :key="day.str">
                                <router-link :to="{ name: 'EverydaysDay', params: { year: day.year, month: day.month, day: day.day }}"><span style="cursor: pointer;">{{ day.weekday_str }} - {{ day.name }}</span></router-link>
                                <!-- <span style="cursor: pointer;" @click="select('day', day.year, day.month, day.day)">{{ day.weekday_str }} - {{ day.name }}</span> -->
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import { json } from "d3";

export default {
    data() {
        return {
            sidebarData: {},
        };
    },
    mounted() {
        this.fetchSidebarData();
    },
    methods: {
        fetchSidebarData() {
            json('https://api.philippstuerner.com/everydays/timetable').then(data => {
                this.sidebarData = data;
            }).catch(error => {
                console.error('Error fetching sidebar data:', error);
            });
        },
        // select (ymd, year, month, day) {
        //     this.$emit('selected', { ymd: ymd, year: year, month: month, day: day });
        // }
    }
}
</script>

<style scoped>
    /* Custom sidebar styles */
    .custom-sidebar {
      background-color: #f8f9fa;
      color: #000;
    }

    .custom-sidebar .nav-link {
      color: #000;
    }
    
    .sidebar {
        overflow: auto;
        white-space: nowrap;
        height:75vh;
    }

    @media (max-width:768px) {
        .sidebar {
            /* overflow: auto; */
            height:33.33vh;
        }
    }
  </style>
