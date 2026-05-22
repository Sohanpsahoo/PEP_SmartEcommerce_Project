import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiArrowUpRight, FiPlus, FiTrash2, FiX, FiCalendar, FiFileText } from 'react-icons/fi';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Revenue = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryDataState, setCategoryDataState] = useState({ labels: [], data: [] });

  // Manual revenue state
  const [revenueEntries, setRevenueEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newEntry, setNewEntry] = useState({
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear(),
    amount: '',
    note: '',
  });

  const fetchAll = async () => {
    try {
      const [analyticsRes, productsRes, revenueRes] = await Promise.all([
        axios.get('/api/analytics/dashboard'),
        axios.get('/api/products'),
        axios.get('/api/revenue'),
      ]);

      setAnalytics(analyticsRes.data);
      setRevenueEntries(revenueRes.data);

      // Compute revenue by category
      const categoryMap = {};
      productsRes.data.forEach(p => {
        if (!categoryMap[p.category]) categoryMap[p.category] = 0;
        categoryMap[p.category] += (p.salesData?.revenue || 0);
      });

      setCategoryDataState({
        labels: Object.keys(categoryMap),
        data: Object.values(categoryMap)
      });
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // --- Add revenue entry ---
  const handleAddRevenue = async () => {
    if (!newEntry.amount || parseFloat(newEntry.amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setSaving(true);
    try {
      await axios.post('/api/revenue', {
        month: newEntry.month,
        year: parseInt(newEntry.year),
        amount: parseFloat(newEntry.amount),
        note: newEntry.note,
      });

      setShowModal(false);
      setNewEntry({
        month: MONTHS[new Date().getMonth()],
        year: new Date().getFullYear(),
        amount: '',
        note: '',
      });
      // Refresh all data so chart updates
      setLoading(true);
      await fetchAll();
    } catch (err) {
      console.error('Failed to add revenue', err);
      alert('Failed to add revenue: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // --- Delete revenue entry ---
  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Delete this revenue entry?')) return;
    try {
      await axios.delete(`/api/revenue/${id}`);
      setLoading(true);
      await fetchAll();
    } catch (err) {
      console.error('Failed to delete entry', err);
    }
  };

  // --- Stats ---
  const revenueStats = {
    total: analytics?.stats?.totalRevenue || 0,
    growth: 12.5,
    thisMonth: analytics?.revenueChart?.data?.[analytics.revenueChart.data.length - 1] || 0,
    lastMonth: analytics?.revenueChart?.data?.[analytics.revenueChart.data.length - 2] || 0,
    projected: (analytics?.revenueChart?.data?.[analytics.revenueChart.data.length - 1] || 0) * 1.1,
  };

  const monthChangePercent = revenueStats.lastMonth > 0
    ? (((revenueStats.thisMonth - revenueStats.lastMonth) / revenueStats.lastMonth) * 100).toFixed(1)
    : '0.0';

  // --- Chart data ---
  const revenueData = {
    labels: analytics?.revenueChart?.labels || MONTHS,
    datasets: [
      {
        label: 'Revenue ($)',
        data: analytics?.revenueChart?.data || new Array(12).fill(0),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const categoryData = {
    labels: categoryDataState.labels,
    datasets: [
      {
        label: 'Revenue by Category',
        data: categoryDataState.data,
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(244, 114, 182, 0.8)',
          'rgba(74, 222, 128, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94a3b8',
          callback: (val) => `$${val.toLocaleString()}`,
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiDollarSign className="text-green-400" /> Revenue
          </h1>
          <p className="text-slate-400 mt-1">Financial performance, projections, and manual entries.</p>
        </div>
        <button
          id="add-revenue-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-105"
        >
          <FiPlus className="w-5 h-5" /> Add Revenue
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Revenue (YTD)</h3>
          <p className="text-3xl font-bold">${revenueStats.total.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-green-400 text-sm font-medium">
            <FiArrowUpRight /> {revenueStats.growth}% vs Last Year
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-slate-400 text-sm font-medium mb-1">This Month</h3>
          <p className="text-3xl font-bold">${revenueStats.thisMonth.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-green-400 text-sm font-medium">
            <FiArrowUpRight /> {monthChangePercent}% vs Last Month
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-brand-500/30">
          <h3 className="text-brand-300 text-sm font-medium mb-1">Projected Next Month</h3>
          <p className="text-3xl font-bold text-white">${Math.round(revenueStats.projected).toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm font-medium">
            Based on current growth trends
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6">Revenue Trend</h2>
          <div className="h-80">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6">Revenue by Category</h2>
          <div className="h-80">
            {categoryDataState.labels.length > 0 ? (
              <Bar data={categoryData} options={{...chartOptions, indexAxis: 'y'}} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No category data</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Manual Entries */}
      <div className="glass p-6 rounded-2xl mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiFileText className="text-brand-400" /> Manual Revenue Entries
          </h2>
          <span className="text-sm text-slate-400">{revenueEntries.length} entries</span>
        </div>

        {revenueEntries.length === 0 ? (
          <div className="text-center py-12">
            <FiDollarSign className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">No manual entries yet</p>
            <p className="text-slate-500 text-sm mt-1">Click "Add Revenue" to record your first entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Month</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Year</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Amount</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Note</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Date Added</th>
                  <th className="py-3 px-4 text-xs uppercase tracking-wider text-slate-400 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {revenueEntries.map((entry) => (
                  <tr key={entry._id} className="border-b border-slate-800/50 hover:bg-dark-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 bg-brand-500/10 text-brand-300 px-2.5 py-1 rounded-lg text-sm font-medium">
                        <FiCalendar className="w-3.5 h-3.5" /> {entry.month}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{entry.year}</td>
                    <td className="py-3 px-4 font-semibold text-green-400">${entry.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm max-w-[200px] truncate">{entry.note || '—'}</td>
                    <td className="py-3 px-4 text-slate-500 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete entry"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== ADD REVENUE MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={() => setShowModal(false)}>
          <div
            className="bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-md p-0 animate-[fadeInUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <FiDollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Add Revenue Entry</h3>
                  <p className="text-xs text-slate-500">Record revenue manually</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">
              {/* Month & Year row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Month</label>
                  <select
                    id="revenue-month"
                    value={newEntry.month}
                    onChange={(e) => setNewEntry({ ...newEntry, month: e.target.value })}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Year</label>
                  <input
                    id="revenue-year"
                    type="number"
                    value={newEntry.year}
                    onChange={(e) => setNewEntry({ ...newEntry, year: e.target.value })}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input
                    id="revenue-amount"
                    type="number"
                    placeholder="0.00"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Note (optional)</label>
                <textarea
                  id="revenue-note"
                  placeholder="e.g., Weekend sale, Wholesale order..."
                  value={newEntry.note}
                  onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                  rows={3}
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-revenue-btn"
                onClick={handleAddRevenue}
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiPlus className="w-4 h-4" /> Add Entry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline animation keyframe via style tag */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Revenue;
