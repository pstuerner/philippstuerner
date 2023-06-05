<template>
    <button @click="topFunction" id="to-top-button" title="Go to top"><i class="fas fa-arrow-up"></i></button>
</template>

<script>
export default {
    data () {
        return {
            mybutton: null
        }
    },
    mounted() {
        var vm = this;

        //Get the button:
        vm.mybutton = document.getElementById("to-top-button");

        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function () {
            vm.scrollFunction();
        };
    },
    methods: {
        scrollFunction () {
            var vm = this;
            
            if (
                document.body.scrollTop > 20 ||
                document.documentElement.scrollTop > 20
            ) {
                vm.mybutton.style.display = "block";
            } else {
                vm.mybutton.style.display = "none";
            }
        },
        // When the user clicks on the button, scroll to the top of the document
        topFunction () {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
    }
}
</script>