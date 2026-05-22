import { useState, useEffect } from 'react';
import { FiShoppingBag, FiSearch, FiFilter, FiPieChart } from 'react-icons/fi';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FiShoppingBag className="text-brand-500" /> Orders
          </h1>
          <p className="text-slate-400 mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-dark-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors text-sm">
          <FiFilter /> Filter
        </button>
      </div>

      {/* Order Stats Chart */}
      {!loading && stats && (
        <div className="glass p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiPieChart className="text-brand-400" /> Order Status Breakdown
          </h2>
          <div className="h-64 flex justify-center">
            <Doughnut 
              data={{
                labels: stats.statusCounts.map(s => s.status),
                datasets: [
                  {
                    data: stats.statusCounts.map(s => s.count),
                    backgroundColor: [
                      'rgba(74, 222, 128, 0.8)', // Delivered (Green)
                      'rgba(56, 189, 248, 0.8)', // Processing (Blue)
                      'rgba(139, 92, 246, 0.8)', // Shipped (Brand)
                      'rgba(239, 68, 68, 0.8)',  // Cancelled (Red)
                    ],
                    borderWidth: 0,
                  }
                ]
              }} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { color: '#94a3b8' } }
                }
              }} 
            />
          </div>
        </div>
      )}

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
                <td className="px-6 py-4 text-slate-200">{order.customer?.name}</td>
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
    </div>
  );
};

export default Orders;
