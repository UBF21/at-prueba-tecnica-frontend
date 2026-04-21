import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useValiValid } from 'vali-valid-react';
import { rule } from 'vali-valid';
import { useCreateOrderMutation, useUpdateOrderMutation } from '../hooks/useOrderMutations';
import { useCustomersComboBox } from '../hooks/useCustomersComboBox';
import { Dropdown } from './Dropdown';
import type { Order, OrderStatus, CreateOrderRequest, UpdateOrderRequest } from '../types';

interface OrderFormProps {
  order?: Order;
  onSuccess?: () => void;
}

/**
 * Order form with Vali-Valid validation
 * Used for create/edit in Sheet drawer
 */
export function OrderForm({ order, onSuccess }: OrderFormProps) {
  const createMutation = useCreateOrderMutation();
  const updateMutation = useUpdateOrderMutation();
  const { data: customers, isLoading: customersLoading } = useCustomersComboBox();

  const { form, errors, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } = useValiValid({
    initial: {
      orderNumber: order?.orderNumber || '',
      customerId: order?.customerId || '',
      status: order?.status || 'Pending',
    },
    validations: [
      {
        field: 'orderNumber',
        validations: rule()
          .required('Número de orden requerido')
          .maxLength(50, 'Máximo 50 caracteres')
          .build(),
      },
      {
        field: 'customerId',
        validations: !order
          ? rule()
              .required('Cliente requerido')
              .build()
          : rule().build(),
      },
    ],
    validateOnBlur: true,
    validateOnSubmit: true,
    validateOnMount: true,
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      if (order) {
        // Update existing order
        const updateData: UpdateOrderRequest = {
          orderNumber: values.orderNumber,
          status: values.status as OrderStatus,
        };
        await updateMutation.mutateAsync({
          id: order.id,
          data: updateData,
        });
      } else {
        // Create new order
        const createData: CreateOrderRequest = {
          orderNumber: values.orderNumber,
          customerId: values.customerId,
        };
        await createMutation.mutateAsync(createData);
      }

      onSuccess?.();
    } catch (error) {
      // Errors are handled by mutations
    }
  });

  const fieldVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08 },
    }),
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }} className="space-y-5">
      {/* Order Number */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fieldVariants}
      >
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Número de Orden *
        </label>
        <input
          type="text"
          value={form.orderNumber}
          onChange={(e) => handleChange('orderNumber', e.target.value)}
          onBlur={() => handleBlur('orderNumber')}
          className={`w-full px-4 py-3 bg-surface-overlay border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-dim transition-colors duration-200 ${
            errors.orderNumber ? 'border-semantic-danger' : 'border-border-default'
          }`}
          placeholder="ORD-001"
          disabled={isSubmitting}
        />
        {errors.orderNumber?.[0] && (
          <p className="text-semantic-danger text-xs mt-2">{errors.orderNumber[0]}</p>
        )}
      </motion.div>

      {/* Customer Select */}
      {!order && (
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
        >
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Cliente *
          </label>
          <Dropdown
            value={form.customerId}
            onChange={(value) => handleChange('customerId', value)}
            options={customers || []}
            placeholder="Seleccionar cliente..."
            disabled={isSubmitting}
            isLoading={customersLoading}
            error={errors.customerId?.[0]}
          />
        </motion.div>
      )}

      {/* Status (Edit only) */}
      {order && (
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fieldVariants}
        >
          <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Estado
            <div className="relative group">
              <Info size={13} className="text-text-muted cursor-help" />
              <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-10 w-56 bg-surface-overlay border border-border-default rounded-lg p-2.5 text-xs text-text-secondary shadow-lg normal-case tracking-normal">
                <p className="font-semibold text-text-primary mb-1">Orden de transiciones:</p>
                <p>Pendiente → Procesando → Enviado → Entregado</p>
                <p className="mt-1 text-text-muted">Cualquier estado → Cancelado</p>
              </div>
            </div>
          </label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value as OrderStatus)}
            onBlur={() => handleBlur('status')}
            className="w-full px-4 py-3 bg-surface-overlay border border-border-default rounded-lg text-text-primary focus:outline-none focus:border-gold-dim transition-colors duration-200"
            disabled={isSubmitting}
          >
            <option value="Pending">Pendiente</option>
            <option value="Processing">Procesando</option>
            <option value="Shipped">Enviado</option>
            <option value="Delivered">Entregado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
          {errors.status?.[0] && (
            <p className="text-semantic-danger text-xs mt-2">{errors.status[0]}</p>
          )}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fieldVariants}
        className="flex gap-2 pt-5 border-t border-border-default mt-6"
      >
        <motion.button
          whileHover={isValid && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
          type="submit"
          disabled={isSubmitting || !isValid}
          className="flex-1 px-4 py-3 bg-gold-primary hover:bg-gold-bright disabled:bg-gold-muted text-surface-base rounded-lg font-semibold transition-all duration-200"
        >
          {isSubmitting
            ? 'Guardando...'
            : order
              ? 'Actualizar Orden'
              : 'Crear Orden'}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default OrderForm;
