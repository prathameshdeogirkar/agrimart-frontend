import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, RefreshCw, Edit3, Trash2,
  Plus, Package, Check, AlertTriangle,
  ChevronRight, ArrowLeft, Save, Loader2,
  Image as ImageIcon, Layers, Tag, IndianRupee,
  Info, BarChart3, Truck
} from 'lucide-react';
import { productService } from '../services/productService';
import RoleBasedRoute from '../components/RoleBasedRoute';
import { Toaster, toast } from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Side Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [panelType, setPanelType] = useState('add'); // 'add' or 'edit'

  const initialFormData = {
    name: '',
    description: '',
    price: '',
    mrp: '',
    unitSize: '',
    shelfLife: '',
    healthBenefits: '',
    storageAdvice: '',
    farmerName: '',
    marketedBy: '',
    manufacturerDetails: '',
    fssaiLicense: '',
    category: '',
    imageUrl: '',
    galleryImages: [],
    stock: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll(page, 10);
      if (data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } else {
        setProducts(data || []);
        setTotalPages(1);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product? This action is irreversible.')) return;
    setDeleting(productId);
    try {
      const result = await productService.delete(productId);
      if (result.success) {
        toast.success('Product deleted');
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  // Panel Handlers
  const openAddPanel = () => {
    setPanelType('add');
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsPanelOpen(true);
  };

  const openEditPanel = (product) => {
    setPanelType('edit');
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      mrp: product.mrp || '',
      unitSize: product.unitSize || '',
      shelfLife: product.shelfLife || '',
      healthBenefits: product.healthBenefits || '',
      storageAdvice: product.storageAdvice || '',
      farmerName: product.farmerName || '',
      marketedBy: product.marketedBy || '',
      manufacturerDetails: product.manufacturerDetails || '',
      fssaiLicense: product.fssaiLicense || '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      galleryImages: product.galleryImages || [],
      stock: product.stock || '',
    });
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setFormData(initialFormData);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        mrp: formData.mrp ? parseFloat(formData.mrp) : null,
        stock: parseInt(formData.stock) || 0,
        galleryImages: formData.galleryImages.filter(url => url && url.trim() !== '')
      };

      let result;
      if (panelType === 'edit' && editingProduct) {
        result = await productService.update(editingProduct.id, payload);
      } else {
        result = await productService.create(payload);
      }

      if (result.success) {
        toast.success(`Product ${panelType === 'edit' ? 'updated' : 'created'}`);
        fetchProducts(); // Refresh list
        closePanel();
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Internal processing error');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const searchLow = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchLow) ||
      p.category.toLowerCase().includes(searchLow) ||
      String(p.id).includes(searchLow)
    );
  });

  return (
    <RoleBasedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-slate-50 pt-[80px] pb-12 transition-all duration-500">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${isPanelOpen ? 'pr-[420px]' : ''}`}>

          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Package className="h-10 w-10 text-emerald-600" />
                Inventory
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Manage your harvest & supply chain</p>
            </div>

            <div className="flex flex-1 max-w-2xl w-full gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="text"
                  placeholder="Filter by name, category, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 font-bold transition-all placeholder:text-slate-300"
                />
              </div>
              <button
                onClick={openAddPanel}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white scroll-smooth relative">
            <div className="overflow-x-auto overflow-y-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Details</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Pricing</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="px-8 py-8 h-20 bg-slate-50/30"></td>
                      </tr>
                    ))
                  ) : (
                    filteredProducts.map((p) => (
                      <motion.tr
                        key={p.id}
                        layout
                        className="hover:bg-emerald-50/30 transition-colors group cursor-default"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden border border-slate-200">
                              <img
                                src={p.imageUrl || "/images/placeholder-product.png"}
                                alt={p.name}
                                onError={(e) => {
                                  e.currentTarget.src = "/images/placeholder-product.png";
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 tracking-tight">{p.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: #{p.id}</span>
                                {p.unitSize && (
                                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 uppercase tracking-widest leading-none">
                                    {p.unitSize}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                              <span className="font-black text-slate-700 text-sm">{p.stock} units</span>
                            </div>
                            {p.stock < 5 && (
                              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Critical Stock
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900">₹{p.price}</span>
                            <span className="text-[10px] font-bold text-slate-400 line-through">₹{p.mrp || p.price}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-black text-[9px] uppercase tracking-widest">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditPanel(p)}
                              className="p-3 bg-white hover:bg-emerald-600 text-slate-400 hover:text-white rounded-xl shadow-sm border border-slate-100 transition-all"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deleting === p.id}
                              className="p-3 bg-white hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl shadow-sm border border-slate-100 transition-all disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="py-24 text-center">
                <Package className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">The void of harvest</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="h-12 px-6 bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 disabled:opacity-30 transition-all border border-slate-100 shadow-sm"
              >
                Prev Harvest
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${page === i ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="h-12 px-6 bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 disabled:opacity-30 transition-all border border-slate-100 shadow-sm"
              >
                Next Cycle
              </button>
            </div>
          )}
        </div>

        {/* Action Panel (Slide-over) */}
        <AnimatePresence>
          {isPanelOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePanel}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] lg:hidden"
              />

              {/* Panel Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-[500px] bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[2001] flex flex-col"
              >
                {/* Panel Header */}
                <div className="px-8 py-10 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                      {panelType === 'add' ? 'Add New Product' : 'Edit Product'}
                    </h2>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                      {panelType === 'add' ? 'Populating the harvest' : `Product ID: #${editingProduct?.id}`}
                    </p>
                  </div>
                  <button
                    onClick={closePanel}
                    className="p-4 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Panel Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar scroll-smooth">
                  <form onSubmit={handleFormSubmit} className="space-y-10">

                    {/* Section: Visuals */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="h-3 w-3" /> Core Visuals
                      </h4>
                      <div className="space-y-4">
                        <div className="relative group">
                          <input
                            type="url" name="imageUrl" placeholder="Featured Image URL" value={formData.imageUrl} onChange={handleInputChange}
                            className="w-full pl-4 pr-12 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                        {formData.imageUrl && (
                          <div className="w-full h-32 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                            <img
                              src={formData.imageUrl}
                              alt="Preview"
                              onError={(e) => {
                                e.currentTarget.src = "/images/placeholder-product.png";
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section: Identity */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <Tag className="h-3 w-3" /> Basic Information
                      </h4>
                      <div className="grid grid-cols-1 gap-6">
                        <input
                          type="text" name="name" placeholder="Product Full Name" value={formData.name} onChange={handleInputChange} required
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        />
                        <select
                          name="category" value={formData.category} onChange={handleInputChange} required
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner appearance-none pr-10"
                        >
                          <option value="">Select Domain Category</option>
                          <option value="Vegetables">Vegetables</option>
                          <option value="Fruits">Fruits</option>
                          <option value="Dairy">Dairy</option>
                          <option value="Essentials">Essentials</option>
                          <option value="Exotics">Exotics</option>
                        </select>
                      </div>
                    </div>

                    {/* Section: Financials & Stock */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <IndianRupee className="h-3 w-3" /> Pricing
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                          <input
                            type="number" step="0.01" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                          />
                        </div>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <input
                            type="number" step="0.01" name="mrp" placeholder="MRP" value={formData.mrp} onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text" name="unitSize" placeholder="Unit / Pack Size (e.g. 1kg, 500ml)" value={formData.unitSize} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner uppercase text-xs tracking-widest"
                        />
                        <div className="relative">
                          <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <input
                            type="number" name="stock" placeholder="Stock Level" value={formData.stock} onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Details */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <Info className="h-3 w-3" /> Technical Details
                      </h4>
                      <textarea
                        name="description" placeholder="Product Description" rows="3" value={formData.description} onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner resize-none"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text" name="shelfLife" placeholder="Shelf Life" value={formData.shelfLife} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        />
                        <input
                          type="text" name="storageAdvice" placeholder="Storage Rules" value={formData.storageAdvice} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Section: Farmer */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <Truck className="h-3 w-3" /> Supply Chain Origin
                      </h4>
                      <div className="space-y-4">
                        <input
                          type="text" name="farmerName" placeholder="Farmer Identity" value={formData.farmerName} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        />
                        <input
                          type="text" name="fssaiLicense" placeholder="FSSAI Index License" value={formData.fssaiLicense} onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="h-10" /> {/* Spacer */}
                  </form>
                </div>

                {/* Panel Footer */}
                <div className="px-8 py-8 border-t border-slate-50 bg-slate-50/20 grid grid-cols-2 gap-4">
                  <button
                    onClick={closePanel}
                    className="h-14 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    disabled={saving}
                    className="h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-4 w-4" />}
                    {panelType === 'add' ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </RoleBasedRoute>
  );
};

export default AdminProducts;
