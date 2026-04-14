import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { PedidoForm } from '../components/PedidoForm';
import { useCreatePedido } from '../hooks/usePedidoMutations';

function CreatePedidoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const createMutation = useCreatePedido();

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
    await createMutation.mutateAsync(data);
    navigate('/pedidos', { replace: true });
  };

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

        <h1 className="text-3xl font-bold mb-6">Crear Nuevo Pedido</h1>

        <div className="bg-slate-800 p-6 rounded-lg">
          <PedidoForm
            onSubmit={handleSubmit}
            loading={createMutation.isPending}
            mode="create"
          />
        </div>
      </div>
    </div>
  );
}

export default CreatePedidoPage;
