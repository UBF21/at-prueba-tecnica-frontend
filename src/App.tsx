import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import PedidosListPage from './pages/PedidosListPage';
import CreatePedidoPage from './pages/CreatePedidoPage';
import EditPedidoPage from './pages/EditPedidoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <PedidosListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos/nuevo"
          element={
            <PrivateRoute>
              <CreatePedidoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos/:id/editar"
          element={
            <PrivateRoute>
              <EditPedidoPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/pedidos" replace />} />
        <Route path="*" element={<Navigate to="/pedidos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
