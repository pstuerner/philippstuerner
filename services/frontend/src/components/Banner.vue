<template>
    <header class="masthead" style="background-color: black; height: calc(20rem + 57px); width: 100%;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
            <div id="carouselExampleControls" class="carousel slide carousel-fade" data-ride="carousel"
                style="height: 100%;" data-interval="4000">
                <div class="carousel-inner" style="position: absolute; width: 100%; height: 100%;">
                    <div id="circles-container" class="carousel-item" data-interval="5000"
                        style="position: absolute; width: 100%; height: 100%;"></div>
                    <div id="particles-container" class="carousel-item active" data-interval="5000">
                        <canvas id="canvas-particles"></canvas>
                    </div>
                    <div id="transitions-container" class="carousel-item" data-interval="5000">
                        <div style="position: relative; height: 100%; width: 100%;"></div>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>

            <!-- <div class="center" style="z-index: 1;">
                <div class="site-heading">
                    <h2>🤗 Hello 🤗</h2>
                    <span class="subheading">have a look at my latest pet projects</span>
                </div>
            </div> -->
        </div>
    </header>
</template>

<script>
import {createParticles} from "@/assets/js/header-particles.js"
import {createTransitions} from "@/assets/js/header-transitions.js"
import {createCircles} from "@/assets/js/header-circles.js"

export default {
  mounted() {
    $('.carousel').carousel({
        pause: "false"
    });
    createParticles();
    createCircles();
    createTransitions();
  }
};
</script>