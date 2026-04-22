import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Sheet } from '../components/Sheet';
import { ProductForm } from '../components/ProductForm';
import { DeleteConfirmationSheet } from '../components/DeleteConfirmationSheet';
import { useProducts } from '../hooks/useProducts';
import { useProductColumns } from '../hooks/useProductColumns';
import { useDeleteProductMutation } from '../hooks/useProductMutations';
import { useIsAdmin } from '../hooks/useAuth';
import type { Product } from '../types';

function ProductsListPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const deleteProductMutation = useDeleteProductMutation();
  const isAdmin = useIsAdmin();
  const { data: response, isLoading, error } = useProducts({
    page: pageIndex + 1,
    pageSize,
  });
  const productColumns = useProductColumns((productId) => {
    setProductToDelete(productId);
    setDeleteConfirmationOpen(true);
  });

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-semantic-danger text-lg">
          Error al cargar productos. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  const products = response?.data || [];

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
              Gestión de Productos
            </h1>
            {response?.total !== undefined && (
              <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-dim/40 text-gold-primary text-sm font-semibold">
                {response.total} {response.total === 1 ? 'producto' : 'productos'}
              </span>
            )}
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-gold-primary to-transparent rounded-full" />
        </motion.div>

        {/* Create button */}
        {isAdmin && (
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
                setSelectedProduct(undefined);
                setIsSheetOpen(true);
              }}
              className="px-8 py-3 bg-gradient-to-r from-gold-primary to-gold-bright hover:shadow-lg hover:shadow-gold-primary/50 text-surface-base font-bold rounded-lg transition-all duration-200 shadow-lg uppercase tracking-wider text-sm"
            >
              + Crear Producto
            </motion.button>
          </motion.div>
        )}

        {/* Table or empty state */}
        {products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <DataTable
              columns={productColumns}
              data={products}
              isLoading={isLoading}
              totalPages={response?.totalPages || 1}
              currentPage={pageIndex}
              onPageChange={setPageIndex}
              onRowClick={isAdmin ? (product) => {
                setSelectedProduct(product);
                setIsSheetOpen(true);
              } : undefined}
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
                <Package size={36} className="text-gold-primary opacity-60" />
              </div>
              <div>
                <p className="text-text-primary font-semibold text-lg">Sin productos todavía</p>
                <p className="text-text-muted text-sm mt-1">Crea tu primer producto para incluirlo en las órdenes</p>
              </div>
            </div>
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedProduct(undefined);
                  setIsSheetOpen(true);
                }}
                className="px-6 py-3 bg-gold-primary hover:bg-gold-bright text-surface-base font-semibold rounded-lg transition-all duration-200"
              >
                Crear el primer producto
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Sheet drawer */}
        <Sheet
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSelectedProduct(undefined);
          }}
          title={selectedProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
        >
          <ProductForm
            product={selectedProduct}
            onSuccess={() => {
              setIsSheetOpen(false);
              setSelectedProduct(undefined);
            }}
          />
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationSheet
          isOpen={deleteConfirmationOpen}
          onClose={() => {
            setDeleteConfirmationOpen(false);
            setProductToDelete(null);
          }}
          onConfirm={() => {
            if (productToDelete) {
              deleteProductMutation.mutate(productToDelete);
            }
          }}
          onSuccess={() => {
            setIsSheetOpen(false);
            setSelectedProduct(undefined);
          }}
          itemName="este producto"
          isLoading={deleteProductMutation.isPending}
        />
      </div>
    </motion.div>
  );
}

export default ProductsListPage;
