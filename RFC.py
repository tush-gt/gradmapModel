import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OrdinalEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.compose import ColumnTransformer
import time
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_curve, auc, precision_recall_curve


def load_and_create_dataset(file_name):
    try:
        df = pd.read_csv(file_name)
        df['percentile'] = pd.to_numeric(df['percentile'], errors='coerce')
        df.dropna(subset=['percentile', 'branch', 'gender', 'category', 'college_name'], inplace=True)

        print(f"Loaded {len(df)} 'Admitted' (Positive) samples.")
        df_positive = df[['college_name', 'branch', 'gender', 'category', 'percentile']].copy()
        df_positive['admitted'] = 1
        print("Generating 'Rejected' (Negative) samples...")
        df_cutoffs = df.groupby(['college_name', 'branch', 'gender', 'category'])['percentile'].min().reset_index()


        df_negative = df_cutoffs.copy()

        df_negative['percentile'] = df_negative['percentile'] - 0.1
        df_negative['admitted'] = 0

        df_negative = df_negative[df_negative['percentile'] > 0]

        print(f"Generated {len(df_negative)} 'Rejected' (Negative) samples.")

        df_full = pd.concat([df_positive, df_negative])

        df_full = df_full.sample(frac=1, random_state=42).reset_index(drop=True)

        print(f"Created final training dataset with {len(df_full)} samples.")
        return df_full

    except FileNotFoundError:
        print(f"Error: File not found at {file_name}")
        return None
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def train_binary_classifier(df):
    if df is None or df.empty:
        print("Cannot train model on empty data.")
        return None, None

    # Features (X) and Target (y)
    features = ['college_name', 'branch', 'gender', 'category', 'percentile']
    target = 'admitted'

    X = df[features]
    y = df[target]

    # 2. encodersss
    categorical_features = ['college_name', 'branch', 'gender', 'category']
    numeric_features = ['percentile']

    # transformerr bhii
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', numeric_features),
            ('cat', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1), categorical_features)
        ],
        remainder='drop'
    )

    # feature encoder se data split
    print("Applying encoders and splitting data...")
    X_transformed = preprocessor.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_transformed, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training model on {len(X_train)} samples, testing on {len(X_test)} samples.")

    # 4. Train the Model
    print("Training RFC")
    start_time = time.time()

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1,
        min_samples_leaf=5
    )
    model.fit(X_train, y_train)

    end_time = time.time()
    print(f"Model training complete in {end_time - start_time:.2f} seconds.")

    # CR for accuracy
    print("Evaluating model")
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))

    y_prob = model.predict_proba(X_test)[:, 1]
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc = auc(fpr, tpr)

    plt.figure(figsize=(6, 5))
    plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
    plt.plot([0, 1], [0, 1], "k--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend(loc="lower right")
    plt.show()

    # Return the trained model and the encoders
    return model, preprocessor


def predict_top_5(user_percentile, user_branch, user_gender, user_category, model, preprocessor, df_full):
    print("\nStarting Top 5 Prediction")

    # 1. unique collges according to input
    all_colleges = df_full['college_name'].unique()
    num_colleges = len(all_colleges)

    print(f"Evaluating admission probability for {num_colleges} colleges...")

    # now college score
    predict_df = pd.DataFrame({
        'college_name': all_colleges,
        'branch': [user_branch] * num_colleges,
        'gender': [user_gender] * num_colleges,
        'category': [user_category] * num_colleges,
        'percentile': [user_percentile] * num_colleges
    })

    # 3. Transform this data
    X_predict_transformed = preprocessor.transform(predict_df)
    probs = model.predict_proba(X_predict_transformed)[:, 1]
    predict_df['probability'] = probs

    #probability (descending) and get top 5
    top_5 = predict_df.sort_values(by='probability', ascending=False).head(5)

    print("\nTop 5 College Predictions")

    for i, row in enumerate(top_5.itertuples(), 1):
        print(f"{i}. {row.college_name}")
        print(f"   (Predicted Probability: {row.probability * 100:.2f}%)")





if __name__ == "__main__":
    file_name = 'kaggle_sw_raw.csv'
    df_full = load_and_create_dataset(file_name)

    if df_full is not None:
        model, preprocessor = train_binary_classifier(df_full)
        if model:
            print("\n--- Model Ready: College Prediction ---")
            try:
                user_percentile = float(input("Enter CET %ile (2 decs): "))
            except ValueError:
                print("Invalid percentile. Please enter a number (e.g., 85.5).")
                exit()  # Exit the script

            user_gender = input("Enter your gender ('F' / 'M'): ")
            user_category = input("Enter your category ('OPEN', 'OBC', 'SC'): ")
            user_branch = input("Enter your preferred branch ('Computer Engineering', etc): ")

            print(
                f"\nCalculating predictions for:\n Percentile: {user_percentile}\n Gender: {user_gender}\n Category: {user_category}\n Branch: {user_branch}")

            predict_top_5(
                user_percentile=user_percentile,
                user_branch=user_branch,
                user_gender=user_gender,
                user_category=user_category,
                model=model,
                preprocessor=preprocessor,
                df_full=df_full  # Pass the full df to get college list
            )
