import { useState } from 'react';
import { useCreateOrderMutation, useUpdateOrderMutation } from '../hooks/useOrderMutations';
import type { Order, OrderStatus, CreateOrderRequest, UpdateOrderRequest } from '../types';

interface OrderFormProps {
  order?: Order;
  onSuccess?: () => void;
}

interface FormErrors {
  orderNumber?: string;
  customerId?: string;
  status?: string;
}

/**
 * Order form with Vali-Valid validation
 * Used for create/edit in Sheet drawer
 */
export function OrderForm({ order, onSuccess }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: order?.orderNumber || '',
    customerId: order?.customerId || 1,
    status: order?.status || 'Pending',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useCreateOrderMutation();
  const updateMutation = useUpdateOrderMutation();

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Número de orden es requerido';
    } else if (formData.orderNumber.length > 50) {
      newErrors.orderNumber = 'El número de orden debe ser menor a 50 caracteres';
    }

    if (!order && formData.customerId <= 0) {
      newErrors.customerId = 'ID del cliente debe ser mayor a 0';
    }

    if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(formData.status)) {
      newErrors.status = 'Estado inválido';
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
      if (order) {
        // Update existing order
        const updateData: UpdateOrderRequest = {
          orderNumber: formData.orderNumber,
          status: formData.status as any,
        };
        await updateMutation.mutateAsync({
          id: order.id,
          data: updateData,
        });
      } else {
        // Create new order
        const createData: CreateOrderRequest = {
          orderNumber: formData.orderNumber,
          customerId: formData.customerId,
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
      {/* Order Number */}
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Número de Orden *
        </label>
        <input
          type="text"
          value={formData.orderNumber}
          onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
          className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.orderNumber ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="ORD-001"
          disabled={isSubmitting}
        />
        {errors.orderNumber && (
          <p className="text-red-400 text-xs mt-1">{errors.orderNumber}</p>
        )}
      </div>

      {/* Customer ID */}
      {!order && (
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            ID Cliente *
          </label>
          <input
            type="number"
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })}
            className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customerId ? 'border-red-500' : 'border-slate-600'
            }`}
            placeholder="1"
            disabled={isSubmitting}
          />
          {errors.customerId && (
            <p className="text-red-400 text-xs mt-1">{errors.customerId}</p>
          )}
        </div>
      )}

      {/* Status (Edit only) */}
      {order && (
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Estado
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="Pending">Pendiente</option>
            <option value="Processing">Procesando</option>
            <option value="Shipped">Enviado</option>
            <option value="Delivered">Entregado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
          {errors.status && (
            <p className="text-red-400 text-xs mt-1">{errors.status}</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition"
        >
          {isSubmitting
            ? 'Guardando...'
            : order
              ? 'Actualizar Orden'
              : 'Crear Orden'}
        </button>
      </div>
    </form>
  );
}

export default OrderForm;
