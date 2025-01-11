import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get('https://dummyjson.com/products');
  return response.data.products;
};

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};
