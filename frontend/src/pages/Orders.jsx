import { useState, useEffect } from 'react';
import { FiShoppingBag, FiSearch, FiFilter, FiPieChart, FiPlus, FiX, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Manual Order State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerEmail: '',
    totalAmount: '',
    status: 'Processing',
  });

  const fetchOrdersData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/orders/stats')
      ]);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch orders data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/10 text-green-400';
      case 'Processing': return 'bg-blue-500/10 text-blue-400';
      case 'Shipped': return 'bg-brand-500/10 text-brand-400';
      case 'Cancelled': return 'bg-red-500/10 text-red-400';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  const handleAddOrder = async () => {
    if (!newOrder.customerName || !newOrder.totalAmount) {
      alert('Please fill out all required fields.');
      return;
    }
    setSaving(true);
    try {
      await axios.post('/api/orders', newOrder);
      setShowModal(false);
      setNewOrder({
        customerName: '',
        customerEmail: '',
        totalAmount: '',
        status: 'Processing',
      });
      setLoading(true);
      await fetchOrdersData();
    } catch (err) {
      console.error('Failed to add order', err);
      alert('Failed to add order: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Prepare Bar Chart Data
  const getBarChartData = () => {
    if (!orders || orders.length === 0) return { labels: [], datasets: [] };

    // Group orders by date (last 7 active days)
    const ordersByDate = {};
    [...orders].reverse().forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!ordersByDate[date]) {
        ordersByDate[date] = 0;
      }
      ordersByDate[date] += order.totalAmount;
    });

    const dates = Object.keys(ordersByDate).slice(-7);
    const amounts = dates.map(date => ordersByDate[date]);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Order Volume ($)',
          data: amounts,
          backgroundColor: 'rgba(56, 189, 248, 0.8)', // sky-400
          borderRadius: 4,
        }
      ]
    };
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`
        }
      }
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiShoppingBag className="text-brand-500" /> Orders
          </h1>
          <p className="text-slate-400 mt-1">Manage and track customer orders.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-105"
        >
          <FiPlus className="w-5 h-5" /> Add Order
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-white transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Order Stats Charts */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1 glass p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiPieChart className="text-brand-400" /> Status Breakdown
            </h2>
            <div className="h-48 flex justify-center">
              <Doughnut 
                data={{
                  labels: stats.statusCounts.map(s => s.status),
                  datasets: [
                    {
                      data: stats.statusCounts.map(s => s.count),
                      backgroundColor: [
                        'rgba(74, 222, 128, 0.8)', // Delivered
                        'rgba(56, 189, 248, 0.8)', // Processing
                        'rgba(139, 92, 246, 0.8)', // Shipped
                        'rgba(239, 68, 68, 0.8)',  // Cancelled
                      ],
                      borderWidth: 0,
                    }
                  ]
                }} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 } } }
                  }
                }} 
              />
            </div>
          </div>
          <div className="md:col-span-2 glass p-6 rounded-2xl">
             <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-sky-400" /> Order Volume (Recent)
            </h2>
            <div className="h-48">
              <Bar data={getBarChartData()} options={barChartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="glass rounded-2xl overflow-hidden border border-slate-700/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-800/50 border-b border-slate-700/50">
              <th className="px-6 py-4 font-medium text-slate-300">Order ID</th>
              <th className="px-6 py-4 font-medium text-slate-300">Customer</th>
              <th className="px-6 py-4 font-medium text-slate-300">Date</th>
              <th className="px-6 py-4 font-medium text-slate-300">Total</th>
              <th className="px-6 py-4 font-medium text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr> : orders.map((order) => (
              <tr key={order._id} className="hover:bg-dark-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-300">{order.orderId}</td>
                <td className="px-6 py-4">
                  <div className="text-slate-200">{order.customer?.name}</div>
                  <div className="text-xs text-slate-500">{order.customer?.email}</div>
                </td>
                <td className="px-6 py-4 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium">${order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD ORDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
             onClick={() => setShowModal(false)}>
          <div
            className="bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-md p-0 animate-[fadeInUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-500/20 rounded-xl">
                  <FiShoppingBag className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">New Manual Order</h3>
                  <p className="text-xs text-slate-500">Record a customer order manually</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Customer Name *</label>
                <input
                  type="text"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Customer Email</label>
                <input
                  type="email"
                  value={newOrder.customerEmail}
                  onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Total Amount ($) *</label>
                  <input
                    type="number"
                    value={newOrder.totalAmount}
                    onChange={(e) => setNewOrder({ ...newOrder, totalAmount: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                  <select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                    className="w-full bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                disabled={saving}
                className="flex-1 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? 'Saving...' : <><FiPlus className="w-4 h-4" /> Save Order</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Orders;
