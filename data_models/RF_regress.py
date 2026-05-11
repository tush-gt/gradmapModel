import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OrdinalEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import time


def load_and_preprocess_data(file_name):
    try:
        df = pd.read_csv("kaggle_sw_raw.csv")

        df['percentile'] = pd.to_numeric(df['percentile'], errors='coerce')
        df.dropna(subset=['percentile', 'branch', 'gender', 'category', 'college_name'], inplace=True)

        print("Data loaded. Aggregating to find cutoffs...")
        df_agg = df.groupby(['college_name', 'branch', 'gender', 'category'])['percentile'].min().reset_index()
        print(f"Aggregated data to {len(df_agg)} unique cutoff entries.")
        return df_agg

    except FileNotFoundError:
        print(f"Error: File not found at {file_name}")
        return None
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def train_model(df_agg):
    if df_agg is None or df_agg.empty:
        print("Cannot train model on empty data.")
        return None, None

    features = ['college_name', 'branch', 'gender', 'category']
    target = 'percentile'

    X = df_agg[features]
    y = df_agg[target]

    # 1. Initialize and fit the Encoder
    print("Fitting feature encoder...")
    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    X_encoded = encoder.fit_transform(X)

    # 2. Initialize and fit the Model
    print("Training RF")
    start_time = time.time()

    model = RandomForestRegressor(n_estimators=100,
                                  random_state=42,
                                  n_jobs=-1,
                                  min_samples_leaf=5)
    model.fit(X_encoded, y)

    end_time = time.time()
    print(f"Model training complete in {end_time - start_time:.2f} seconds.")

    return model, encoder


def predict_colleges_rf(user_percentile, user_gender, user_category, user_branch, model, encoder, df_agg):
    print("\nStarting prediction...")
    try:
        # 1. Find all unique colleges that offer the user's preferred branch
        all_colleges_offering_branch = df_agg[df_agg['branch'].str.upper() == user_branch.upper()][
            'college_name'].unique()

        if len(all_colleges_offering_branch) == 0:
            print(f"No colleges found in the dataset that offer '{user_branch}'.")
            return []

        print(f"Found {len(all_colleges_offering_branch)} colleges offering '{user_branch}'. Evaluating...")

        num_colleges = len(all_colleges_offering_branch)
        prediction_df = pd.DataFrame({
            'college_name': all_colleges_offering_branch,
            'branch': [user_branch] * num_colleges,
            'gender': [user_gender] * num_colleges,
            'category': [user_category] * num_colleges
        })

        X_to_predict_encoded = encoder.transform(prediction_df)

        predicted_cutoffs = model.predict(X_to_predict_encoded)
        prediction_df['predicted_cutoff'] = predicted_cutoffs

        eligible_colleges = prediction_df[prediction_df['predicted_cutoff'] <= user_percentile]

        sorted_eligible = eligible_colleges.sort_values(by='predicted_cutoff', ascending=False)

        return list(sorted_eligible['college_name'].head(5))


    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        return []


def main():
    """
    Main function to run the complete process.
    """
    file_name = 'kaggle_sw_raw.csv'

    # --- Training Phase ---
    df_agg = load_and_preprocess_data(file_name)
    if df_agg is None:
        return

    model, encoder = train_model(df_agg)
    if model is None:
        return

    print("\nModel Ready!")
    try:
        user_percentile = float(input("Enter your CET percentile(upto 2 dec): "))
    except ValueError:
        print("Invalid percentile.")
        return

    user_gender = input("Enter your gender ('F' / 'M'): ")
    user_category = input("Enter your category ('OPEN', 'OBC', 'SC', 'NT 2 (NT-C)'): ")
    user_branch = input("Enter your preferred branch ('Civil Engineering','Computer Engineering'): ")

    print(
        f"\nUser input:\n Percentile: {user_percentile}\n Gender: {user_gender}\n Category: {user_category}\n Branch: {user_branch}")

    predictions = predict_colleges_rf(user_percentile, user_gender, user_category, user_branch, model, encoder, df_agg)

    if predictions:
        print("\nTop 5 College Predictions")
        print("(ranked by the highest predicted cutoff you meet):\n")
        for i, college in enumerate(predictions, 1):
            print(f"{i}. {college}")
    else:
        print("\nNo Matches Found based on your input criteria")
        print("Try checking for typos or broadening your search.")


if __name__ == "__main__":
    main()