import numpy as np
from sklearn.datasets import fetch_openml

mnist = fetch_openml("mnist_784", version=1, cache=True, as_frame=False)
mnist.target = mnist.target.astype(np.int8)
