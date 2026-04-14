import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useOrders } from '../hooks/useOrders';
import { useDeleteOrderMutation } from '../hooks/useOrderMutations';
import { removeToken } from '../api/auth';
import type { GetOrdersParams, OrderStatus } from '../types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-slate-600',
  Processing: 'bg-yellow-600',
  Shipped: 'bg-blue-600',
  Delivered: 'bg-green-600',
  Cancelled: 'bg-red-600',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Pendiente',
  Processing: 'Procesando',
  Shipped: 'Enviado',
  Delivered: 'Entregado',
  Cancelled: 'Cancelado',
};

function OrdersListPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [params, setParams] = useState<GetOrdersParams>({
    page: 1,
    pageSize: 10,
  });

  const { data: response, isLoading, error } = useOrders(params);
  const deleteMutation = useDeleteOrderMutation();

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

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login', { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
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
  const totalPages = response?.totalPages || 1;
  const currentPage = response?.page || 1;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-900 text-white p-8"
    >
      <div className="max-w-6xl mx-auto">
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
            onClick={() => navigate('/orders/nuevo')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
          >
            + Crear Orden
          </button>
        </div>

        {orders.length > 0 ? (
          <>
            <div className="overflow-x-auto bg-slate-800 rounded-lg mb-6">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Número de Orden</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Creado</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-slate-700 hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4">{order.orderNumber}</td>
                      <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/orders/${order.id}/editar`)
                          }
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded text-sm transition"
                        >
                          {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 rounded transition"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded transition ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 rounded transition"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-lg mb-4">No hay órdenes</p>
            <button
              onClick={() => navigate('/orders/nuevo')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
            >
              Crear la primera orden
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersListPage;
