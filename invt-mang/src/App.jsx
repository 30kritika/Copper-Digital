import React, { createContext, useContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./App.css"; // Importing external CSS file

// Context to manage cart state globally
const CartContext = createContext();

const App = () => {
  return (
    <CartProvider>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="content-wrapper">
            <h1 className="title">Inventory Management</h1>
            <ProductList />
            <Cart />
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <ul className="sidebar-menu">
        <li className="active">Home</li>
        <li>Orders</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

const ProductList = () => {
  const products = [
    { id: 1, name: "Laptop", price: 70000, stock: 5 },
    { id: 2, name: "Smartphone", price: 30000, stock: 3 },
    { id: 3, name: "Headphones", price: 2000, stock: 0 },
  ];
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card">
      <h2 className="subtitle">Products</h2>
      {products.map((product) => (
        <div key={product.id} className={`product-item ${product.stock === 0 ? 'out-of-stock' : ''}` }>
          <span>
            {product.name} - ₹{product.price} {product.stock === 0 && "(Out of Stock)"}
          </span>
          <button
            className="btn btn-primary"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      ))}
    </div>
  );
};

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useContext(CartContext);

  return (
    <div className="card mt-4">
      <h2 className="subtitle">Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="product-item">
              <span>
                {item.name} - ₹{item.price} x {item.quantity}
              </span>
              <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <h3 className="total">Total: ₹{total}</h3>
          <button className="btn btn-warning" onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
