import { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { usePedido } from '../hooks/usePedidos';
import { useUpdatePedido } from '../hooks/usePedidoMutations';
import { PedidoForm } from '../components/PedidoForm';

function EditPedidoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const pedidoId = Number(id);

  const { data: pedido, isLoading, error } = usePedido(pedidoId);
  const updateMutation = useUpdatePedido();

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

  const handleSubmit = async (data: any) => {
    await updateMutation.mutateAsync({
      id: pedidoId,
      data,
    });
    navigate('/pedidos', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-lg">Cargando pedido...</p>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-red-400 text-lg">
          Error al cargar el pedido. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-900 text-white p-8"
    >
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/pedidos')}
          className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-bold mb-2">Editar Pedido</h1>
        <p className="text-slate-400 mb-6">
          Número: {pedido.numeroPedido}
        </p>

        <div className="bg-slate-800 p-6 rounded-lg">
          <PedidoForm
            onSubmit={handleSubmit}
            loading={updateMutation.isPending}
            initialData={{
              numeroPedido: pedido.numeroPedido,
              total: pedido.total,
              estado: pedido.estado,
            }}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
}

export default EditPedidoPage;
