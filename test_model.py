import torch
from torchvision import models, transforms
from PIL import Image


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device: {device}")


def load_test_model():
    model = models.resnet50(pretrained=True)  # Using a pretrained ResNet50 for testing
    model.fc = torch.nn.Linear(model.fc.in_features, 15)  # Adjust final layer for 15 classes (example)
    model = model.to(device)  # Move the model to GPU
    model.eval()  # Set the model to evaluation mode
    return model


model = load_test_model()


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])


def test_inference():
    
    img = torch.randn(1, 3, 224, 224)  # Simulating a batch of 1 RGB image
    img = img.to(device)  # Move image to GPU

    
    with torch.no_grad():
        outputs = model(img)
        _, predicted_class = torch.max(outputs, 1)

    print(f"Predicted Class Index: {predicted_class.item()}")


if __name__ == "__main__":
    test_inference()
