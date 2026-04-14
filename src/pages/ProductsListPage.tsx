import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { DataTable } from '../components/DataTable';
import { Sheet } from '../components/Sheet';
import { ProductForm } from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { useProductColumns } from '../hooks/useProductColumns';
import { removeToken } from '../api/auth';
import type { Product } from '../types';

function ProductsListPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const { data: response, isLoading, error } = useProducts({
    page: 1,
    pageSize: 10,
  });
  const productColumns = useProductColumns();

  useEffect(() => {
    // GSAP entrance animation
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-lg">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-red-400 text-lg">
          Error al cargar productos. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  const products = response?.data || [];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-900 text-white p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gestión de Productos</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              setSelectedProduct(undefined);
              setIsSheetOpen(true);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
          >
            + Crear Producto
          </button>
        </div>

        {products.length > 0 ? (
          <DataTable
            columns={productColumns}
            data={products}
            pageSize={10}
            onRowClick={(product) => {
              setSelectedProduct(product);
              setIsSheetOpen(true);
            }}
          />
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-lg mb-4">No hay productos</p>
            <button
              onClick={() => {
                setSelectedProduct(undefined);
                setIsSheetOpen(true);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
            >
              Crear el primer producto
            </button>
          </div>
        )}

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
      </div>
    </div>
  );
}

export default ProductsListPage;
