<template>
    <!-- <Head title="Home" /> -->
    <Banner />
    <div class="container px-4 px-lg-5">
      <div class="row gx-4 gx-lg-5 justify-content-center">
        <div class="col-md-10 col-lg-8 col-xl-7">
          <!-- Post preview-->
          <div v-for="post in blogPosts" :key="post.slug" class="post-preview">
              <router-link :to="`/posts/${post.slug}`">
                <h2 class="post-title">{{ post.title }}</h2>
                <h3 class="post-subtitle">{{ post.subtitle }}</h3>
              </router-link>
              <p class="post-meta">
                Posted by <router-link :to="`/about`">Philipp Stuerner</router-link> on {{ post.date }}
              </p>
          </div>
          <hr class="my-4" />
        </div>
      </div>
    </div>
</template>

<script>
import Banner from './Banner.vue';

export default {
  data() {
    return {
      blogPosts: [
        {
          slug: 'artwork',
          title: 'An Artwork A Day',
          subtitle: "Combining OpenAI's GPT3.5 and DALL-E to generate art every day.",
          date: 'May 19, 2023'
        },
        {
          slug: "gai_animals",
          title: "Generative AI — Animals",
          subtitle: "An interactive world map built with D3.js and Vue.js full of Generative AI using Stable Diffusion and ChatGPT.",
          date: 'April 23, 2023',
        },
        {
          slug: "don_quijote",
          title: "Don Quijote",
          subtitle: "Telegram based application to practice Spanish vocabulary.",
          date: 'December 17, 2022',
        },
        {
          slug: "cmc_scanner",
          title: "CMC Scanner",
          subtitle: "Small web application to query and compare historical CoinMarketCap snapshots.",
          date: 'September 11, 2022',
        },
        {
          slug: "don_conjugator",
          title: "Don Conjugator",
          subtitle: "Web application to practice conjugating Spanish verbs.",
          date: 'September 8, 2022',
        },
        {
          slug: "gradient_descent",
          title: "Gradient Descent",
          subtitle: "Have a deep dive into one of the most important optimization algorithms in machine learning.",
          date: 'November 5, 2021',
        },
        {
          slug: "linear_models",
          title: "Linear Models",
          subtitle: "In-depth analysis of linear regression and classification models.",
          date: 'September 20, 2021',
        },
        {
          slug: "confusion_matrix",
          title: "Confusion Matrix",
          subtitle: "Learn what the confusion matrix and its metrics are by interacting with a simple MNIST classifier.",
          date: 'July 15, 2021',
        }
      ],
    };
},
  components: {
    Banner
  }
};
</script>