import pandas as pd

def load_product_data(csv_path):
    df = pd.read_csv(csv_path)
    return df
