import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import RoleBasedRoute from '../components/RoleBasedRoute';
import { Toaster, toast } from 'react-hot-toast';

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(productId ? true : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(productId);
      setProduct(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        mrp: data.mrp || '',
        unitSize: data.unitSize || '',
        shelfLife: data.shelfLife || '',
        healthBenefits: data.healthBenefits || '',
        storageAdvice: data.storageAdvice || '',
        farmerName: data.farmerName || '',
        marketedBy: data.marketedBy || '',
        manufacturerDetails: data.manufacturerDetails || '',
        fssaiLicense: data.fssaiLicense || '',
        category: data.category || '',
        categoryId: data.category || '',
        imageUrl: data.imageUrl || '',
        galleryImages: data.galleryImages || [],
        stock: data.stock || '',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to load product';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(error);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        mrp: formData.mrp ? parseFloat(formData.mrp) : null,
        unitSize: formData.unitSize.trim(),
        shelfLife: formData.shelfLife.trim(),
        healthBenefits: formData.healthBenefits.trim(),
        storageAdvice: formData.storageAdvice.trim(),
        farmerName: formData.farmerName.trim(),
        marketedBy: formData.marketedBy.trim(),
        manufacturerDetails: formData.manufacturerDetails.trim(),
        fssaiLicense: formData.fssaiLicense.trim(),
        category: formData.category || 'Uncategorized',
        imageUrl: formData.imageUrl.trim(),
        galleryImages: formData.galleryImages.filter(url => url.trim() !== ''),
        stock: formData.stock ? parseInt(formData.stock) : 0,
      };

      let result;
      if (productId) {
        // Update existing product
        result = await productService.update(productId, payload);
      } else {
        // Create new product
        result = await productService.create(payload);
      }

      if (result.success) {
        const action = productId ? 'updated' : 'created';
        toast.success(`✅ Product ${action} successfully!`);
        // Redirect back to products list
        setTimeout(() => navigate('/admin/products'), 1500);
      } else {
        const errorMsg = result.error || 'An error occurred';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save product';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RoleBasedRoute requiredRole="ADMIN">
        <div className="min-h-screen bg-gray-50 pt-[100px] px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Toaster />
      </RoleBasedRoute>
    );
  }

  return (
    <RoleBasedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 pt-[100px] px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/admin/products')}
            className="mb-6 text-primary hover:text-primary-dark flex items-center transition-colors"
          >
            ← Back to Products
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-8">
              {productId ? '✏️ Edit Product' : '➕ Create Product'}
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe the product..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* MRP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Unit Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Size (e.g., 1 kg, 500g)
                </label>
                <input
                  type="text"
                  name="unitSize"
                  value={formData.unitSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="1 kg"
                />
              </div>

              {/* Shelf Life */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shelf Life
                </label>
                <input
                  type="text"
                  name="shelfLife"
                  value={formData.shelfLife}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 3-4 Days"
                />
              </div>

              {/* Health Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Benefits
                </label>
                <textarea
                  name="healthBenefits"
                  value={formData.healthBenefits}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="List health benefits..."
                />
              </div>

              {/* Storage Advice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Advice
                </label>
                <input
                  type="text"
                  name="storageAdvice"
                  value={formData.storageAdvice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Store in cool place"
                />
              </div>

              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Farmer Name"
                />
              </div>

              {/* Marketed By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketed By
                </label>
                <input
                  type="text"
                  name="marketedBy"
                  value={formData.marketedBy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Company Address"
                />
              </div>

              {/* Manufacturer Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer Details
                </label>
                <input
                  type="text"
                  name="manufacturerDetails"
                  value={formData.manufacturerDetails}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Manufacturer Info"
                />
              </div>

              {/* FSSAI License */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FSSAI License Number
                </label>
                <input
                  type="text"
                  name="fssaiLicense"
                  value={formData.fssaiLicense}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="License Number"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Essentials">Essentials</option>
                  <option value="Exotics">Exotics</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images (Optional)
                </label>
                <div className="space-y-3">
                  {formData.galleryImages.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newImages = [...formData.galleryImages];
                          newImages[index] = e.target.value;
                          setFormData(prev => ({ ...prev, galleryImages: newImages }));
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Image URL"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.galleryImages.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, galleryImages: newImages }));
                        }}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ''] }))}
                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                  >
                    + Add Another Image
                  </button>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {saving && <span className="animate-spin">⏳</span>}
                  {saving
                    ? 'Saving...'
                    : productId
                      ? 'Save Changes'
                      : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  disabled={saving}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </RoleBasedRoute>
  );
};

export default ProductEditPage;
