import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCpu } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Earbuds X', price: 99.99, stock: 45, category: 'Electronics' },
    { id: 2, name: 'Smart Watch Pro', price: 249.99, stock: 12, category: 'Wearables' },
    { id: 3, name: 'Ergonomic Keyboard', price: 129.50, stock: 0, category: 'Accessories' },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-slate-400 mt-1">Manage your inventory and AI generated content.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-brand-500/30"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-white"
          />
        </div>
        <div className="flex gap-3 text-sm">
          <button className="px-3 py-1.5 bg-dark-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            All Categories
          </button>
          <button className="px-3 py-1.5 bg-dark-800 border border-slate-700 rounded-md hover:bg-slate-700 transition-colors">
            Sort by: Newest
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass rounded-2xl overflow-hidden border border-slate-700/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-800/50 border-b border-slate-700/50">
              <th className="px-6 py-4 font-medium text-slate-300">Product Name</th>
              <th className="px-6 py-4 font-medium text-slate-300">Category</th>
              <th className="px-6 py-4 font-medium text-slate-300">Price</th>
              <th className="px-6 py-4 font-medium text-slate-300">Stock</th>
              <th className="px-6 py-4 font-medium text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-dark-800/30 transition-colors">
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-slate-400">{product.category}</td>
                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.stock > 20 ? 'bg-green-500/10 text-green-400' : 
                    product.stock > 0 ? 'bg-orange-500/10 text-orange-400' : 
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-brand-400 hover:text-brand-300 transition-colors" title="Generate AI Content">
                      <FiCpu />
                    </button>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                      <FiEdit2 />
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Placeholder for Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass p-6 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Product Name</label>
                <input type="text" className="w-full px-4 py-2 bg-dark-800 border border-slate-700 rounded-lg focus:outline-none focus:border-brand-500" />
              </div>
              
              <div className="col-span-2">
                 <button className="w-full flex items-center justify-center gap-2 py-3 border border-brand-500 border-dashed rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors">
                    <FiCpu /> Generate Description & SEO Tags with AI
                 </button>
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-dark-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
                <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-white transition-colors shadow-lg shadow-brand-500/30">Save Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
