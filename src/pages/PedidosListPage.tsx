import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { usePedidos } from '../hooks/usePedidos';
import { useDeletePedido } from '../hooks/usePedidoMutations';
import { removeToken } from '../api/auth';

function PedidosListPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: pedidos, isLoading, error } = usePedidos();
  const deletemutation = useDeletePedido();

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
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      deletemutation.mutate(id);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-lg">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-red-400 text-lg">
          Error al cargar pedidos. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-900 text-white p-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gestión de Pedidos</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate('/pedidos/nuevo')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
          >
            + Crear Pedido
          </button>
        </div>

        {pedidos && pedidos.length > 0 ? (
          <div className="overflow-x-auto bg-slate-800 rounded-lg">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left">Número</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="border-t border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4">{pedido.numeroPedido}</td>
                    <td className="px-6 py-4">${pedido.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded text-sm font-semibold ${
                          pedido.estado === 'Completado'
                            ? 'bg-green-600'
                            : pedido.estado === 'Procesando'
                              ? 'bg-yellow-600'
                              : pedido.estado === 'Cancelado'
                                ? 'bg-red-600'
                                : 'bg-slate-600'
                        }`}
                      >
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(pedido.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/pedidos/${pedido.id}/editar`)
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pedido.id)}
                        disabled={deletemutation.isPending}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded text-sm transition"
                      >
                        {deletemutation.isPending ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-lg mb-4">No hay pedidos</p>
            <button
              onClick={() => navigate('/pedidos/nuevo')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
            >
              Crear el primer pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PedidosListPage;
