<template>
    <ToTopButton />
    
    <header class="masthead" :style="mastheadStyle">
        <div class="center" style="z-index: 1;">
            <div class="site-heading">
                <h1>{{ title }}</h1>
                <span class="subheading">{{ subheading }}</span>
            </div>
        </div>
    </header>

    <article data-toc data-toc-id="main-toc" data-toc-class="toc-custom" data-toc-parent-id="toc-parent" class="mb-4">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div id="master-container" class="col-md-10 col-lg-10 col-xl-8">
                <p><b>tl;dr:</b> the confusion matrix and its metrics are really powerful concepts which is why I've visualized them in an intuitive way using a simple MNIST classifier, d3.js, fancy tooltips, and an interactive cutoff slider. You can find the source code on <a href="https://github.com/pstuerner/philippstuerner/tree/master/services/frontend/src/components/posts/confusion_matrix" target="_blank">GitHub <i class="fab fa-github"></i></a>!</p>
                <hr>
                <p>
                    Classification tasks are among the most common problems in data science. Take a look at the following examples and I am sure you will find yourself in one, if not all of them:
                </p>
                <ul>
                    <li>Netflix recommends a movie you actually like</li>
                    <li>Spotify suggests a song that turns out to become one of your favorites</li>
                    <li>Amazon advertises a book that fits your favorite genre</li>
                    <li>Instagram promotes a channel based on your interests</li>
                    <li>Your bank rejects your mortgage application</li>
                    <li>Receiving an email from the son of the Nigerian prince who, for whatever reason, wants to share his fortune with you</li>
                </ul>
                <p>
                    All of these examples have some sort of classification algorithm in the background that determines the most appropriate action. In my experience, the goal of a classification task in most cases is to make a recommendation. Books, songs, movies, products, channels, hotels - you name it. However, there are many more classification tasks, such as automatically classifying emails as spam or determining whether a customer is creditworthy or not.
                </p>
                <p>
                    There are multiple approaches to constructing a classification algorithm and different algorithms performer better or worse than others. Even the same algorithm performs differently as soon as you start tweaking its internal hyperparameters. Hence, there must be a way to evaluate the performance of different classification algorithms so we can compare and improve them. This is where a major concept in machine learning comes into play: the confusion matrix. Let's get right into it, you can get an idea of how I structured the remaining parts of this post in the table of contents below.
                </p>
                <TableOfContent />
                <h1 class="section-heading">Introduction</h1>
                <p>
                    Honestly, the confusion matrix is fairly simple to understand, although it is such an important concept. A confusion matrix is a \(n \times n\) matrix containing the dataset's ground truth labels and the predictions of a classifier. Each cell contains a count of how often the classifier predicted a particular label to a given ground truth. The resulting matrix contains all the information you need to evaluate if the trained model is good or bad at predicting classes.
                </p>
                <p>
                    Confusion matrices come in different shapes since the \(n\) depends on the amount of labels. A classifier that assigns handwritten letters will have a \(26 \times 26\) confusion matrix assuming that we're working with a standard latin alphabet. However, a classifier that assigns handwritten digits will have a \(10 \times 10\) confusion matrix. The point I want to stress is that confusion matrices might look different but the resulting metrics remain unchanged.
                </p>
                <p>
                    Let's continue by creating a really simple classification task and actually solving our problem statement by training a learning algorithm. Equipped with a trained model we can continue exploring the confusion matrix and learn about different strengths and pitfalls.
                </p>
                <h1 class="section-heading">A simple example</h1>
                <p>
                    MNIST is a dataset that contains vectorized data of images of handwritten digits. It is a fairly popular dataset that has become the "Hello World!" for many machine learning problems. The most obvious classification task for this dataset is to classify each image of a handwritten digit to an integer.
                </p>
                <div style="text-align: center;">
                    <div style="display: inline-block; text-align: left;">
                        <img src="@/assets/img/mnist_0.png" alt="" width="75"> → <code>0</code><br>
                        <img src="@/assets/img/mnist_5.png" alt="" width="75"> → <code>5</code><br>
                        <img src="@/assets/img/mnist_9.png" alt="" width="75"> → <code>9</code><br>
                    </div>
                </div>
                <p>
                    This is called multilabel classification because the algorithm tries to assign each image to multiple labels (digits 0 to 9). Since we want to keep it simple, we translate the usual MNIST classification task into a binary problem: classify whether an image is a five or not.
                </p>
                <div style="text-align: center;">
                    <div style="display: inline-block; text-align: left;">
                        <img src="@/assets/img/mnist_0.png" alt="" width="75"> → <code>False</code><br>
                        <img src="@/assets/img/mnist_5.png" alt="" width="75"> → <code>True</code><br>
                        <img src="@/assets/img/mnist_9.png" alt="" width="75"> → <code>False</code><br>
                    </div>
                </div>
                <p>
                    This makes the confusion matrix much more understandable, since we are only dealing with a \(2 \times 2\) matrix. The confusion matrix works for any size of multilabel classification, it is just more visually appealing in the simple case.
                </p>
                <h1 class="section-heading">The confusion matrix</h1>
                <p>
                    After training a classifier we can test its performance. To do this, we use the trained classifier to make predictions on unseen data and assign each result to the appropriate confusion matrix bin. For our binary classifier, the confusion matrix looks like the following:
                </p>
                <div style="height: 15em; width: 50%;margin-left: auto; margin-right: auto;">
                    <table style="margin-left: auto; margin-right: auto; width: 100%; height: 100%; text-align: center;">
                        <tbody>
                            <tr>
                            <td></td>
                            <td style="border-right: 1px solid black"></td>
                            <td colspan="2"><b>Classifier prediction</b></td>
                            </tr>
                            <tr style="border-bottom: 1px solid black;">
                            <td></td>
                            <td style="border-right: 1px solid black"></td>
                            <td>-</td>
                            <td>+</td>
                            </tr>
                            <tr>
                            <td class="vertical" rowspan="2"><span><b>Ground truth</b></span></td>
                            <td style="border-right: 1px solid black">-</td>
                            <td style="background-color: forestgreen;">True Negative (TN)</td>
                            <td style="background-color: crimson;">False Positive (FP)</td>
                            </tr>
                            <tr>
                            <td style="border-right: 1px solid black">+</td>
                            <td style="background-color: crimson;">False Negative (FN)</td>
                            <td style="background-color: forestgreen;">True Positive (TP)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    As you can see, there are four main bins that you should be aware of:
                </p>
                <ul>
                    <li>True Negatives (TN): Observations that <b>do not belong</b> to the target label and were classified as <b>not belonging</b> to the target label. In our case: handwritten digits of e.g. 0, 3 and 9 that were <b>not classified</b> as 5s.</li>
                    <li>False Positives (FP): Observations that <b>do not belong</b> to the target label and were classified as <b>belonging</b> to the target label. In our case: handwritten digits of e.g. 0, 3 and 9 that were <b>classified</b> as 5s.</li>
                    <li>False Negatives (FN): Observations that <b>belong</b> to the target label and were classified as <b>not belonging</b> to the target label. In our case: handwritten digits of 5s that were <b>not classified</b> as 5s.</li>
                    <li>True Positives (TP): Observations that <b>belong</b> to the target label and were classified as <b>belonging</b> to the target label. In our case: handwritten digits of 5s that were <b>classified</b> as 5s.</li>
                </ul>
                <p>
                    From my experience, it's not a concept that gets stuck in your head right away. That's not because it's extremely complicated, but rather because it's a little difficult to distinguish between the terms. However, if you think about it often enough or put it into practice a few times then TN, FP, FN and TP will soon feel very natural! With every prediction result mapped to its confusion matrix bin, we have everything we need to compute some really handy metrics to help us evaluate the classifier's performance.
                </p>
                <h1 class="section-heading">Metrics</h1>
                <p>
                    There are four metrics you should constantly keep in mind:
                </p>
                <div class="row">
                    <div class="col-lg-6 col-xl-6 col-md-12 col-sm-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Accuracy</h5>
                                <p class="card-text">$$\frac{\textrm{TN}+\textrm{TP}}{\textrm{TN}+\textrm{TP}+\textrm{FN}+\textrm{FP}}$$</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-xl-6 col-md-12 col-sm-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Precision</h5>
                                <p class="card-text">$$\frac{\textrm{TP}}{\textrm{TP}+\textrm{FP}}$$</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-xl-6 col-md-12 col-sm-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Recall</h5>
                                <p class="card-text">$$\frac{\textrm{TP}}{\textrm{TP}+\textrm{FN}}$$</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-xl-6 col-md-12 col-sm-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <h5 class="card-title">F1</h5>
                                <p class="card-text">$$2*\frac{\textrm{recall}*\textrm{precision}}{\textrm{recall}+\textrm{precision}}$$</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ul>
                    <li>Accuracy: ratio of correct predictions (TN, TP) to all predictions (TN, FP, FN, TP)</li>
                    <li>Precision: ratio of correct positive predictions (TP) to all positive predictions (TP, FP)</li>
                    <li>Recall: ratio of correct positive predictions (TP) to all actual positive labels (TP, FN)</li>
                    <li>F1: Weighted average of precision and recall</li>
                </ul>
                <p>
                    Working with these metrics can be a bit tricky, as there are a few things to keep in mind to ensure that you don't misinterpret the results and draw the right conclusions. Therefore, you should pay attention to the following "terms and conditions":
                </p>
                <ul>
                    <li>Although accuracy is the most understandable metric, it is also the most dangerous of the four. Remember that accuracy is a reliable metric only if the underlying dataset is not too skewed! If the number of positive labels, in our case handwritten fives, is many times smaller than the number of non-positive labels, in our case all handwritten digits except fives, high accuracy is no guarantee of a good classifier. This is because in the unbalanced case, high accuracy is associated with low recall.</li>
                    <li>For unbalanced data sets, it is useful to evaluate the classifier based on precision and recall while considering the tradeoff of the two metrics.</li>
                    <li>Precision and recall run in opposite directions. High precision leads to low recall and vice versa. Which metric is more important depends on the application. Just consider whether false positives or false negatives are more critical.
                    For example, if you are classifying movies for a children's channel, a false positive (a movie that is not safe but is classified as safe) would be worse than a false negative (a movie that is safe but is classified as not safe).
                    In this case, precision is the critical metric. On the other hand, when classifying terrorist financing transactions, a false negative (a terrorist financing transaction that is classified as secure) would be worse than a false positive (a secure transaction that is classified as terrorist financing). In this case, recall is the key metric.</li>
                    <li>If precision and recall are equally important, opt for the F1 score. The F1 score is only high if both precision and recall have a high value and thus takes into account the tradeoff just described.</li>
                </ul>
                <h1 class="section-heading">Hands-on chart</h1>
                <p>
                    This is all you need to know about the confusion matrix and its metrics. The following d3.js chart visualizes the distinction between TN, FP, FN and TP, the calculation of the metrics and the tradeoff between precision and recall.
                </p>
                <p>
                    First, let me say a word about what's happening under the hood and how it works. I've taken care of the model building in advance since we're only interested in the evaluation part using the confusion matrix. The underlying model is a standard random forest, nothing too fancy, the only thing I've tweaked are the <code>n_estimators</code>, <code>min_samples_leaf</code> and <code>max_depth</code> hyperparameters to avoid overfitting. I've trained the random forest on the entire training dataset (60,000 images) and used it to predict the probabilities on the entire test set (10,000 images). As a result, each test instance has a probability referring to wheter it is a handwritten five or not. A predicted probability close to one means that the random forest is really certain that the underlying instance is a five, while a prediction close to zero indicates that it's most probably not a five.
                </p>
                <p>
                    This is where the cutoff slider on the left hand side of the chart becomes important. As soon as you change the slider value you modify the cutoff value at which a prediction will count as a positive one. For example, assume the current cutoff value is 0.5 and you have a test instance with a probability of 0.6. In this case the prediction is that the instance is a five. However, if you change the cutoff value to 0.7 the prediction will change to not being a five. This is because only test instances with predicted probabilities greater equal than 0.7 are classified as fives. Simply said, the higher the cutoff value the more certain the algorithm must be for a test instance to be classified as a five.
                </p>
                <p>
                    Hence, modifying the cutoff value changes the predictions and as a consequence also the confusion matrix and its metrics. Pay close attention to the four metrics on the right hand side while moving the cutoff slider. One last word on the visualization as you might recognize that the numbers within the metrics calculation don't add up with the circles in the plot. The reason for this is that the metrics computation includes the entire test set, while I've limited the visualization to 500 test instances. Visualizing and transitioning the entire test set would result in 10,000 moving circles, which would make the entire chart extremely messy and would probably also crash your browser. However, to have an unbiased chart I've implemented the functionality to receive a fresh set of 500 test instances. Just click the <code>shuffle</code> button in the chart. Also make sure to use the tooltip to get more insights like the actual MNIST image, the predicted probability or the true label 🙂.
                </p>
                </div>
                
                <Chart1 />

                <div id="master-container" class="col-md-10 col-lg-10 col-xl-8">
                    <hr>
                    <p style="text-align: center;">
                        💡 Check out the source code on <a href="https://github.com/pstuerner/philippstuerner/blob/master/services/frontend/src/components/posts/confusion_matrix/Chart1.vue" target="_blank">GitHub <i class="fab fa-github"></i></a>!
                    </p>
                    <hr>
                    <p>
                        Feel free to play around with the cutoff slider. Can you spot any obvious patterns when the cutoff value is close to zero or one? How does it affect the true/false negatives and positives? What's the impact on the right hand side metrics? What's the optimal threshold for a really good F1 score? Give those questions a thought. You can click on the collapsed items below to see what my closing thoughts are.
                    </p>
                    <div id="accordion">
                        <div class="card">
                            <div class="card-header" id="headingOne" style="background-color: transparent;">
                                <h5 class="mb-0">
                                    <button class="accordion-button collapsed" data-toggle="collapse" data-target="#collapseOne"
                                        aria-expanded="true" aria-controls="collapseOne">
                                        The conservative cutoff
                                    </button>
                                </h5>
                            </div>

                            <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                <div class="card-body">
                                    The larger the threshold, the more certain the algorithm must be to predict a five. The algorithm becomes more conservative which leads to many false negatives, few false positives, high precision and low recall.
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingTwo" style="background-color: transparent;">
                                <h5 class="mb-0">
                                    <button class="accordion-button collapsed" data-toggle="collapse" data-target="#collapseTwo"
                                        aria-expanded="false" aria-controls="collapseTwo">
                                        The aggressive cutoff
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                <div class="card-body">
                                    The smaller the threshold, the more uncertain the algorithm can be to predict a five. The algorithm becomes more aggressive which leads to many false positives, few false negatives, high recall and low precision.
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingThree" style="background-color: transparent;">
                                <h5 class="mb-0">
                                    <button class="accordion-button collapsed" data-toggle="collapse" data-target="#collapseThree"
                                        aria-expanded="false" aria-controls="collapseThree">
                                        The sweet spot
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                                <div class="card-body">
                                    A high F1 score is somewhere in the middle.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import { useMeta } from 'vue-meta'
import { onMounted, getCurrentInstance } from "vue";
import ToTopButton from '../../ToTopButton.vue';
import TableOfContent from '@/components/TableOfContent.vue';
import Chart1 from '@/components/posts/confusion_matrix/Chart1.vue'

export default {
    data () {
        return {
            title: "Confusion Matrix",
            title_meta: "Confusion Matrix",
            subheading: "Unconfusing the confusion matrix using d3.js and a simple MNIST classifier",
            img: "confusionmatrix_header.jpg"
        }
    },
    mounted() {
        MathJax.typesetPromise().then(() => {
            MathJax.typesetPromise();
        });
    },
    setup 
    () {
        onMounted(() => {
            useMeta({
                title: getCurrentInstance().data.title,
            })
        })
    },
    computed: {
        mastheadStyle() {
            return {
                'background-image': 'url(' + require(`@/assets/img/${this.img}`) + ')',
                'height': 'calc(20rem + 57px)',
                'width': '100%'
            }
        }
    },
    components: {
        ToTopButton,
        TableOfContent,
        Chart1
    }
}
</script>

<style scoped>
</style>
