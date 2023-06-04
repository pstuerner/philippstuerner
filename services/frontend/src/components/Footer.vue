<template>
    <footer>
        <div class="container">
        <div class="row">
            <div class="col-lg-8 col-md-10 mx-auto">
            <ul class="list-inline text-center">
                <li class="list-inline-item">
                <a href="https://www.linkedin.com/in/pstuerner/" target="_blank">
                    <span class="fa-stack fa-lg">
                    <i class="fas fa-circle fa-stack-2x"></i>
                    <i class="fab fa-linkedin fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                </li>
                <li class="list-inline-item">
                <a href="https://stackoverflow.com/users/13267582/phil" target="_blank">
                    <span class="fa-stack fa-lg">
                    <i class="fas fa-circle fa-stack-2x"></i>
                    <i class="fab fa-stack-overflow fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                </li>
                <li class="list-inline-item">
                <a href="https://github.com/pstuerner" target="_blank">
                    <span class="fa-stack fa-lg">
                    <i class="fas fa-circle fa-stack-2x"></i>
                    <i class="fab fa-github fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                </li>
                <li class="list-inline-item">
                <a href= "mailto:philipp.stuerner@web.de" target="_blank">
                    <span class="fa-stack fa-lg">
                    <i class="fas fa-circle fa-stack-2x"></i>
                    <i class="fas fa-envelope fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                </li>
            </ul>
            <p class="copyright text-muted">Copyright &copy; {{ year }} Philipp Stuerner</p>
            </div>
        </div>
        </div>
    </footer>
</template>

<script>
    export default {
    data() {
        return {
            year: new Date().getFullYear(),
        };
    },
    methods: {
        incrementCounter() {
        this.counter++;
        },
    },
    };
</script>