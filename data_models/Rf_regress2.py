import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OrdinalEncoder
from sklearn.model_selection import train_test_split
# Import metrics for regression
from sklearn.metrics import mean_absolute_error, r2_score
import time


def load_and_preprocess_data(file_name):
    """
    Loads and preprocesses the data for model training.
    """
    try:
        df = pd.read_csv(file_name)
        df['percentile'] = pd.to_numeric(df['percentile'], errors='coerce')
        df.dropna(subset=['percentile', 'branch', 'gender', 'category', 'college_name'], inplace=True)
        print("Data loaded. Aggregating to find cutoffs...")
        df_agg = df.groupby(['college_name', 'branch', 'gender', 'category'])['percentile'].min().reset_index()
        print(f"Aggregated data to {len(df_agg)} unique cutoff entries.")
        return df_agg
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def train_model(df_agg):
    """
    Trains the Random Forest Regressor and the Ordinal Encoder.
    NOW INCLUDES train/test split for model evaluation.
    """
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

    # 2. --- NEW: Split the data for evaluation ---
    print("Splitting data into training and testing sets for evaluation...")
    X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

    print(f"Training evaluation model on {len(X_train)} samples...")
    eval_model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1, min_samples_leaf=5)
    eval_model.fit(X_train, y_train)

    # 3. --- NEW: Evaluate the model and print regression metrics ---
    print("Evaluating model performance on test set...")
    y_pred = eval_model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("\n--- MODEL EVALUATION REPORT (REGRESSION) ---")
    print(f"  Mean Absolute Error (MAE): {mae:.4f}")
    print(f"  R-squared (R2 Score):      {r2:.4f}")
    print("----------------------------------------------")
    print(f"Interpretation: The model's percentile predictions are, on average, off by ~{mae:.2f} points.")
    print(f"Interpretation: The model can explain {r2 * 100:.2f}% of the variance in percentile cutoffs.\n")

    # 4. --- Train the FINAL model on 100% of the data ---
    print("Training final prediction model on 100% of the data...")
    start_time = time.time()

    final_model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1, min_samples_leaf=5)
    final_model.fit(X_encoded, y)  # Fit on ALL data

    end_time = time.time()
    print(f"Final model training complete in {end_time - start_time:.2f} seconds.")

    # Return the FINAL model and the encoder
    return final_model, encoder


def predict_colleges_rf(user_percentile, user_gender, user_category, user_branch, model, encoder, df_agg):
    """
    Uses the trained model to predict eligible colleges.
    (This function remains the same)
    """
    print("\nStarting prediction...")
    try:
        all_colleges_offering_branch = df_agg[df_agg['branch'].str.upper() == user_branch.upper()][
            'college_name'].unique()

        if len(all_colleges_offering_branch) == 0:
            print(f"No colleges found in the dataset that offer '{user_branch}'.")
            return []

        print(f"Found {len(all_colleges_offering_branch)} colleges offering '{user_branch}'. Evaluating...")

        prediction_df = pd.DataFrame({
            'college_name': all_colleges_offering_branch,
            'branch': [user_branch] * len(all_colleges_offering_branch),
            'gender': [user_gender] * len(all_colleges_offering_branch),
            'category': [user_category] * len(all_colleges_offering_branch)
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
    Main function to run the complete process with user input.
    """
    file_name = 'kaggle_sw_raw.csv'

    # --- Training Phase ---
    df_agg = load_and_preprocess_data(file_name)
    if df_agg is None:
        return

    model, encoder = train_model(df_agg)
    if model is None:
        return

    print("\n--- Model Ready: College Prediction Simulation (Random Forest) ---")
    print("Disclaimer: This is a simulation based on past data and not a guarantee of admission.\n")

    # --- Prediction Phase (User Input) ---
    try:
        user_percentile = float(input("Enter your MHT-CET percentile (e.g., 90.12): "))
    except ValueError:
        print("Invalid percentile. Please enter a number (e.g., 85.5).")
        return

    user_gender = input("Enter your gender (e.g., 'F' or 'M'): ")
    user_category = input("Enter your category (e.g., 'OPEN', 'OBC', 'SC', 'NT 2 (NT-C)'): ")
    user_branch = input("Enter your preferred branch (e.g., 'Civil Engineering'): ")

    print(
        f"\nCalculating predictions for:\n Percentile: {user_percentile}\n Gender: {user_gender}\n Category: {user_category}\n Branch: {user_branch}")

    predictions = predict_colleges_rf(user_percentile, user_gender, user_category, user_branch, model, encoder, df_agg)

    if predictions:
        print("\n--- Top 5 College Predictions (from Random Forest Model) ---")
        for i, college in enumerate(predictions, 1):
            print(f"{i}. {college}")
    else:
        print("\n--- No Matches Found ---")
        print("The model could not find any colleges matching your criteria where your")
        print("percentile is at or above the predicted cutoff.")


if __name__ == "__main__":
    main()