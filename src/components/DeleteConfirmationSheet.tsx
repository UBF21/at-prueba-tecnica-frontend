import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sheet } from './Sheet';

interface DeleteConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  onSuccess?: () => void;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationSheet({
  isOpen,
  onClose,
  onConfirm,
  onSuccess,
  itemName = 'este registro',
  isLoading = false,
}: DeleteConfirmationSheetProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
      onSuccess?.();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Confirmar eliminación">
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <p className="text-text-primary">
            ¿Estás seguro de que deseas eliminar {itemName}?
          </p>
          <p className="text-text-secondary text-sm">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border-default">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={isDeleting || isLoading}
            className="flex-1 px-4 py-3 bg-surface-muted hover:bg-surface-overlay text-text-primary rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={isDeleting || isLoading}
            className="flex-1 px-4 py-3 bg-semantic-danger hover:bg-semantic-danger/80 disabled:bg-semantic-danger/50 text-white rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isDeleting || isLoading ? 'Eliminando...' : 'Eliminar'}
          </motion.button>
        </div>
      </div>
    </Sheet>
  );
}
