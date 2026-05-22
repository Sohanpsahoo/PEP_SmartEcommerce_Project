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
import { Line } from 'react-chartjs-2';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiArrowRight, FiAward, FiStar } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, insightsRes] = await Promise.all([
          axios.get('/api/analytics/dashboard'),
          axios.post('/api/ai/insights')
        ]);
        setDashboardData(dashRes.data);
        setAiInsights(insightsRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Create a gradient for the chart
  const createGradient = (ctx, area) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.05)'); // subtle purple at bottom
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.4)'); // stronger purple at top
    return gradient;
  };

  const chartData = {
    labels: dashboardData?.revenueChart?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: dashboardData?.revenueChart?.data || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#a855f7', // purple-500
        borderWidth: 3,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) {
            return null;
          }
          return createGradient(ctx, chartArea);
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#cbd5e1',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: '#94a3b8', padding: 10 }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#94a3b8', padding: 10 }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const stats = [
    { title: 'Total Revenue', value: `$${dashboardData?.stats?.totalRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign className="w-6 h-6 text-emerald-400" />, iconBg: 'bg-emerald-400/10', change: '+12.5%', path: '/revenue' },
    { title: 'Total Orders', value: dashboardData?.stats?.totalOrders?.toLocaleString() || '0', icon: <FiShoppingBag className="w-6 h-6 text-brand-400" />, iconBg: 'bg-brand-400/10', change: '+8.2%', path: '/orders' },
    { title: 'Total Products', value: dashboardData?.stats?.totalProducts?.toLocaleString() || '0', icon: <FiUsers className="w-6 h-6 text-blue-400" />, iconBg: 'bg-blue-400/10', change: '+5.1%', path: '/products' },
    { title: 'Low Stock Items', value: dashboardData?.stats?.lowStockCount?.toString() || '0', icon: <FiTrendingUp className="w-6 h-6 text-orange-400" />, iconBg: 'bg-orange-400/10', change: 'Alerts', path: '/products' },
  ];

  if (loading) return <div className="flex items-center justify-center h-full text-brand-400">Loading dashboard...</div>;

  const pricingRec = aiInsights?.pricing?.[0];
  const trendingRec = aiInsights?.trending?.[0];
  const inventoryAlert = aiInsights?.inventoryAlerts?.[0];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Overview</h1>
          <p className="text-slate-400 mt-1">Here is what is happening with your store today.</p>
        </div>
        <div className="bg-dark-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700/50 text-sm text-slate-300 shadow-lg">
          Last 30 Days
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            className="group relative glass p-6 rounded-3xl cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-slate-700/50 hover:border-slate-500/50 overflow-hidden"
          >
            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-2xl ${stat.iconBg} border border-white/5`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${i === 3 ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium relative z-10">{stat.title}</h3>
            <p className="text-3xl font-bold mt-1 text-white relative z-10">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts & Bottom Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Chart & Top Products) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Revenue Chart */}
          <div className="glass p-8 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
                <p className="text-sm text-slate-400 mt-1">Monthly performance breakdown</p>
              </div>
              <button 
                onClick={() => navigate('/revenue')}
                className="text-sm font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
              >
                View Details <FiArrowRight />
              </button>
            </div>
            <div className="h-80 relative z-10">
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Top Products Table */}
          <div className="glass p-8 rounded-3xl border border-slate-700/50 shadow-xl">
             <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <FiAward className="w-5 h-5 text-yellow-500" />
                </div>
                <h2 className="text-lg font-bold text-white">Top Performing Products</h2>
              </div>
              <button 
                onClick={() => navigate('/products')}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.topProducts?.length > 0 ? (
                dashboardData.topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-dark-800/40 border border-white/5 hover:bg-dark-800/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-dark-800 flex items-center justify-center text-slate-300 font-bold text-sm border border-slate-600">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-200">{product.name}</h4>
                        <p className="text-xs text-slate-500">{product.unitsSold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">${product.revenue?.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm text-center py-4">No product data available yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (AI Insights) */}
        <div className="relative glass p-1 rounded-3xl bg-gradient-to-b from-brand-500/30 via-purple-500/10 to-transparent">
          <div className="bg-dark-900/90 h-full w-full rounded-[23px] p-7 backdrop-blur-xl flex flex-col">
            
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-brand-400 animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-brand-500 relative" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Intelligence
              </h2>
            </div>
            
            <div className="space-y-5 flex-1">
              {/* Pricing */}
              <div className="bg-gradient-to-br from-brand-500/10 to-transparent p-5 rounded-2xl border border-brand-500/20 relative overflow-hidden group hover:border-brand-500/40 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <FiDollarSign className="w-12 h-12 text-brand-400" />
                </div>
                <h4 className="text-sm font-bold text-brand-300 mb-2 relative z-10 flex items-center gap-2">
                  Pricing Opportunity
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                  {pricingRec 
                    ? `${pricingRec.recommendation} (${pricingRec.product})` 
                    : 'Add more sales data for pricing recommendations.'}
                </p>
              </div>
              
              {/* Inventory */}
              <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-5 rounded-2xl border border-orange-500/20 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <FiTrendingUp className="w-12 h-12 text-orange-400" />
                </div>
                <h4 className="text-sm font-bold text-orange-300 mb-2 relative z-10">
                  Inventory Alert
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                  {inventoryAlert 
                    ? inventoryAlert.alert 
                    : 'All inventory levels are looking healthy.'}
                </p>
              </div>

              {/* Trending */}
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent p-5 rounded-2xl border border-blue-500/20 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                 <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <FiStar className="w-12 h-12 text-blue-400" />
                </div>
                <h4 className="text-sm font-bold text-blue-300 mb-2 relative z-10">
                  Trending Insight
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                  {trendingRec 
                    ? trendingRec.insight 
                    : 'Add more products to see trending insights.'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/insights')}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              View Full AI Report <FiArrowRight />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
