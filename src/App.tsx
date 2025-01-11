// src/App.tsx
import React from 'react';
import ProductTable from './components/ProductTable';

const App: React.FC = () => {
  return (
    <div>
      <h1>Product List</h1>
      <ProductTable />
    </div>
  );
};

export default App;
