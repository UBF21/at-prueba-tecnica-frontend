import { useState } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from '../hooks/useProductMutations';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  description?: string;
  unitPrice?: string;
  stock?: string;
}

/**
 * Product form with validation
 * Used for create/edit in Sheet drawer
 */
export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    unitPrice: product?.unitPrice || 0,
    stock: product?.stock || 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre del producto es requerido';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre debe ser menor a 100 caracteres';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La descripción debe ser menor a 500 caracteres';
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'El precio debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (product) {
        // Update existing product
        const updateData: UpdateProductRequest = {
          name: formData.name,
          description: formData.description || undefined,
          unitPrice: formData.unitPrice,
          stock: formData.stock,
        };
        await updateMutation.mutateAsync({
          id: product.id,
          data: updateData,
        });
      } else {
        // Create new product
        const createData: CreateProductRequest = {
          name: formData.name,
          description: formData.description || undefined,
          unitPrice: formData.unitPrice,
          stock: formData.stock,
        };
        await createMutation.mutateAsync(createData);
      }

      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Nombre del Producto *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="Producto ABC"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="Descripción del producto..."
          rows={3}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-red-400 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Unit Price */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Precio Unitario *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.unitPrice}
          onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
          className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.unitPrice ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="0.00"
          disabled={isSubmitting}
        />
        {errors.unitPrice && (
          <p className="text-red-400 text-xs mt-1">{errors.unitPrice}</p>
        )}
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Stock *
        </label>
        <input
          type="number"
          min="0"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
          className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.stock ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="0"
          disabled={isSubmitting}
        />
        {errors.stock && (
          <p className="text-red-400 text-xs mt-1">{errors.stock}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition"
        >
          {isSubmitting
            ? 'Guardando...'
            : product
              ? 'Actualizar Producto'
              : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
