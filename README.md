INTRODUCTION      : 

WHEAT-HELP is a web application designed to detect diseases in wheat plants. 
Users can upload an image of wheat plant, and the app will identify if the 
plant is diseased, along with the name of the disease. 


FRONT-END         : 


BACK-END          :


MODEL INFORMATION :

Architecture      : The model uses ResNet-50 architecture, which is a deep convolutional 
neural network pre-trained on ImageNet. 
Transfer Learning : The model utilizes pretrained weights for feature extraction, allowing
it to leverage learned features from a large dataset.
Fine tuned to the 15 classes in the data set.
CrossEntropyLoss to account for multi-class classification.
Optimizer used is Adam.
