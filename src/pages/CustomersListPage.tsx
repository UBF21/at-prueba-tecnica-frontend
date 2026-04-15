import { useState } from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '../components/DataTable';
import { Sheet } from '../components/Sheet';
import { CustomerForm } from '../components/CustomerForm';
import { DeleteConfirmationSheet } from '../components/DeleteConfirmationSheet';
import { useCustomers } from '../hooks/useCustomers';
import { useCustomerColumns } from '../hooks/useCustomerColumns';
import { useDeleteCustomerMutation } from '../hooks/useCustomerMutations';
import type { GetCustomersParams, Customer } from '../types';

function CustomersListPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const params: GetCustomersParams = {
    page: pageIndex + 1,
    pageSize,
  };

  const deleteCustomerMutation = useDeleteCustomerMutation();
  const { data: response, isLoading, error } = useCustomers(params);
  const customerColumns = useCustomerColumns((customerId) => {
    setCustomerToDelete(customerId);
    setDeleteConfirmationOpen(true);
  });

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-semantic-danger text-lg">
          Error al cargar clientes. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  const customers = response?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-surface-base text-text-primary p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with decorative line */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold-primary to-gold-bright bg-clip-text text-transparent">
              Gestión de Clientes
            </h1>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-gold-primary to-transparent rounded-full" />
        </motion.div>

        {/* Create button */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex justify-between items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCustomer(undefined);
              setIsSheetOpen(true);
            }}
            className="px-8 py-3 bg-gradient-to-r from-gold-primary to-gold-bright hover:shadow-lg hover:shadow-gold-primary/50 text-surface-base font-bold rounded-lg transition-all duration-200 shadow-lg uppercase tracking-wider text-sm"
          >
            + Crear Cliente
          </motion.button>
        </motion.div>

        {/* Table or empty state */}
        {customers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <DataTable
              columns={customerColumns}
              data={customers}
              isLoading={isLoading}
              totalPages={response?.totalPages || 1}
              currentPage={pageIndex}
              onPageChange={setPageIndex}
              onRowClick={(customer) => {
                setSelectedCustomer(customer);
                setIsSheetOpen(true);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center py-16 bg-surface-raised rounded-lg border border-border-default"
          >
            <p className="text-text-secondary text-lg mb-6">No hay clientes</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCustomer(undefined);
                setIsSheetOpen(true);
              }}
              className="px-6 py-3 bg-gold-primary hover:bg-gold-bright text-surface-base font-semibold rounded-lg transition-all duration-200"
            >
              Crear el primer cliente
            </motion.button>
          </motion.div>
        )}

        {/* Sheet drawer */}
        <Sheet
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSelectedCustomer(undefined);
          }}
          title={selectedCustomer ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
        >
          <CustomerForm
            customer={selectedCustomer}
            onSuccess={() => {
              setIsSheetOpen(false);
              setSelectedCustomer(undefined);
            }}
          />
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationSheet
          isOpen={deleteConfirmationOpen}
          onClose={() => {
            setDeleteConfirmationOpen(false);
            setCustomerToDelete(null);
          }}
          onConfirm={() => {
            if (customerToDelete) {
              deleteCustomerMutation.mutate(customerToDelete);
            }
          }}
          onSuccess={() => {
            setIsSheetOpen(false);
            setSelectedCustomer(undefined);
          }}
          itemName="este cliente"
          isLoading={deleteCustomerMutation.isPending}
        />
      </div>
    </motion.div>
  );
}

export default CustomersListPage;
