import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { DataTable } from '../components/DataTable';
import { Sheet } from '../components/Sheet';
import { OrderForm } from '../components/OrderForm';
import { useOrders } from '../hooks/useOrders';
import { useOrderColumns } from '../hooks/useOrderColumns';
import { removeToken } from '../api/auth';
import type { GetOrdersParams, Order } from '../types';

function OrdersListPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [params] = useState<GetOrdersParams>({
    page: 1,
    pageSize: 10,
  });

  const { data: response, isLoading, error } = useOrders(params);
  const orderColumns = useOrderColumns();

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
        <p className="text-white text-lg">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-red-400 text-lg">
          Error al cargar órdenes. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  const orders = response?.data || [];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-900 text-white p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gestión de Órdenes</h1>
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
              setSelectedOrder(undefined);
              setIsSheetOpen(true);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
          >
            + Crear Orden
          </button>
        </div>

        {orders.length > 0 ? (
          <DataTable
            columns={orderColumns}
            data={orders}
            pageSize={10}
            onRowClick={(order) => {
              setSelectedOrder(order);
              setIsSheetOpen(true);
            }}
          />
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-lg mb-4">No hay órdenes</p>
            <button
              onClick={() => {
                setSelectedOrder(undefined);
                setIsSheetOpen(true);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
            >
              Crear la primera orden
            </button>
          </div>
        )}

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
      </div>
    </div>
  );
}

export default OrdersListPage;
