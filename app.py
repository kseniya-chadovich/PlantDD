from flask import Flask, request, jsonify, render_template
import torch
from torchvision import models, transforms
from PIL import Image
import io


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device: {device}")


def load_test_model():
    model = models.resnet50(pretrained=True)
    model.fc = torch.nn.Linear(model.fc.in_features, 15)
    model = model.to(device)
    model.eval()
    return model


model = load_test_model()


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('modelPg.html') 

@app.route('/predict', methods=['POST'])
def predict():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    
    img = Image.open(file.stream).convert('RGB')
    img = transform(img).unsqueeze(0).to(device)

    
    with torch.no_grad():
        outputs = model(img)
        _, predicted_class = torch.max(outputs, 1)

    disease_names = ['Alphid', 'Black Rust', 'Blast', 'Brown Rust', 'Common root Rot',  
                     'Fusarium Head Blight', 'Healthy', 'Leaf Blight', 'Mildew', 'Mite',
                     'Septoria', 'Smut', 'Stemfly', 'Tanspot', 'Yellow Rust']
    
    predicted_disease = disease_names[predicted_class.item()]
    return jsonify({'predicted_disease': predicted_disease})

if __name__ == '__main__':
    app.run(debug=True)
