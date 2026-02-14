import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

np.random.seed(42)

num_transactions = 10000
fraud_ratio = 0.04  # 4% fraud

countries = ["US", "UK", "DE", "FR", "NG", "IN", "BR"]
devices = ["mobile", "desktop", "tablet"]

data = []

start_date = datetime(2025, 1, 1)

for i in range(num_transactions):
    user_id = random.randint(1000, 5000)
    amount = np.random.normal(80, 30)
    timestamp = start_date + timedelta(minutes=i*5)
    country = random.choice(countries)
    device = random.choice(devices)
    velocity = np.random.randint(1, 5)

    is_fraud = 0

    # Inject fraud patterns
    if random.random() < fraud_ratio:
        amount *= np.random.uniform(3, 6)  # unusually large amount
        country = random.choice(["NG", "BR"])  # high risk region
        velocity = np.random.randint(5, 10)
        is_fraud = 1

    data.append([
        i,
        user_id,
        abs(round(amount, 2)),
        timestamp,
        country,
        device,
        velocity,
        is_fraud
    ])

df = pd.DataFrame(data, columns=[
    "transaction_id",
    "user_id",
    "amount",
    "timestamp",
    "country",
    "device",
    "velocity",
    "is_fraud"
])

df.to_csv("transactions.csv", index=False)
print("Dataset generated successfully!")
