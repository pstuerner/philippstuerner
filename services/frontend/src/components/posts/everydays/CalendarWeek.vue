<template>
  <p style="text-align: center; margin-bottom: 0.2em">{{ year }}-{{ month }}-{{ day }}</p>
  <h2 style="text-align: center;">{{ info.topic }}</h2>

  <div class="container">
    <div class="row">
      <div v-for="(day, index) in info.days" :key="index" class="col-xl-6 col-md-12">
        <p style="margin-bottom: 0.1em;">{{ day.name }}</p>
        <div class="row">
          <div v-for="(image, img_index) in day.images" :key="img_index" class="col-3 m-0 p-1">
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
      info: {
        topic: ""
      }
    }
  },
  mounted () {
    this.fetchInfo()
  },
  methods: {
    fetchInfo () {
      var url = `https://api.philippstuerner.com/everydays/info/calendarweek?year=${this.year}&month=${this.month}&day=${this.day}`;
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