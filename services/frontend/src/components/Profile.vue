<template>
    <ToTopButton />
    
    <header class="masthead" :style="mastheadStyle">
        <div class="center" style="z-index: 1;">
            <div class="site-heading">
                <h2>{{ title }}</h2>
                <span class="subheading">{{ subheading }}</span>
            </div>
        </div>
    </header>
  
    <article data-toc data-toc-id="main-toc" data-toc-class="toc-custom" data-toc-parent-id="toc-parent" class="mb-4">
      <div class="container px-4 px-lg-5" style="text-align: justify;">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div id="master-container" class="col-md-10 col-lg-10 col-xl-8">
                <div>
                    <h3 style="text-align: center;">👀 LookieLookie 👀</h3>
                    <div v-if="reminders.length>0" style="justify-content: center; display: flex;">
                        <table id="tbl-lookielookie" style="text-align: center;">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Ticker</th>
                                    <th></th>
                                    <th>Price</th>
                                    <th>Set</th>
                                    <th>Triggered</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(reminder, index) in reminders" :key="index">
                                    <td>{{ reminder.triggered_at ? '✅' : '❌' }}</td>
                                    <td><a class="ticker-url" :href="'https://philippstuerner.com/posts/lookielookie/ticker/'+reminder.ticker" target="_blank">{{ reminder.ticker }}</a></td>
                                    <td>{{ reminder.operator }}</td>
                                    <td>{{ reminder.price }}</td>
                                    <td>{{ formatDate(reminder.inserted_at) }}</td>
                                    <td>{{ formatDate(reminder.triggered_at) }}</td>
                                    <td><span @click="removeRow(index)" style="cursor: pointer;">🗑️</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p style="text-align: center;">Nothing to see (yet)!</p>
                    </div>
                </div>
                <div style="margin-top: 2em; text-align: center;">
                    <button id="qsLogoutBtn" class="btn btn-primary" @click.prevent="logout">
                        Log Out
                    </button>
                </div>
            </div>
          </div>
      </div>
    </article>
  </template>
  
  <script>
  import { useAuth0 } from '@auth0/auth0-vue';
  import { useMeta } from 'vue-meta'
  import { onMounted, getCurrentInstance } from "vue";
  import ToTopButton from './ToTopButton.vue';
  import axios from 'axios';
  
  export default {
    data () {
        return {
            title: "🔒 Your Private Space 🔒",
            title_meta: "Profile",
            subheading: "Reminders & More",
            img: "profile_header.jpg",
            reminders: []
        }
    },
    setup () {
        onMounted(() => {
            useMeta({
                title: getCurrentInstance().data.title,
            })
        })

        const auth0 = useAuth0();
    
        return {
            user: auth0.user,
            logout() {
                auth0.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
                });
            }
        }
    },
    computed: {
        mastheadStyle() {
            return {
                'background-image': 'url(' + require(`@/assets/img/${this.img}`) + ')',
                'height': 'calc(20rem + 57px)',
                'width': '100%'
            }
        },
    },
    methods: {
        fetchData() {
            if (this.user==null) {
                return
            } else {
                axios.get(`https://api.philippstuerner.com/lookielookie/get_reminders?mail=${this.user.email}`)
                .then(response => {
                    this.reminders = response.data;
                })
                .catch(error => {
                    console.error('Failed to fetch data:', error);
                });
            }
        },
        removeRow(index) {
            let el = this.reminders[index];
            axios.get(`https://api.philippstuerner.com/lookielookie/remove_reminder?mail=${this.user.email}&ticker=${el.ticker}&operator=${el.operator}&price=${el.price}`)
                .then(response => {
                    this.reminders.splice(index, 1);
                })
                .catch(error => {
                    console.error('Failed to fetch data:', error);
                });
        },
        formatDate(dt) {
            if (dt == null) {
                return "-"
            } else {
                return dt.split('T')[0]
            }
        }
    },
    mounted() {
        this.fetchData();
    },
    components: {
        ToTopButton
    }
  }
  </script>
  
  <style scoped>
  @media (min-width: 769px) {
        /* Styles for desktop */
        #tbl-lookielookie {
            width: 50vw;
        }
    }

    @media (max-width: 768px) {
        /* Styles for mobile */
        #tbl-lookielookie {
            max-width: 100vw;
            display: table-cell;
            overflow-x: auto;
            white-space: nowrap;
            border-spacing: 10px;
            border-collapse: separate;
        }
    }

.ticker-url {
    outline-color: transparent;
    text-decoration: none;
    padding: 2px 1px 0;
}

.ticker-url:focus,
.ticker-url:hover {
    border-bottom: 1px solid;
}

.ticker-url[href^="http"] {
    background: url("../assets/img/external-link.png") no-repeat 100% 0;
    background-size: 16px 16px;
    padding-right: 19px;
}
  </style>
  