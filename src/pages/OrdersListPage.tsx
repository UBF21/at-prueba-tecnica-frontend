import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { Sheet } from '../components/Sheet';
import { OrderForm } from '../components/OrderForm';
import { DeleteConfirmationSheet } from '../components/DeleteConfirmationSheet';
import { useOrders } from '../hooks/useOrders';
import { useOrderColumns } from '../hooks/useOrderColumns';
import { useDeleteOrderMutation } from '../hooks/useOrderMutations';
import { useCustomers } from '../hooks/useCustomers';
import type { GetOrdersParams, Order } from '../types';

function OrdersListPage() {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const params: GetOrdersParams = {
    page: pageIndex + 1,
    pageSize,
  };

  const deleteOrderMutation = useDeleteOrderMutation();

  const { data: customersResponse } = useCustomers({ page: 1, pageSize: 1 });
  const hasCustomers = (customersResponse?.data?.length ?? 0) > 0;

  const { data: response, isLoading, error } = useOrders(params);

  function handleOpenCreateOrder() {
    if (!hasCustomers) {
      toast.warning('No hay clientes registrados', {
        description: 'Primero debes crear al menos un cliente antes de poder crear una orden.',
        action: {
          label: 'Ir a Clientes',
          onClick: () => navigate('/customers'),
        },
      });
      return;
    }
    setSelectedOrder(undefined);
    setIsSheetOpen(true);
  }
  const orderColumns = useOrderColumns((orderId) => {
    setOrderToDelete(orderId);
    setDeleteConfirmationOpen(true);
  });

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-semantic-danger text-lg">
          Error al cargar órdenes. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  const orders = response?.data || [];

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
              Gestión de Órdenes
            </h1>
            {response?.total !== undefined && (
              <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-dim/40 text-gold-primary text-sm font-semibold">
                {response.total} {response.total === 1 ? 'orden' : 'órdenes'}
              </span>
            )}
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
            onClick={handleOpenCreateOrder}
            className="px-8 py-3 bg-gradient-to-r from-gold-primary to-gold-bright hover:shadow-lg hover:shadow-gold-primary/50 text-surface-base font-bold rounded-lg transition-all duration-200 shadow-lg uppercase tracking-wider text-sm"
          >
            + Crear Orden
          </motion.button>
        </motion.div>

        {/* Table or empty state */}
        {orders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <DataTable
              columns={orderColumns}
              data={orders}
              isLoading={isLoading}
              totalPages={response?.totalPages || 1}
              currentPage={pageIndex}
              onPageChange={setPageIndex}
              onRowClick={(order) => {
                setSelectedOrder(order);
                setIsSheetOpen(true);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center py-20 bg-surface-raised rounded-lg border border-border-default"
          >
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="p-5 rounded-full bg-gold-primary/10 border border-gold-dim/30">
                <ShoppingCart size={36} className="text-gold-primary opacity-60" />
              </div>
              <div>
                <p className="text-text-primary font-semibold text-lg">Sin órdenes todavía</p>
                <p className="text-text-muted text-sm mt-1">Crea tu primera orden para comenzar</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCreateOrder}
              className="px-6 py-3 bg-gold-primary hover:bg-gold-bright text-surface-base font-semibold rounded-lg transition-all duration-200"
            >
              Crear la primera orden
            </motion.button>
          </motion.div>
        )}

        {/* Sheet drawer */}
        <Sheet
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSelectedOrder(undefined);
          }}
          title={selectedOrder ? 'Editar Orden' : 'Crear Nueva Orden'}
        >
          <OrderForm
            order={selectedOrder}
            onSuccess={() => {
              setIsSheetOpen(false);
              setSelectedOrder(undefined);
            }}
          />
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationSheet
          isOpen={deleteConfirmationOpen}
          onClose={() => {
            setDeleteConfirmationOpen(false);
            setOrderToDelete(null);
          }}
          onConfirm={() => {
            if (orderToDelete) {
              deleteOrderMutation.mutate(orderToDelete);
            }
          }}
          onSuccess={() => {
            setIsSheetOpen(false);
            setSelectedOrder(undefined);
          }}
          itemName="esta orden"
          isLoading={deleteOrderMutation.isPending}
        />
      </div>
    </motion.div>
  );
}

export default OrdersListPage;
