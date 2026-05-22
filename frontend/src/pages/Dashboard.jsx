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
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/analytics/dashboard');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const revenueData = {
    labels: dashboardData?.revenueChart?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: dashboardData?.revenueChart?.data || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
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

  const stats = [
    { title: 'Total Revenue', value: `$${dashboardData?.stats?.totalRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign className="w-6 h-6 text-green-400" />, change: '+12.5%', path: '/revenue' },
    { title: 'Total Orders', value: dashboardData?.stats?.totalUnitsSold?.toLocaleString() || '0', icon: <FiShoppingBag className="w-6 h-6 text-brand-400" />, change: '+8.2%', path: '/orders' },
    { title: 'Total Products', value: dashboardData?.stats?.totalProducts?.toLocaleString() || '0', icon: <FiUsers className="w-6 h-6 text-blue-400" />, change: '+5.1%', path: '/products' },
    { title: 'Low Stock Items', value: dashboardData?.stats?.lowStockCount?.toString() || '0', icon: <FiTrendingUp className="w-6 h-6 text-orange-400" />, change: 'Alerts', path: '/products' },
  ];

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Overview</h1>
        <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300">
          Last 30 Days
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={() => navigate(stat.path)}
            className="glass p-6 rounded-2xl cursor-pointer hover:scale-[1.02] hover:bg-dark-800/80 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-dark-800 rounded-lg border border-slate-700">
                {stat.icon}
              </div>
              <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts & AI Insights Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6">Revenue Overview</h2>
          <div className="h-72">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="glass p-6 rounded-2xl border-brand-500/30 border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              AI Sales Insights
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-dark-800/80 p-4 rounded-xl border border-brand-500/20">
              <h4 className="text-sm font-medium text-brand-300 mb-2">Pricing Recommendation</h4>
              <p className="text-sm text-slate-300">
                Consider lowering the price of your top product by 5% to match current market trends and boost conversion by an estimated 15%.
              </p>
            </div>
            
            <div className="bg-dark-800/80 p-4 rounded-xl border border-orange-500/20">
              <h4 className="text-sm font-medium text-orange-300 mb-2">Inventory Alert</h4>
              <p className="text-sm text-slate-300">
                {dashboardData?.lowStockProducts?.length > 0 
                  ? `"${dashboardData.lowStockProducts[0].name}" is running low (${dashboardData.lowStockProducts[0].stock} units left). Reorder soon.`
                  : "All inventory levels are looking healthy."}
              </p>
            </div>

            <div className="bg-dark-800/80 p-4 rounded-xl border border-blue-500/20">
              <h4 className="text-sm font-medium text-blue-300 mb-2">Trending Insight</h4>
              <p className="text-sm text-slate-300">
                Your newest products are gaining traction. Consider running a promotional campaign.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
