// ─── DEMO DATA ────────────────────────────────────────────────────────────────
// This is your real Amazon Electronics analysis results from the paper.
// When backend is connected, this gets replaced by API responses.

export const demoData = {
  kpi: {
    totalReviews:  1000,
    accuracy:      79.6,
    positivePct:   70.7,
    negativePct:   29.3,
    sentimentDays: 729,
    avgConfidence: 97.4,
    avgRating:     4.15,
  },

  sentiment: {
    positive: 707,
    negative: 293,
    neutral:  0,
  },

  aspects: [
    { name: 'Software',     mentions: 392, positive: 64.8, negative: 35.2 },
    { name: 'Price',        mentions: 216, positive: 66.7, negative: 33.3 },
    { name: 'Design',       mentions: 98,  positive: 68.4, negative: 31.6 },
    { name: 'Performance',  mentions: 47,  positive: 85.1, negative: 14.9 },
    { name: 'Battery',      mentions: 23,  positive: 69.6, negative: 30.4 },
    { name: 'Screen',       mentions: 15,  positive: 72.0, negative: 28.0 },
    { name: 'Camera',       mentions: 11,  positive: 75.0, negative: 25.0 },
  ],

  ratings: [
    { stars: 1, count: 101, sentiment: -0.842 },
    { stars: 2, count: 49,  sentiment: -0.673 },
    { stars: 3, count: 75,  sentiment: -0.227 },
    { stars: 4, count: 148, sentiment:  0.419 },
    { stars: 5, count: 627, sentiment:  0.777 },
  ],

  correlation: {
    r:       0.034,
    pValue:  0.355,
    r2:      0.001,
    n:       729,
    significant: false,
  },

  trend: {
    direction:        'IMPROVING',
    slope:            0.012,
    bestPeriod:       '2000–2002',
    worstPeriod:      '2005–2006',
    highestSentiment: 'June 2000 (1.0)',
    lowestSentiment:  'September 2005 (−1.0)',
    quarterly: [
      { period: '2000–2002', sentiment: 0.72, trend: 'Strong positive' },
      { period: '2003–2004', sentiment: 0.45, trend: 'Moderate'        },
      { period: '2005–2006', sentiment: 0.18, trend: 'Decline'         },
      { period: '2007–2008', sentiment: 0.38, trend: 'Recovery'        },
      { period: '2009–2010', sentiment: 0.55, trend: 'Improving'       },
      { period: '2011–2012', sentiment: 0.68, trend: 'Strong'          },
    ],
  },

  swot: {
    strengths: [
      'Performance aspect: 85.1% positive — strongest feature',
      'Model accuracy 79.6% vs human ratings',
      '97.4% average prediction confidence',
      'Overall sentiment trend is improving (+0.012 slope)',
    ],
    weaknesses: [
      'Software sentiment only 64.8% positive (most discussed)',
      '29.3% negative reviews overall',
      'Declining battery-related sentiment noted',
      'Price perception mixed at 66.7% positive',
    ],
    opportunities: [
      'Improving trend: capitalize on marketing momentum',
      'Performance is a clear differentiator — highlight it',
      'Untapped aspects (screen, camera) have limited data',
      'Address software issues → potential uplift in overall score',
    ],
    threats: [
      'Weak market correlation (r=0.034) — sentiment alone insufficient',
      'Software dissatisfaction may drive competitor switching',
      'Negative review velocity if issues unaddressed',
      'Limited data for screen/camera aspects',
    ],
  },

  recommendations: [
    { priority: 'HIGH',   text: 'Investigate software issues — most discussed but only 64.8% positive' },
    { priority: 'HIGH',   text: 'Highlight performance in all marketing campaigns (85.1% positive)' },
    { priority: 'MEDIUM', text: 'Monitor battery sentiment trends monthly' },
    { priority: 'MEDIUM', text: 'Respond to negative reviews proactively' },
    { priority: 'LOW',    text: 'Collect more data on screen and camera aspects' },
    { priority: 'LOW',    text: 'Consider premium positioning — customers are broadly satisfied' },
  ],

  sampleReviews: [
    { date: '2010-03-12', rating: 5, text: 'Absolutely love this product! Performance is incredible and the build quality feels premium.', sentiment: 'POSITIVE', confidence: 99.1 },
    { date: '2009-11-04', rating: 2, text: 'Software keeps crashing, updates broke everything. Really disappointed with this purchase.', sentiment: 'NEGATIVE', confidence: 98.4 },
    { date: '2011-06-22', rating: 4, text: 'Great value for money, camera is decent and battery lasts all day. Highly recommend.', sentiment: 'POSITIVE', confidence: 94.7 },
    { date: '2008-01-15', rating: 1, text: 'Terrible software experience. Price is way too high for this quality.', sentiment: 'NEGATIVE', confidence: 97.2 },
    { date: '2012-09-30', rating: 5, text: 'Outstanding performance and beautiful design. Highly recommend to anyone!', sentiment: 'POSITIVE', confidence: 99.5 },
    { date: '2007-07-08', rating: 3, text: 'Okay device. Screen is average and charging is slow but it gets the job done.', sentiment: 'NEGATIVE', confidence: 81.3 },
    { date: '2010-12-01', rating: 5, text: 'Best purchase I have made. Speed is unmatched and the display is crisp.', sentiment: 'POSITIVE', confidence: 98.9 },
    { date: '2006-04-19', rating: 2, text: 'Battery dies fast. Software interface is confusing and feels very outdated.', sentiment: 'NEGATIVE', confidence: 96.8 },
  ],
};

export default demoData;