import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import OrdersListPage from './pages/OrdersListPage';
import ProductsListPage from './pages/ProductsListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductsListPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route path="*" element={<Navigate to="/orders" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
