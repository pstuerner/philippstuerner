<template>
    <button onclick="topFunction()" id="to-top-button" title="Go to top"><i class="fas fa-arrow-up"></i></button>
</template>

<script>
export default {
    mounted() {
        let src = "/js/back-to-top.js";
        let script = document.createElement("script");
        script.setAttribute("src", src);
        script.setAttribute("id", src)
        script.async = false;
        document.body.appendChild(script);
    }
}
</script>