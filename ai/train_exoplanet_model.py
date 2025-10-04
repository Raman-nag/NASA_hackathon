#!/usr/bin/env python3
"""
NASA Exoplanet AI - Model Training Script
=========================================

This script loads the NASA Exoplanet Archive dataset, explores it,
and trains a Random Forest classifier for exoplanet classification.

Features used:
- koi_period: Orbital period (days)
- koi_duration: Transit duration (hours) 
- koi_prad: Planetary radius (Earth radii)
- koi_depth: Transit depth (ppm)
- koi_steff: Stellar effective temperature (K)
- koi_srad: Stellar radius (Solar radii)
- koi_slogg: Stellar surface gravity (log10(cm/s^2))

Target: koi_disposition (CONFIRMED, CANDIDATE, FALSE POSITIVE)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.metrics import precision_recall_fscore_support
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

def load_and_explore_data(csv_path):
    """Load the CSV dataset and perform initial exploration."""
    print("Loading NASA Exoplanet Archive dataset...")
    
    # Load the CSV file, skipping comment lines
    df = pd.read_csv(csv_path, comment='#')
    
    print(f"Dataset loaded successfully!")
    print(f"   Shape: {df.shape}")
    print(f"   Columns: {len(df.columns)}")
    
    # Display basic info
    print("\nDataset Info:")
    print(f"   Memory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
    print(f"   Missing values: {df.isnull().sum().sum()}")
    
    # Show column names
    print("\nAvailable columns:")
    for i, col in enumerate(df.columns, 1):
        print(f"   {i:2d}. {col}")
    
    # Show first few rows
    print("\nFirst 5 rows:")
    print(df.head())
    
    # Show target distribution
    print("\nTarget distribution (koi_disposition):")
    target_counts = df['koi_disposition'].value_counts()
    print(target_counts)
    print(f"\n   Total samples: {len(df)}")
    print(f"   Confirmed: {target_counts.get('CONFIRMED', 0)} ({target_counts.get('CONFIRMED', 0)/len(df)*100:.1f}%)")
    print(f"   Candidate: {target_counts.get('CANDIDATE', 0)} ({target_counts.get('CANDIDATE', 0)/len(df)*100:.1f}%)")
    print(f"   False Positive: {target_counts.get('FALSE POSITIVE', 0)} ({target_counts.get('FALSE POSITIVE', 0)/len(df)*100:.1f}%)")
    
    return df

def prepare_features_and_target(df):
    """Prepare features and target for machine learning."""
    print("\nPreparing features and target...")
    
    # Define feature columns (key exoplanet characteristics)
    feature_columns = [
        'koi_period',      # Orbital period (days)
        'koi_duration',    # Transit duration (hours)
        'koi_prad',        # Planetary radius (Earth radii)
        'koi_depth',       # Transit depth (ppm)
        'koi_steff',       # Stellar effective temperature (K)
        'koi_srad',        # Stellar radius (Solar radii)
        'koi_slogg'        # Stellar surface gravity (log10(cm/s^2))
    ]
    
    # Check which features are available
    available_features = [col for col in feature_columns if col in df.columns]
    missing_features = [col for col in feature_columns if col not in df.columns]
    
    print(f"   Available features: {available_features}")
    if missing_features:
        print(f"   Missing features: {missing_features}")
    
    # Select features and target
    X = df[available_features].copy()
    y = df['koi_disposition'].copy()
    
    print(f"   Selected {len(available_features)} features")
    print(f"   Feature names: {available_features}")
    
    # Handle missing values
    print(f"\nMissing values in features:")
    missing_counts = X.isnull().sum()
    for col, count in missing_counts.items():
        if count > 0:
            print(f"   {col}: {count} ({count/len(X)*100:.1f}%)")
    
    # Fill missing values with median for numerical features
    X = X.fillna(X.median())
    
    print(f"   Missing values after filling: {X.isnull().sum().sum()}")
    
    # Show feature statistics
    print(f"\nFeature statistics:")
    print(X.describe())
    
    return X, y, available_features

def encode_target(y):
    """Encode target labels numerically."""
    print("\n🏷️  Encoding target labels...")
    
    # Create label encoder
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Show mapping
    print("   Label mapping:")
    for i, label in enumerate(label_encoder.classes_):
        print(f"   {i}: {label}")
    
    print(f"   Encoded target shape: {y_encoded.shape}")
    print(f"   Unique values: {np.unique(y_encoded)}")
    
    return y_encoded, label_encoder

def split_and_scale_data(X, y_encoded, test_size=0.2, random_state=42):
    """Split data into train/test sets and scale features."""
    print(f"\n✂️  Splitting data (train: {1-test_size:.0%}, test: {test_size:.0%})...")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=test_size, random_state=random_state, stratify=y_encoded
    )
    
    print(f"   Training set: {X_train.shape[0]} samples")
    print(f"   Test set: {X_test.shape[0]} samples")
    
    # Scale features
    print("\n📏 Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print(f"   Features scaled using StandardScaler")
    print(f"   Training set shape: {X_train_scaled.shape}")
    print(f"   Test set shape: {X_test_scaled.shape}")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler

def train_random_forest(X_train, y_train, random_state=42):
    """Train a Random Forest classifier."""
    print("\n🌲 Training Random Forest classifier...")
    
    # Create and train the model
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=random_state,
        n_jobs=-1
    )
    
    rf_model.fit(X_train, y_train)
    
    print(f"   Model trained successfully!")
    print(f"   Number of trees: {rf_model.n_estimators}")
    print(f"   Max depth: {rf_model.max_depth}")
    print(f"   Features used: {X_train.shape[1]}")
    
    return rf_model

def evaluate_model(model, X_test, y_test, label_encoder):
    """Evaluate the trained model."""
    print("\n📊 Evaluating model performance...")
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"   Overall Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Classification report
    print(f"\n📋 Classification Report:")
    class_names = label_encoder.classes_
    report = classification_report(y_test, y_pred, target_names=class_names, digits=4)
    print(report)
    
    # Confusion matrix
    print(f"\n🔢 Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(cm)
    
    # Feature importance
    print(f"\n⭐ Feature Importance:")
    feature_importance = model.feature_importances_
    for i, importance in enumerate(feature_importance):
        print(f"   Feature {i+1}: {importance:.4f}")
    
    return accuracy, y_pred

def save_model_and_artifacts(model, scaler, label_encoder, feature_names, accuracy):
    """Save the trained model and preprocessing artifacts."""
    print("\n💾 Saving model and artifacts...")
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Save model
    model_path = 'models/exoplanet_classifier.pkl'
    joblib.dump(model, model_path)
    print(f"   Model saved to: {model_path}")
    
    # Save scaler
    scaler_path = 'models/scaler.pkl'
    joblib.dump(scaler, scaler_path)
    print(f"   Scaler saved to: {scaler_path}")
    
    # Save label encoder
    encoder_path = 'models/label_encoder.pkl'
    joblib.dump(label_encoder, encoder_path)
    print(f"   Label encoder saved to: {encoder_path}")
    
    # Save model metadata
    metadata = {
        'model_type': 'RandomForestClassifier',
        'accuracy': accuracy,
        'feature_names': feature_names,
        'n_features': len(feature_names),
        'n_estimators': model.n_estimators,
        'max_depth': model.max_depth,
        'classes': label_encoder.classes_.tolist()
    }
    
    import json
    metadata_path = 'models/model_metadata.json'
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"   Metadata saved to: {metadata_path}")
    
    print(f"\n✅ All artifacts saved successfully!")

def create_visualizations(X, y_encoded, label_encoder, feature_names):
    """Create visualizations of the dataset and model performance."""
    print("\n📈 Creating visualizations...")
    
    # Set up the plotting style
    plt.style.use('default')
    sns.set_palette("husl")
    
    # Create a figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('NASA Exoplanet Dataset Analysis', fontsize=16, fontweight='bold')
    
    # 1. Target distribution
    ax1 = axes[0, 0]
    class_counts = np.bincount(y_encoded)
    class_names = label_encoder.classes_
    bars = ax1.bar(class_names, class_counts, color=['#2E8B57', '#FF8C00', '#DC143C'])
    ax1.set_title('Target Distribution')
    ax1.set_ylabel('Count')
    ax1.tick_params(axis='x', rotation=45)
    
    # Add value labels on bars
    for bar, count in zip(bars, class_counts):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50,
                f'{count}', ha='center', va='bottom', fontweight='bold')
    
    # 2. Feature correlation heatmap
    ax2 = axes[0, 1]
    X_df = pd.DataFrame(X, columns=feature_names)
    correlation_matrix = X_df.corr()
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, ax=ax2)
    ax2.set_title('Feature Correlation Matrix')
    
    # 3. Orbital period vs Planetary radius scatter plot
    ax3 = axes[1, 0]
    scatter = ax3.scatter(X[:, 0], X[:, 2], c=y_encoded, cmap='viridis', alpha=0.6)
    ax3.set_xlabel('Orbital Period (days)')
    ax3.set_ylabel('Planetary Radius (Earth radii)')
    ax3.set_title('Orbital Period vs Planetary Radius')
    ax3.set_yscale('log')
    
    # 4. Transit duration distribution by class
    ax4 = axes[1, 1]
    for i, class_name in enumerate(class_names):
        class_mask = y_encoded == i
        ax4.hist(X[class_mask, 1], alpha=0.7, label=class_name, bins=30)
    ax4.set_xlabel('Transit Duration (hours)')
    ax4.set_ylabel('Frequency')
    ax4.set_title('Transit Duration Distribution by Class')
    ax4.legend()
    ax4.set_yscale('log')
    
    plt.tight_layout()
    
    # Save the plot
    plot_path = 'models/dataset_analysis.png'
    plt.savefig(plot_path, dpi=300, bbox_inches='tight')
    print(f"   Visualization saved to: {plot_path}")
    
    plt.show()

def main():
    """Main function to run the complete training pipeline."""
    print("🌟 NASA Exoplanet AI - Model Training Pipeline")
    print("=" * 50)
    
    # File path
    csv_path = 'cumulative_2025.10.04_03.33.35.csv'
    
    try:
        # Step 1: Load and explore data
        df = load_and_explore_data(csv_path)
        
        # Step 2: Prepare features and target
        X, y, feature_names = prepare_features_and_target(df)
        
        # Step 3: Encode target labels
        y_encoded, label_encoder = encode_target(y)
        
        # Step 4: Split and scale data
        X_train, X_test, y_train, y_test, scaler = split_and_scale_data(X, y_encoded)
        
        # Step 5: Train Random Forest
        model = train_random_forest(X_train, y_train)
        
        # Step 6: Evaluate model
        accuracy, y_pred = evaluate_model(model, X_test, y_test, label_encoder)
        
        # Step 7: Save model and artifacts
        save_model_and_artifacts(model, scaler, label_encoder, feature_names, accuracy)
        
        # Step 8: Create visualizations
        create_visualizations(X, y_encoded, label_encoder, feature_names)
        
        print("\n🎉 Training pipeline completed successfully!")
        print(f"   Final accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        print(f"   Model saved in 'models/' directory")
        
    except Exception as e:
        print(f"\n❌ Error during training: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
