<template>
        <p style="text-align: center; margin-bottom: 0.2em">{{ year }}-{{ month }}-{{ day }}</p>
        <p v-if="(Object.keys(info).length==0 && loaded && diffDays == 0)" style="text-align: center;">
          👻 There's no artwork for this day (yet) 👻<br /><br />New content drops every day at 9am CET (GMT+2)!
        </p>
        <p v-else-if="(Object.keys(info).length>0 && loaded && diffDays == 1)" style="text-align: center;">
          Come back tomorrow to find out what's next. Here's a small hint 😎:<br /><br /><b>{{ maskName(this.info.name) }}</b>
        </p>
        <p v-else-if="(Object.keys(info).length>0 && loaded && diffDays > 0)" style="text-align: center;">
          👻 There's no artwork for this day (yet) 👻
        </p>
        <div v-else>
          <h2 style="text-align: center;">{{ info.name }}</h2>
        <div class="row">
        <div class="col-12">
          <div v-for="(part, index) in info.essay" :key="index">
            <p>{{ part }}</p>
            <div v-if="index==0">
              <div v-cloak class="row">
                <div v-for="(image, img_index) in info.images.slice(0,2)" :key="img_index" class="col-6">
                  <ProgressiveImage
                    class="my-progressive-image"
                    lazy-placeholder
                    :blur="8"
                    :placeholder-src="image.placeholder"
                    :src="image.url"
                    :aspect-ratio="day.ratio"
                    object-cover
                  />
                </div>
                <div>
                  <p class="prompt m-0">&#9432; Prompt: {{ info.prompt }}</p>
                </div>
              </div>
            </div>
            <div v-if="index==1">
              <div class="row">
                <div v-for="(image, img_index) in info.images.slice(2,4)" :key="img_index" class="col-6">
                  <ProgressiveImage
                    class="my-progressive-image"
                    lazy-placeholder
                    :blur="8"
                    :placeholder-src="image.placeholder"
                    :src="image.url"
                    :aspect-ratio="day.ratio"
                    object-cover
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
</template>

<style scoped>
.prompt {
  padding-top: 0.5em;
  font-size: small;
  font-family: monospace;
}

/* [v-cloak] {
  display: none;
} */
</style>

<script>
import { json } from "d3";

export default {
  data () {
    let params = this.$route.params,
        dateObj = new Date(),
        month = dateObj.getUTCMonth() + 1,
        day = dateObj.getUTCDate(),
        year = dateObj.getUTCFullYear(),
        date_params = new Date(`${params.month}/${params.day}/${params.year}`),
        date_today = new Date(`${month}/${day}/${year}`),
        diffTime = date_params - date_today,
        diffDays = diffTime / (1000 * 60 * 60 * 24);

    return {
      year: params.year,
      month: params.month,
      day: params.day,
      loaded: false,
      diffDays: diffDays,
      info: {}
    }
  },
  mounted () {
    this.fetchInfo()
  },
  methods: {
    fetchInfo () {
      var url = `https://api.philippstuerner.com/everydays/info/day?year=${this.year}&month=${this.month}&day=${this.day}`;
      json(url).then(data => {
        this.info = data;
        
        if (Object.keys(data).length==0) {
          var url = `https://api.philippstuerner.com/everydays/name?year=${this.year}&month=${this.month}&day=${this.day}`;
          json(url).then(data => {
            this.info = data;
          })}

        this.loaded = true;
        
      }).catch(error => {
        console.error('Error fetching info:', error);
      });
    },
    maskName (name) {
      return Array.from(name, c => Math.random() < 0.5 ? '*' : c).join('');
    }
  }
};
</script>