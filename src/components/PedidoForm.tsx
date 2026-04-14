import { useState } from 'react';
import type { UpdatePedidoRequest, EstadoPedido } from '../types';

interface PedidoFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  initialData?: {
    numeroPedido?: string;
    total?: number;
    estado?: EstadoPedido;
  };
  mode?: 'create' | 'edit';
}

export function PedidoForm({
  onSubmit,
  loading = false,
  initialData = {},
  mode = 'create',
}: PedidoFormProps) {
  const [numeroPedido, setNumeroPedido] = useState(
    initialData.numeroPedido || ''
  );
  const [total, setTotal] = useState(initialData.total || '');
  const [estado, setEstado] = useState<EstadoPedido>(
    initialData.estado || 'Pendiente'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!numeroPedido || !total) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (Number(total) <= 0) {
      setError('El total debe ser mayor a 0');
      return;
    }

    try {
      if (mode === 'create') {
        await onSubmit({
          numeroPedido,
          total: Number(total),
          clienteId: 1, // Default client ID for demo
        });
      } else {
        await onSubmit({
          total: Number(total),
          estado,
        } as UpdatePedidoRequest);
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar el pedido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 text-red-400 rounded">
          {error}
        </div>
      )}

      {mode === 'create' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Número de Pedido
          </label>
          <input
            type="text"
            value={numeroPedido}
            onChange={(e) => setNumeroPedido(e.target.value)}
            placeholder="PED-001"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Total
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="100.00"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      {mode === 'edit' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoPedido)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Procesando">Procesando</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded transition"
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
