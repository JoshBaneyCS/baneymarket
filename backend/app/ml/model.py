import torch
from torch import nn

class LSTMStockModel(nn.Module):
    def __init__(self, input_size=5, hidden_size=64, num_layers=2, output_size=1):
        super(LSTMStockModel, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])  # Take output at last time step
        return out

def load_model(model_path: str) -> LSTMStockModel:
    model = LSTMStockModel()
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

def predict_price(model: LSTMStockModel, recent_data):
    """
    recent_data: a numpy array or list shaped like [1, sequence_length, input_size]
    where input_size corresponds to features (e.g., OHLCV).
    """
    with torch.no_grad():
        input_tensor = torch.tensor(recent_data, dtype=torch.float32)
        pred = model(input_tensor).item()
    return pred
