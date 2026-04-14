# 🎯 Reto Pedidos — Frontend

**Sistema de Gestión de Pedidos, Clientes y Productos**

Una aplicación frontend moderna y premium para gestión integral de operaciones comerciales.

---

## 📋 Sobre Esta Prueba Técnica

### Objetivo
Desarrollar una interfaz de usuario completa y profesional para un sistema CQRS de gestión de pedidos, demostrando dominio en:
- **Arquitectura frontend**: Components, hooks, state management
- **Validación de formularios**: Implementación de solución declarativa custom
- **UX/UI Premium**: Animaciones, loading states, feedback visual
- **Performance**: Paginación, fetching optimizado, caching
- **Integración Backend**: REST API, JWT, error handling

### Para Qué Empresa
Esta es una **prueba técnica fullstack senior**. Simula un caso real de e-commerce/ERP con:
- Gestión de pedidos con múltiples estados
- Catálogo de productos con stock
- Base de clientes con contactos
- Autenticación JWT

### Stack Utilizado

| Tecnología | Versión | Rol |
|---|---|---|
| **React** | 18.x | Framework UI |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 8.x | Build & dev server |
| **React Router** | 6.x | Client-side routing |
| **React Query (TanStack)** | 5.x | Server state management |
| **Framer Motion** | 11.x | Animaciones smooth |
| **Tailwind CSS** | 3.x | Styling utilitario |
| **Vali-Valid** | 3.1.0 | ⭐ Validación declarativa |
| **Vali-Valid-React** | 1.0.2 | ⭐ Hook para React |

**⭐ Tecnologías de Autoría Propia (Felipe Rafael Montenegro Morriberon):**
- **Vali-Valid**: Librería de validación declarativa para TypeScript/JavaScript
  - API fluida con builder pattern
  - Reglas composables (required, email, maxLength, etc)
  - Soporte para validación async
  - Errores tipados
  - [Documentación](https://vali-valid-docs.netlify.app)

- **Vali-Valid-React**: Hook `useValiValid` para integración con React
  - Gestión automática de estado de formulario
  - Touch tracking, dirty fields, submission state
  - Validación on-mount, on-blur, on-submit
  - Debouncing para validators async
  - [Documentación](https://vali-valid-docs.netlify.app/hook-api)

---

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── pages/                      # Páginas (LoginPage, OrdersListPage, etc)
├── components/                 # Componentes reutilizables
│   ├── DataTable.tsx          # Tabla premium con skeleton loading
│   ├── Sheet.tsx              # Drawer para formularios
│   ├── Dropdown.tsx           # Select personalizado con loading
│   ├── OrderForm.tsx          # Formulario órdenes + Vali-Valid
│   ├── CustomerForm.tsx       # Formulario clientes + Vali-Valid
│   ├── ProductForm.tsx        # Formulario productos + Vali-Valid
│   ├── DeleteConfirmationSheet.tsx
│   └── ...
├── hooks/                      # Custom hooks
│   ├── useOrders.ts           # Query para órdenes
│   ├── useCustomers.ts        # Query para clientes
│   ├── useProducts.ts         # Query para productos
│   ├── useOrderColumns.tsx    # Definición de columnas tabla
│   ├── useOrderMutations.ts   # Mutations CRUD órdenes
│   └── ...
├── api/                        # Configuración API
│   ├── client.ts              # Instancia HTTP
│   └── auth.ts                # Endpoints autenticación
├── types/                      # Tipos TypeScript
├── lib/                        # Utilidades
├── styles/                     # Variables Tailwind
└── main.tsx                    # Entry point

```

### Patrón Arquitectónico

**Component-Driven Architecture** con separación clara:
- **Presentational Components**: DataTable, Dropdown, Sheet (puros, sin lógica)
- **Container Components**: *ListPage (lógica, estado, data fetching)
- **Custom Hooks**: useOrders, useOrderMutations (encapsulan React Query)
- **API Layer**: client.ts, auth.ts (abstracción HTTP)

### Flujo de Datos

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (useOrderMutations)
    ↓
React Query Mutation
    ↓
API Request (fetch + JWT)
    ↓
Backend Response
    ↓
Error Handling / Success Toast
    ↓
Query Invalidation / Refetch
    ↓
UI Update
```

---

## 🎨 Características UI/UX Premium

### 1. **Validación Declarativa (Vali-Valid)**

Antes (validación manual):
```typescript
const [errors, setErrors] = useState({});
const validateForm = () => {
  const newErrors = {};
  if (!name) newErrors.name = 'Required';
  if (!email || !email.includes('@')) newErrors.email = 'Invalid';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

Ahora (declarativo con Vali-Valid):
```typescript
const { form, errors, handleChange, handleBlur, handleSubmit, isValid } = useValiValid({
  initial: { name: '', email: '' },
  validations: [
    { field: 'name', validations: rule().required('Required').maxLength(100).build() },
    { field: 'email', validations: rule().required().email('Invalid email').build() },
  ],
  validateOnBlur: true,
  validateOnSubmit: true,
  validateOnMount: true,  // ← Muestra campos requeridos al abrir sheet
});
```

**Ventajas:**
- ✅ Código más legible y mantenible
- ✅ Validaciones fired automáticamente en el momento correcto
- ✅ Errores tipados como arrays de strings
- ✅ Botón submit deshabilitado hasta formulario válido

### 2. **Skeleton Loading en Tablas**

DataTable muestra 7 filas de esqueleto pulsantes mientras carga:
```tsx
{isLoading ? (
  Array.from({ length: 7 }).map((_, i) => (
    <tr key={i} className="border-b border-border-default">
      <td className="p-4">
        <div className="h-4 w-40 bg-surface-muted/60 rounded animate-pulse" />
      </td>
      {/* más celdas esqueleto */}
    </tr>
  ))
) : (
  // datos reales
)}
```

### 3. **Dropdown con Loading State**

Durante fetch de clientes:
```tsx
<Dropdown
  isLoading={customersLoading}  // ← Propaga loading
  placeholder="Seleccionar cliente..."
/>
```

Muestra:
- Spinner SVG girando
- Texto "Cargando..."
- Button deshabilitado

### 4. **Login Button con Spinner**

```tsx
{loading && (
  <svg className="animate-spin h-4 w-4">
    {/* spinner icon */}
  </svg>
)}
{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
```

### 5. **Animaciones Framer Motion**

- ✨ Fade-in de componentes al montar
- 🔄 Slide-in de campos de formulario
- 📊 Stagger de filas de tabla
- 🎯 Hover/tap scales en botones

### 6. **Botones de Eliminar como Iconos**

Acción peligrosa representada como icono trash discreto:
```tsx
<motion.button
  className="p-2 text-semantic-danger/70 hover:text-semantic-danger hover:bg-semantic-danger/10"
  title="Eliminar orden"
>
  <svg>{/* trash icon */}</svg>
</motion.button>
```

---

## 🔐 Autenticación & Gestión de Datos

### Credenciales de Prueba

```
Email:    admin@retopedidos.com
Password: Admin123!
```

Disponibles también en LoginPage.tsx (línea 153-155) como hint para usuarios.

### Flujo de Autenticación

1. **Login** → POST `/api/auth/login` con email/password
2. **Token JWT** → Guardado en localStorage con `saveToken()`
3. **Requests Posteriores** → Header `Authorization: Bearer {token}`
4. **Logout** → Limpiar token y redirigir a `/login`

### Gestión de Peticiones

Usando **React Query (TanStack Query v5)**:

```typescript
// Fetch con caching y refetch automático
const { data: response, isLoading, error } = useOrders({ page: 1, pageSize: 10 });

// Mutations con invalidation automática
const createMutation = useCreateOrderMutation();
await createMutation.mutateAsync(data);
// ↓ Invalida query `orders` automáticamente
```

**Ventajas:**
- 🚀 Caching automático
- 🔄 Refetch en focus de ventana
- 📡 Deduplicación de requests
- ⏰ Background refetch

### Paginación

Implementada **server-side**:
```tsx
const [pageIndex, setPageIndex] = useState(0);
const { data: response } = useOrders({ page: pageIndex + 1, pageSize: 10 });
// DataTable maneja: currentPage, totalPages, onPageChange
```

---

## 🚀 Instalación & Desarrollo

### Requisitos Previos

- **Node.js 20+**
- **npm 10+** o **pnpm**
- Backend corriendo en `http://localhost:5001`

### Setup Inicial

```bash
cd ~/Documents/Proyectos/at-prueba-tecnica-frontend

# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev      # Servidor con HMR
npm run build    # Build para producción
npm run preview  # Preview de build
npm run lint     # Verificar ESLint
```

---

## 📋 Formularios & Validación

### CustomerForm

**Campos:**
- `name` — Requerido, máx 100 caracteres
- `email` — Requerido, formato email válido, máx 100 caracteres
- `phone` — Opcional, máx 20 caracteres
- `address` — Opcional, máx 500 caracteres

**Comportamiento:**
- Validación al desfocar (blur)
- Validación al montar (sheet abierto)
- Errores mostrados debajo de campo rojo
- Botón submit deshabilitado si hay errores

### ProductForm

**Campos:**
- `name` — Requerido, máx 100 caracteres
- `description` — Opcional, máx 500 caracteres
- `unitPrice` — Requerido, número decimal
- `stock` — Requerido, número entero

### OrderForm

**Campos:**
- `orderNumber` — Requerido, máx 50 caracteres (único en BD)
- `customerId` — Requerido solo en CREATE (dropdown con loading)
- `status` — Opcional, enum (Pending, Processing, Shipped, Delivered, Cancelled)

---

## 🎨 Design System

### Colores (Tailwind)

```css
/* Primarios (Gold) */
--gold-primary: #D4AF37
--gold-bright: #F1E068
--gold-dim: #A89D3C

/* Semánticos */
--semantic-danger: #EF4444
--semantic-success: #22C55E
--semantic-warning: #EAB308
--semantic-info: #3B82F6
--semantic-neutral: #6B7280

/* Superficies */
--surface-base: #000000
--surface-raised: #1A1A1A
--surface-muted: #2D2D2D
--surface-overlay: #3D3D3D
```

### Tipografía

- **Headlines**: Font-bold, 3xl-4xl
- **Body**: Font-normal, text-sm-base
- **Labels**: Font-semibold, text-xs uppercase tracking-wider

### Componentes

- **Buttons**: Gold primary, hover scale, disabled states
- **Inputs**: Border default → gold-dim on focus, dark overlay background
- **Tables**: Dark with hover highlight, skeleton loading, striped rows
- **Dropdowns**: Custom styling, loading spinner, smooth animations

---

## 🧪 Testing & QA

### Flujo Completo (Test Manual)

1. **Login**
   - Credenciales válidas → Redirige a /orders
   - Email inválido → Muestra error "Error al iniciar sesión"
   - Contraseña vacía → Error "Contraseña requerida" (hint)

2. **Crear Cliente**
   - Abre Sheet → Campos muestran "Requerido" (validateOnMount)
   - Completa name, email válido → Botón se habilita
   - Email inválido → Botón permanece deshabilitado
   - Submit exitoso → Toast success, tabla refrescada

3. **Crear Producto**
   - Validar unitPrice y stock como requeridos
   - Description es opcional
   - Skeleton loading mientras carga lista

4. **Crear Orden**
   - CustomerId dropdown carga clientes
   - Dropdown muestra "Cargando..." con spinner
   - OrderNumber no puede ser duplicate

5. **Eliminar Cualquier Elemento**
   - Click en icono trash
   - Confirmar en modal
   - Elemento desaparece con animación

6. **Paginación**
   - Navega entre páginas correctamente
   - Tabla muestra skeleton durante refetch
   - Datos se actualizan correctamente

---

## 📊 Estructura de Tipos

```typescript
// Entidades principales
interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

interface Customer {
  id: string;
  code: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  stock: number;
  createdAt: string;
}

// Request/Response
interface CreateOrderRequest {
  orderNumber: string;
  customerId: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|---|---|
| CORS error | Backend debe permitir `http://localhost:5173` |
| "Cannot GET /api/orders" | Backend no está corriendo en puerto 5001 |
| Login falla con 401 | Credenciales incorrectas o token expirado |
| Tabla no carga datos | Verificar Network tab, revisar JWT token |
| Validaciones no se disparan | Asegurar `validateOnMount: true` en hook |
| Skeleton loading infinito | Revisar logs de backend, `isLoading` está en true |

---

## 📚 Librerías Principales

| Librería | Uso |
|---|---|
| `vali-valid-react@1.0.2` | Validación de formularios con hook |
| `vali-valid@3.1.0` | Engine de validación subyacente |
| `@tanstack/react-query@5.x` | Server state, caching, fetching |
| `framer-motion@11.x` | Animaciones y transiciones |
| `react-router-dom@6.x` | Routing client-side |
| `tailwindcss@3.x` | Styling con clases utilitarias |

---

## 📖 Documentación

- 🎨 [Tailwind CSS](https://tailwindcss.com)
- ⚛️ [React 18](https://react.dev)
- 🔄 [React Query (TanStack Query)](https://tanstack.com/query/latest)
- ✅ [Vali-Valid Docs](https://vali-valid-docs.netlify.app)
- 🎬 [Framer Motion](https://www.framer.com/motion)

---

## 👤 Autor

**Felipe Rafael Montenegro Morriberon**

Créditos especiales por tecnologías custom:
- ⭐ **Vali-Valid** — Sistema de validación declarativo propio
- ⭐ **Vali-Valid-React** — Integración con React (hook useValiValid)

---

**Fecha:** Abril 2026  
**Versión:** 1.0.0
