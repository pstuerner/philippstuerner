<template>
  <p style="text-align: center; margin-bottom: 0.2em">{{ year }}</p>

  <div class="container">
    <div v-for="timetable, index in info.timetables" :key="index" class="row">
      <div class="col-12 text-center" style="margin-bottom: 2em">
        <div class="row">
          <h3>{{ timetable.topic }}</h3>
          <p style="margin-top: 0; margin-bottom: 1em; font-size: small; text-align: center;">{{ timetable.names.join(" - ") }}</p>
        </div>
        <div v-if="timetable.ratio<1" class="row">
          <div v-for="(day, day_index) in timetable.days" :key="day_index" class="col-lg-6 col-sm-12" >
            <div class="row">
              <div v-for="(image, url_index) in day.images" :key="url_index" class="col-3 m-0 p-0" >
                <router-link :to="{ name: 'EverydaysDay', params: { year: day.year, month: day.month, day: day.day }}">
                  <ProgressiveImage
                    class="my-progressive-image"
                    lazy-placeholder
                    :blur="8"
                    :placeholder-src="image.placeholder"
                    :src="image.url"
                    :aspect-ratio="day.ratio"
                    object-cover
                  />
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="row">
          <div v-for="(day, day_index) in timetable.days" :key="day_index" class="col-12" >
            <div class="row">
              <div v-for="(image, url_index) in day.images" :key="url_index" class="col-3 m-0 p-0" >
                <router-link :to="{ name: 'EverydaysDay', params: { year: day.year, month: day.month, day: day.day }}">
                  <ProgressiveImage
                    class="my-progressive-image"
                    lazy-placeholder
                    :placeholder-src="image.placeholder"
                    :src="image.url"
                    :aspect-ratio="day.ratio"
                    object-cover
                  />
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { json } from "d3";

export default {
  data () {
    let params = this.$route.params;

    return {
      year: params.year,
      month: params.month,
      day: params.day,
      info: {}
    }
  },
  mounted () {
    this.fetchInfo()
  },
  methods: {
    fetchInfo () {
      var url = `https://api.philippstuerner.com/everydays/info/year?year=${this.year}&month=${this.month}&day=${this.day}`;
      json(url).then(data => {
        this.info = data;
      }).catch(error => {
          console.error('Error fetching info:', error);
      });
    },
  }
};
</script>

<style scoped>
</style>