import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useProducts } from '../hooks/useProducts';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}

const ProductTable: React.FC = () => {
  const { data: products, isLoading, isError, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return products;
    return products?.filter((product) =>
      Object.values(product).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, products]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Product Name',
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: (info: any) => `$${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info: any) => info.getValue(),
      },
    ],
    []
  );

  const table = useReactTable<Product>({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <p>Error fetching products:</p>
        <p className="error-message">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="product-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="table-header">
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="table-row">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="table-cell">
                  {String(cell.getValue())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'} Previous
        </button>
        <button
          className="pagination-button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next {'>'}
        </button>
        <span className="pagination-info">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="pagination-select"
        >
          {[5, 10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductTable;
