<template>
    <div class="sidebar custom-sidebar">
        <ul class="nav flex-column" style="padding-left: 1.25em; list-style-type: disc">
            <li class="nav-item" v-for="year in sidebarData" :key="year">
                <router-link :to="{ name: 'EverydaysYear', params: { year: +year.year, month: 1, day: 1 }}"><span style="cursor: pointer;">{{ year.year }}</span></router-link>
                <ul style="padding-left: 0.5em; list-style-type: disc">
                    <li class="nav-item" v-for="week in year.weeks" :key="week">
                        <router-link :to="{ name: 'EverydaysCalendarWeek', params: { year: +year.year, month: week.month, day: week.day }}"><span style="cursor: pointer;">{{ week.week }} - {{ week.topic }}</span></router-link>
                        <ul style="padding-left: 0.75em; list-style-type: disc;">
                            <li class="nav-item" v-for="day in week.days" :key="day.str">
                                <router-link :to="{ name: 'EverydaysDay', params: { year: day.year, month: day.month, day: day.day }}"><span style="cursor: pointer;">{{ day.name }}</span></router-link>
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
                console.log("bubba")
                console.log(data)
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
