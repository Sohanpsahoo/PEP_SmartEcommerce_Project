import { FiShoppingBag, FiSearch, FiFilter } from 'react-icons/fi';

const Orders = () => {
  // Dummy data for demonstration
  const dummyOrders = [
    { id: 'ORD-7829', customer: 'Alex Johnson', date: 'Oct 24, 2023', total: 129.99, status: 'Delivered' },
    { id: 'ORD-7828', customer: 'Sarah Williams', date: 'Oct 24, 2023', total: 84.50, status: 'Processing' },
    { id: 'ORD-7827', customer: 'Michael Chen', date: 'Oct 23, 2023', total: 249.00, status: 'Shipped' },
    { id: 'ORD-7826', customer: 'Emily Davis', date: 'Oct 23, 2023', total: 45.00, status: 'Delivered' },
    { id: 'ORD-7825', customer: 'Robert Wilson', date: 'Oct 22, 2023', total: 199.99, status: 'Cancelled' },
    { id: 'ORD-7824', customer: 'Jessica Taylor', date: 'Oct 22, 2023', total: 75.25, status: 'Delivered' },
  ];

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
          <p className="text-slate-400 mt-1">Manage and track customer orders (Demo Data).</p>
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
            {dummyOrders.map((order) => (
              <tr key={order.id} className="hover:bg-dark-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-300">{order.id}</td>
                <td className="px-6 py-4 text-slate-200">{order.customer}</td>
                <td className="px-6 py-4 text-slate-400">{order.date}</td>
                <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
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
