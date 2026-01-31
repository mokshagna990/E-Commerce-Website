# ===============================
# sales_prediction_model.py
# ===============================

import pandas as pd
import pickle
from pymongo import MongoClient
from datetime import datetime
from sklearn.linear_model import LinearRegression

# -------------------------------
# 1. Connect to MongoDB
# -------------------------------

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "elegancia"
COLLECTION_NAME = "user_history"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# -------------------------------
# 2. Load data from MongoDB
# -------------------------------

data = list(collection.find())

if len(data) == 0:
    print("❌ No data found in MongoDB collection.")
    exit()

df = pd.DataFrame(data)

# -------------------------------
# 3. Preprocess the data
# -------------------------------

df['timestamp'] = pd.to_datetime(df['timestamp'], format='%d-%m-%Y')
df['year'] = df['timestamp'].dt.year
df['month'] = df['timestamp'].dt.month

# -------------------------------
# 4. Group by Category, Year, Month
# -------------------------------

grouped = df.groupby(['category', 'year', 'month']).agg({'price': 'sum'}).reset_index()

# -------------------------------
# 5. Train Linear Regression Model
# -------------------------------

X = grouped[['year', 'month']]
y = grouped['price']

model = LinearRegression()
model.fit(X, y)

# Save model
with open('sales_predictor.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model trained and saved successfully")

# -------------------------------
# 6. Predict Future Sales (Next Year)
# -------------------------------

future = []

for cat in grouped['category'].unique():
    for month in range(1, 13):
        future.append({'category': cat, 'year': datetime.now().year + 1, 'month': month})

future_df = pd.DataFrame(future)
future_df['predicted_sales'] = model.predict(future_df[['year', 'month']])

# -------------------------------
# ✅ 7. Aggregate Predictions by Category
# -------------------------------

# This is the key fix for your chart
category_prediction = future_df.groupby('category')['predicted_sales'].sum().reset_index()

# -------------------------------
# ✅ 8. Save the Aggregated Predictions
# -------------------------------

category_prediction.to_json('predicted_sales.json', orient='records')

print("✅ Aggregated Predictions saved successfully")

# -------------------------------
# Optional: Close MongoDB connection
# -------------------------------

client.close()
