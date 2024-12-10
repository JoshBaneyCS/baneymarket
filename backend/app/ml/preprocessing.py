import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def load_historical_data(csv_path: str):
    """
    Load historical stock data from a CSV file.
    The CSV is assumed to have a datetime index and columns like:
    Date, Open, High, Low, Close, Volume
    """
    df = pd.read_csv(csv_path, parse_dates=["Date"], index_col="Date")
    # Sort by date just in case it's not already sorted
    df.sort_index(inplace=True)
    return df

def prepare_data_for_training(df: pd.DataFrame, sequence_length=60, features=["Open", "High", "Low", "Close", "Volume"]):
    """
    Prepare data for LSTM training.
    df: DataFrame containing OHLCV data.
    sequence_length: number of days to look back for each training sample.
    features: columns to use as input features.

    Returns X, y, and scaler objects.
    X shape: (num_samples, sequence_length, num_features)
    y shape: (num_samples,)
    """
    # Extract the feature set
    data = df[features].values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    X = []
    y = []
    for i in range(sequence_length, len(scaled_data)):
        X.append(scaled_data[i-sequence_length:i])
        # For price prediction, let's predict the closing price next day
        y.append(scaled_data[i][features.index("Close")])  

    X = np.array(X)
    y = np.array(y)
    return X, y, scaler

def prepare_recent_data(df: pd.DataFrame, scaler: MinMaxScaler, sequence_length=60, features=["Open", "High", "Low", "Close", "Volume"]):
    """
    Prepares the most recent sequence_length days of data for prediction.
    """
    data = df[features].values
    scaled_data = scaler.transform(data)
    recent_sequence = scaled_data[-sequence_length:]
    recent_sequence = np.expand_dims(recent_sequence, axis=0)
    return recent_sequence
