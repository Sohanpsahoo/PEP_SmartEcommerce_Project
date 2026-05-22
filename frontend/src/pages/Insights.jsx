import { useState, useEffect } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiDollarSign, FiCpu, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/ai/insights');
      setInsights(res.data.data);
    } catch (err) {
      console.error('Failed to load insights', err);
      setError('Failed to load AI insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiCpu className="text-brand-400" /> AI Sales & Inventory Insights
          </h1>
          <p className="text-slate-400 mt-1">Smart recommendations based on your product performance.</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin text-brand-400" : "text-brand-400"} /> 
          Refresh Analysis
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">AI is analyzing your store data...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchInsights} className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Alerts */}
          <div className="glass p-6 rounded-2xl border border-orange-500/30">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <FiAlertTriangle className="text-orange-400" />
              </div>
              Inventory Alerts
            </h2>
            <div className="space-y-4">
              {insights?.inventoryAlerts?.length > 0 ? (
                insights.inventoryAlerts.map((alert, idx) => (
                  <div key={idx} className="p-4 bg-dark-800/50 rounded-xl border border-slate-700/50 hover:border-orange-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-orange-300">{alert.product}</h3>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400">
                        {alert.currentStock} in stock
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{alert.alert}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">No inventory alerts. Stock levels are healthy!</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Pricing Recommendations */}
            <div className="glass p-6 rounded-2xl border border-brand-500/30">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <div className="p-2 bg-brand-500/20 rounded-lg">
                  <FiDollarSign className="text-brand-400" />
                </div>
                Pricing Recommendations
              </h2>
              <div className="space-y-4">
                {insights?.pricing?.length > 0 ? (
                  insights.pricing.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-dark-800/50 rounded-xl border border-slate-700/50 hover:border-brand-500/30 transition-colors">
                      <h3 className="font-semibold text-brand-300 mb-1">{rec.product}</h3>
                      <p className="text-white font-medium mb-2">{rec.recommendation}</p>
                      <p className="text-sm text-slate-400 italic">" {rec.reason} "</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">No pricing recommendations at this time.</div>
                )}
              </div>
            </div>

            {/* Trending Insights */}
            <div className="glass p-6 rounded-2xl border border-green-500/30">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FiTrendingUp className="text-green-400" />
                </div>
                Trending Insights
              </h2>
              <div className="space-y-4">
                {insights?.trending?.length > 0 ? (
                  insights.trending.map((trend, idx) => (
                    <div key={idx} className="p-4 bg-dark-800/50 rounded-xl border border-slate-700/50 hover:border-green-500/30 transition-colors">
                      <p className="text-slate-300 mb-2">{trend.insight}</p>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="font-semibold text-green-400">Action:</span>
                        <span className="text-green-300/80">{trend.action}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">No trending insights available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
