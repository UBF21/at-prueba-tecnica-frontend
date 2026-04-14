# DataTable Component

Generic, reusable data table component powered by **TanStack Table** (formerly React Table).

## Features

- ✅ **Dynamic Columns**: Define columns declaratively with custom rendering
- ✅ **Sorting**: Click column headers to sort (↑ ↓ ↕)
- ✅ **Pagination**: Built-in client-side pagination with controls
- ✅ **Custom Cell Rendering**: Render anything in cells (badges, buttons, formatted values)
- ✅ **Row Click Handler**: Optional callback when clicking rows
- ✅ **Responsive**: Uses Tailwind CSS for mobile-friendly layout
- ✅ **TypeScript**: Fully typed with generics

## Usage

### 1. Define Columns

Create a hook that returns `ColumnDef<T>[]`:

```typescript
// hooks/useMyDataColumns.tsx
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { MyData } from '../types';

export function useMyDataColumns() {
  const columns: ColumnDef<MyData>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => (
          <span className="font-medium">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => (
          <a href={`mailto:${info.getValue()}`} className="text-blue-500">
            {info.getValue()}
          </a>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const item = info.row.original;
          return (
            <button onClick={() => console.log(item.id)}>
              Edit
            </button>
          );
        },
      },
    ],
    []
  );

  return columns;
}
```

### 2. Use in Component

```typescript
import { DataTable } from '../components/DataTable';
import { useMyDataColumns } from '../hooks/useMyDataColumns';
import { useMyData } from '../hooks/useMyData';

function MyPage() {
  const { data } = useMyData();
  const columns = useMyDataColumns();

  return (
    <DataTable
      columns={columns}
      data={data || []}
      pageSize={10}
      onRowClick={(row) => console.log(row)}
    />
  );
}
```

## Column Definition

### Accessor Column (Simple)

```typescript
{
  accessorKey: 'fieldName',
  header: 'Column Title',
}
```

### Accessor Column (Custom Render)

```typescript
{
  accessorKey: 'price',
  header: 'Price',
  cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
}
```

### ID Column (Complex)

```typescript
{
  id: 'actions',
  header: 'Actions',
  cell: (info) => {
    const item = info.row.original; // Full row data
    return (
      <div>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    );
  },
}
```

## Props

```typescript
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]; // Column definitions
  data: TData[];               // Table data
  pageSize?: number;           // Items per page (default: 10)
  onRowClick?: (row: TData) => void; // Row click callback
}
```

## Examples

### Status Badge Column

```typescript
{
  accessorKey: 'status',
  header: 'Status',
  cell: (info) => {
    const status = info.getValue() as 'active' | 'inactive';
    return (
      <span className={`px-2 py-1 rounded ${
        status === 'active' ? 'bg-green-600' : 'bg-red-600'
      }`}>
        {status}
      </span>
    );
  },
}
```

### Date Formatting Column

```typescript
{
  accessorKey: 'createdAt',
  header: 'Created',
  cell: (info) => 
    new Date(info.getValue() as string).toLocaleDateString(),
}
```

### Action Buttons Column

```typescript
{
  id: 'actions',
  header: 'Actions',
  cell: (info) => {
    const item = info.row.original;
    return (
      <div className="flex gap-2">
        <button onClick={() => edit(item.id)}>Edit</button>
        <button onClick={() => delete(item.id)}>Delete</button>
      </div>
    );
  },
}
```

### With Sorting Enabled

All columns are sortable by default. Click header to sort.

### With Pagination

Automatically handled. Use `pageSize` prop to control items per page.

## Styling

Uses Tailwind CSS classes. Customize by modifying:

- `DataTable.tsx` for global table styles
- Column `cell` and `header` functions for per-column styling

## Data Requirements

- Data must have an `id` field (number)
- Types: `TData extends { id: number }`

## Current Implementations

- **OrderColumns** (`useOrderColumns`): Orders with status badges
- **ProductColumns** (`useProductColumns`): Products with stock indicators

Use these as reference for creating new column hooks.
