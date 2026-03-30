/**
 * hooks/useData.js
 * 
 * Single source of truth for all dashboard pages.
 * Returns live API data if available, falls back to demoData.
 * 
 * Usage in any page:
 *   import useData from '../hooks/useData';
 *   const D = useData();
 */

import { demoData } from '../data/demoData';

export default function useData() {
  // Check if we have live results from a real CSV upload
  const mode = sessionStorage.getItem('sentiqMode');
  
  if (mode === 'live') {
    try {
      const raw = sessionStorage.getItem('sentiqResults');
      if (raw) {
        const api = JSON.parse(raw);
        // Map API response shape → demoData shape
        return mapApiToData(api);
      }
    } catch (e) {
      console.warn('Could not parse live results, falling back to demo', e);
    }
  }

  // Default: demo data
  return demoData;
}

/**
 * Maps the backend JSON response to the exact shape
 * that all frontend pages expect (same as demoData).
 */
function mapApiToData(api) {
  const kpi = api.kpi || {};
  const sentiment = api.sentiment || {};
  const aspects = (api.aspects || []).map(a => ({
    name:     a.name,
    mentions: a.mentions,
    positive: a.positive,
    negative: a.negative,
  }));

   const ratings = (api.ratings || []).length > 0
    ? api.ratings
    : demoData.ratings;   // fallback if no rating column

  const modelMetrics = api.modelMetrics || {
    precision: 79.6,
    recall: 78.2,
    f1_score: 78.9,
    accuracy: 79.6,
    note: "Using demo metrics"
  };
  const trend = api.trend || {};
  const quarterly = (trend.quarterly || []).length > 0
    ? trend.quarterly
    : demoData.trend.quarterly;

  const swot = api.swot || {};
  const correlation = api.correlation || {};

  const recommendations = (api.recommendations || []).map(r =>
    typeof r === 'string'
      ? { priority: 'MEDIUM', text: r }
      : r
  );

  return {
    kpi: {
      totalReviews:  kpi.totalReviews  ?? demoData.kpi.totalReviews,
      accuracy:      kpi.accuracy      ?? demoData.kpi.accuracy,
      positivePct:   kpi.positivePct   ?? demoData.kpi.positivePct,
      negativePct:   kpi.negativePct   ?? demoData.kpi.negativePct,
      neutralPct:    kpi.neutralPct    ?? demoData.kpi.neutralPct,
      avgConfidence: kpi.avgConfidence ?? demoData.kpi.avgConfidence,
      avgRating:     kpi.avgRating     ?? demoData.kpi.avgRating,
      sentimentDays: kpi.sentimentDays ?? demoData.kpi.sentimentDays,
    },
    modelMetrics,
    sentiment: {
      positive: sentiment.positive ?? demoData.sentiment.positive,
      negative: sentiment.negative ?? demoData.sentiment.negative,
      neutral:  sentiment.neutral  ?? demoData.sentiment.neutral,
    },
    aspects: aspects.length > 0 ? aspects : demoData.aspects,
    ratings,
    correlation: {
      r:           correlation.r_value   ?? demoData.correlation.r,
      pValue:      correlation.p_value   ?? demoData.correlation.pValue,
      r2:          correlation.r2        ?? demoData.correlation.r2,
      n:           correlation.n         ?? demoData.correlation.n,
      significant: correlation.significant ?? demoData.correlation.significant,
    },
    trend: {
      direction:        trend.direction   || demoData.trend.direction,
      slope:            trend.slope       ?? demoData.trend.slope,
      bestPeriod:       trend.bestPeriod  || demoData.trend.bestPeriod,
      worstPeriod:      trend.worstPeriod || demoData.trend.worstPeriod,
      highestSentiment: demoData.trend.highestSentiment,
      lowestSentiment:  demoData.trend.lowestSentiment,
      quarterly,
    },
    swot: {
      strengths:     swot.strengths     ?? demoData.swot.strengths,
      weaknesses:    swot.weaknesses    ?? demoData.swot.weaknesses,
      opportunities: swot.opportunities ?? demoData.swot.opportunities,
      threats:       swot.threats       ?? demoData.swot.threats,
    },
    recommendations: recommendations.length > 0 ? recommendations : demoData.recommendations,
    sampleReviews:   (api.sampleReviews || []).length > 0 ? api.sampleReviews : demoData.sampleReviews,
  };
}
