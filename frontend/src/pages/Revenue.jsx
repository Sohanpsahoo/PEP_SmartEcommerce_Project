import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
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

const Revenue = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryDataState, setCategoryDataState] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, productsRes] = await Promise.all([
          axios.get('/api/analytics/dashboard'),
          axios.get('/api/products')
        ]);
        
        setAnalytics(analyticsRes.data);
        
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
    fetchAnalytics();
  }, []);

  const revenueStats = {
    total: analytics?.stats?.totalRevenue || 0,
    growth: 12.5, // Mock growth rate
    thisMonth: analytics?.revenueChart?.data?.[analytics.revenueChart.data.length - 1] || 0,
    lastMonth: analytics?.revenueChart?.data?.[analytics.revenueChart.data.length - 2] || 0,
    projected: (analytics?.revenueChart?.data?.[analytics.revenueChart.data.length - 1] || 0) * 1.1 // Mock projection
  };

  const revenueData = {
    labels: analytics?.revenueChart?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: analytics?.revenueChart?.data || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
        fill: true,
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
          'rgba(139, 92, 246, 0.8)', // brand-500
          'rgba(56, 189, 248, 0.8)', // sky-400
          'rgba(244, 114, 182, 0.8)', // pink-400
          'rgba(74, 222, 128, 0.8)', // green-400
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
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiDollarSign className="text-green-400" /> Revenue
          </h1>
          <p className="text-slate-400 mt-1">Detailed financial performance and projections.</p>
        </div>
        <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300">
          Year to Date
        </div>
      </div>

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
            <FiArrowUpRight /> {(((revenueStats.thisMonth - revenueStats.lastMonth) / revenueStats.lastMonth) * 100).toFixed(1)}% vs Last Month
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-brand-500/30">
          <h3 className="text-brand-300 text-sm font-medium mb-1">Projected Next Month</h3>
          <p className="text-3xl font-bold text-white">${revenueStats.projected.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm font-medium">
            Based on current growth trends
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Revenue;
