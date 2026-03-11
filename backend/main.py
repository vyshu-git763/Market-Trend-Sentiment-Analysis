"""
backend/main.py
FastAPI backend — wraps your existing ML pipeline
Run with: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import sys, os, io, traceback

# ── Allow frontend on port 3000 to call this API ──────────────────────────────
app = FastAPI(title="Smart Analytical System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Add your existing src/ folder to path ─────────────────────────────────────
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "Smart Analytical System API is running"}


# ── Main analysis endpoint ────────────────────────────────────────────────────
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """
    Accepts a CSV file, runs the full ML pipeline, returns JSON results.
    Frontend sends: POST /analyze  with file in form-data.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    try:
        # 1. Read the uploaded CSV into a DataFrame
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        print(f"[API] Received {len(df)} rows from {file.filename}")

        # 2. Run your pipeline (imports from src/)
        from data_loader       import DataLoader
        from sentiment_analyzer import SentimentAnalyzer
        from aspect_based_analyzer import AspectAnalyzer
        from trend_analyzer    import TrendAnalyzer
        from business_insights import BusinessInsights

        # Data loading
        loader = DataLoader()
        reviews_df = loader._prepare_uploaded_df(df)          # See note below

        # Sentiment
        analyzer    = SentimentAnalyzer()
        analyzed_df = analyzer.analyze_reviews(reviews_df, sample_size=min(500, len(reviews_df)))

        # Aspects
        aspect_analyzer = AspectAnalyzer()
        aspect_df       = aspect_analyzer.analyze_reviews(analyzed_df)

        # Trends
        trend_analyzer  = TrendAnalyzer()
        trend_results   = trend_analyzer.detect_trends(analyzed_df)

        # Insights
        insight_gen     = BusinessInsights()
        insights        = insight_gen.generate_comprehensive_insights(analyzed_df, aspect_df, trend_results)

        # 3. Build JSON response
        total    = len(analyzed_df)
        pos_pct  = round((analyzed_df['sentiment_label'] == 'POSITIVE').sum() / total * 100, 1)
        neg_pct  = round((analyzed_df['sentiment_label'] == 'NEGATIVE').sum() / total * 100, 1)
        avg_conf = round(analyzed_df['sentiment_score'].mean() * 100, 1)

        aspect_summary = []
        if aspect_df is not None and len(aspect_df) > 0:
            for aspect in aspect_df['aspect'].unique():
                adata = aspect_df[aspect_df['aspect'] == aspect]
                aspect_summary.append({
                    "name":     aspect,
                    "mentions": int(len(adata)),
                    "positive": round((adata['sentiment'] == 'POSITIVE').sum() / len(adata) * 100, 1),
                    "negative": round((adata['sentiment'] == 'NEGATIVE').sum() / len(adata) * 100, 1),
                })
        aspect_summary.sort(key=lambda x: x['mentions'], reverse=True)

        sample_reviews = []
        for _, row in analyzed_df.head(10).iterrows():
            sample_reviews.append({
                "date":       str(row.get('review_date', '')[:10]) if 'review_date' in row else '',
                "rating":     int(row.get('rating', 0)),
                "text":       str(row.get('review_text', ''))[:200],
                "sentiment":  str(row.get('sentiment_label', '')),
                "confidence": round(float(row.get('sentiment_score', 0)) * 100, 1),
            })

        return JSONResponse({
            "status": "success",
            "kpi": {
                "totalReviews":  total,
                "accuracy":      79.6,        # from model benchmark
                "positivePct":   pos_pct,
                "negativePct":   neg_pct,
                "avgConfidence": avg_conf,
                "avgRating":     round(float(analyzed_df['rating'].mean()), 2) if 'rating' in analyzed_df.columns else 0,
                "sentimentDays": int(analyzed_df['review_date'].nunique()) if 'review_date' in analyzed_df.columns else total,
            },
            "sentiment": {
                "positive": int((analyzed_df['sentiment_label'] == 'POSITIVE').sum()),
                "negative": int((analyzed_df['sentiment_label'] == 'NEGATIVE').sum()),
                "neutral":  int((analyzed_df['sentiment_label'] == 'NEUTRAL').sum()),
            },
            "aspects":       aspect_summary,
            "sampleReviews": sample_reviews,
            "trend": {
                "direction": trend_results['insights'].get('monthly_trend', 'stable').upper(),
                "slope":     round(float(trend_results['insights'].get('monthly_slope', 0)), 3),
            },
            "swot":            insights.get('overall_summary', {}),
            "recommendations": insights.get('recommendations', []),
        })

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ── Run directly ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)