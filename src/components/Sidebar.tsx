import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingCart,
  Users,
  Package,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react';
import { removeToken, getCurrentUser } from '../api/auth';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);

  const navItems = [
    { path: '/orders', icon: ShoppingCart, label: 'Órdenes', id: 'orders' },
    { path: '/customers', icon: Users, label: 'Clientes', id: 'customers' },
    { path: '/products', icon: Package, label: 'Productos', id: 'products' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    removeToken();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-40 p-3 bg-gold-primary hover:bg-gold-bright text-surface-base rounded-lg md:hidden shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Main Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 256 : 80,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative left-0 top-0 h-screen bg-gradient-to-b from-surface-raised to-surface-overlay border-r border-border-default z-40 md:z-0 flex flex-col overflow-hidden transition-transform duration-300 md:translate-x-0`}
      >
        {/* Header with logo and toggle */}
        <div className="p-4 border-b border-border-default flex items-center justify-between h-20">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gold-primary to-gold-bright rounded-lg flex items-center justify-center font-bold text-surface-base text-lg">
                  ✦
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-text-primary text-sm">AT</span>
                  <span className="text-xs text-text-secondary">Technical Test</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 bg-gradient-to-br from-gold-primary to-gold-bright rounded-lg flex items-center justify-center font-bold text-surface-base text-lg mx-auto"
              >
                ✦
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsExpanded(!isExpanded);
              setHoveredItem(null);
            }}
            className="p-2 hover:bg-surface-muted rounded-lg transition-colors hidden md:flex"
          >
            <ChevronRight
              size={20}
              className={`text-gold-primary transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </motion.button>
        </div>

        {/* User Info - Expanded only */}
        {isExpanded && currentUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 border-b border-border-default"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-primary/20 border border-gold-dim flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gold-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gold-primary font-semibold capitalize">
                  {currentUser.role}
                </p>
                <p className="text-sm font-semibold text-text-primary truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => !isExpanded && setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                    active
                      ? 'bg-gold-primary/20 border border-gold-dim text-gold-primary shadow-lg'
                      : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                  }`}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>

                {/* Tooltip when collapsed */}
                {!isExpanded && hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-20 top-3 bg-surface-overlay border border-border-emphasis rounded-lg px-3 py-2 whitespace-nowrap text-sm font-medium text-text-primary shadow-xl pointer-events-none z-50"
                  >
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-surface-overlay" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="border-t border-border-default p-3">
          <div
            className="relative"
            onMouseEnter={() => !isExpanded && setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isExpanded
                  ? 'bg-semantic-danger/10 hover:bg-semantic-danger/20 text-semantic-danger'
                  : 'bg-semantic-danger/10 hover:bg-semantic-danger/20 text-semantic-danger'
              }`}
            >
              <LogOut size={22} className="flex-shrink-0" />
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium"
                >
                  Cerrar
                </motion.span>
              )}
            </motion.button>

            {/* Tooltip when collapsed */}
            {!isExpanded && hoveredItem === 'logout' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-20 bottom-3 bg-surface-overlay border border-border-emphasis rounded-lg px-3 py-2 whitespace-nowrap text-sm font-medium text-semantic-danger shadow-xl pointer-events-none z-50"
              >
                Cerrar Sesión
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-surface-overlay" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
}
