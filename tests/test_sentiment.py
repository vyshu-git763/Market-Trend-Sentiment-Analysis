# test_sentiment.py
from transformers import pipeline

print("Testing sentiment analysis with DistilBERT...")

# Create sentiment analyzer
sentiment_pipeline = pipeline("sentiment-analysis", 
                             model="distilbert-base-uncased-finetuned-sst-2-english")

# Test sentences
test_sentences = [
    "This product is amazing! I love it.",
    "Terrible quality, waste of money.",
    "It's okay, nothing special.",
    "Excellent value for the price."
]

print("\nAnalyzing test sentences:")
for sentence in test_sentences:
    result = sentiment_pipeline(sentence)[0]
    print(f"  '{sentence[:30]}...' → {result['label']} ({result['score']:.1%})")

print("\n✅ Transformers working correctly!")