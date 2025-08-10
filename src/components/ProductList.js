import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api/productAPI";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts({
          page: 1,
          limit: 10,
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
          {product.images?.[0] && (
            <img
              src={`http://localhost:5000/${product.images[0].path}`}
              alt={product.name}
              width="200"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
