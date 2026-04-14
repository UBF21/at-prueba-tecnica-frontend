import { motion } from 'framer-motion';
import { useValiValid } from 'vali-valid-react';
import { rule } from 'vali-valid';
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '../hooks/useCustomerMutations';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types';

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}

/**
 * Customer form with Vali-Valid validation
 * Used for create/edit in Sheet drawer
 */
export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const createMutation = useCreateCustomerMutation();
  const updateMutation = useUpdateCustomerMutation();

  const { form, errors, handleChange, handleBlur, handleSubmit, isSubmitting, isValid } = useValiValid({
    initial: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
    },
    validations: [
      {
        field: 'name',
        validations: rule()
          .required('El nombre es requerido')
          .maxLength(100, 'Máximo 100 caracteres')
          .build(),
      },
      {
        field: 'email',
        validations: rule()
          .required('El email es requerido')
          .email('El email debe ser válido')
          .maxLength(100, 'Máximo 100 caracteres')
          .build(),
      },
      {
        field: 'phone',
        validations: rule()
          .maxLength(20, 'Máximo 20 caracteres')
          .build(),
      },
      {
        field: 'address',
        validations: rule()
          .maxLength(500, 'Máximo 500 caracteres')
          .build(),
      },
    ],
    validateOnBlur: true,
    validateOnSubmit: true,
    validateOnMount: true,
  });

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      if (customer) {
        // Update existing customer
        const updateData: UpdateCustomerRequest = {
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          address: values.address || undefined,
        };
        await updateMutation.mutateAsync({
          id: customer.id,
          data: updateData,
        });
      } else {
        // Create new customer
        const createData: CreateCustomerRequest = {
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          address: values.address || undefined,
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
      {/* Name */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fieldVariants}
      >
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Nombre *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={`w-full px-4 py-3 bg-surface-overlay border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-dim transition-colors duration-200 ${
            errors.name ? 'border-semantic-danger' : 'border-border-default'
          }`}
          placeholder="Juan Pérez"
          disabled={isSubmitting}
        />
        {errors.name?.[0] && (
          <p className="text-semantic-danger text-xs mt-2">{errors.name[0]}</p>
        )}
      </motion.div>

      {/* Email */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fieldVariants}
      >
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Email *
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`w-full px-4 py-3 bg-surface-overlay border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-dim transition-colors duration-200 ${
            errors.email ? 'border-semantic-danger' : 'border-border-default'
          }`}
          placeholder="juan@ejemplo.com"
          disabled={isSubmitting}
        />
        {errors.email?.[0] && (
          <p className="text-semantic-danger text-xs mt-2">{errors.email[0]}</p>
        )}
      </motion.div>

      {/* Phone */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fieldVariants}
      >
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Teléfono
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          className={`w-full px-4 py-3 bg-surface-overlay border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-dim transition-colors duration-200 ${
            errors.phone ? 'border-semantic-danger' : 'border-border-default'
          }`}
          placeholder="+56912345678"
          disabled={isSubmitting}
        />
        {errors.phone?.[0] && (
          <p className="text-semantic-danger text-xs mt-2">{errors.phone[0]}</p>
        )}
      </motion.div>

      {/* Address */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fieldVariants}
      >
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Dirección
        </label>
        <textarea
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
          className={`w-full px-4 py-3 bg-surface-overlay border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-gold-dim transition-colors duration-200 resize-none ${
            errors.address ? 'border-semantic-danger' : 'border-border-default'
          }`}
          placeholder="Calle principal 123, Apto 4B"
          rows={3}
          disabled={isSubmitting}
        />
        {errors.address?.[0] && (
          <p className="text-semantic-danger text-xs mt-2">{errors.address[0]}</p>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.div
        custom={4}
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
          className="flex-1 px-4 py-3 bg-gold-primary hover:bg-gold-bright disabled:bg-gold-muted disabled:cursor-not-allowed text-surface-base rounded-lg font-semibold transition-all duration-200"
        >
          {isSubmitting
            ? 'Guardando...'
            : customer
              ? 'Actualizar Cliente'
              : 'Crear Cliente'}
        </motion.button>
      </motion.div>
    </form>
  );
}

export default CustomerForm;
