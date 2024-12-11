import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerOfferList from './components/CustomerOfferList';
import SellerOfferList from './components/SellerOfferList';
import CreateOffer from './components/CreateOffer';
import PlaceOrder from './components/PlaceOrder';
import PlaceOrderWithOffer from './components/PlaceOrderWithOffer';
import OrderList from './components/OrderList';
import Cart from './components/Cart';
import './App.css';

function App() {
  const [userType, setUserType] = useState('customer'); // "customer" or "seller"
  const [refreshOffers, setRefreshOffers] = useState(0);
  const [refreshOrders, setRefreshOrders] = useState(0);
  const [cart, setCart] = useState([]);

  const handleOfferCreated = () => {
    setRefreshOffers((prev) => prev + 1);
  };

  const handleOrderPlaced = () => {
    setRefreshOrders((prev) => prev + 1);
  };

  const handleAddToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    }
    console.log('Updated cart:', cart); // Debugging: Check cart state after update
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== id));
  };

  return (
    <Router>
      <header>
        <h1>Fresh4Less</h1>
        <p>Reduce food waste, save money!</p>
        <nav>
          <Link to="/">Offers</Link> |{' '}
          {userType === 'seller' && <Link to="/create-offer">Create Offer</Link>} |{' '}
          {userType === 'customer' && <Link to="/cart">Shopping Cart</Link>} |{' '}
          {userType === 'customer' && <Link to="/place-order">Place Order</Link>} |{' '}
          <Link to="/order-list">Order List</Link>
        </nav>
        <div>
          <button onClick={() => setUserType('customer')}>Switch to Customer</button>
          <button onClick={() => setUserType('seller')}>Switch to Seller</button>
        </div>
      </header>

      <main>
        <Routes>
          {userType === 'customer' && (
            <Route
              path="/"
              element={
                <CustomerOfferList
                  refreshTrigger={refreshOffers}
                  onAddToCart={handleAddToCart}
                />
              }
            />
          )}
          {userType === 'seller' && (
            <Route
              path="/"
              element={<SellerOfferList refreshTrigger={refreshOffers} />}
            />
          )}
          {userType === 'seller' && (
            <Route
              path="/create-offer"
              element={<CreateOffer onOfferCreated={handleOfferCreated} />}
            />
          )}
          {userType === 'customer' && (
            <Route
              path="/cart"
              element={
                <Cart cart={cart} onRemoveFromCart={handleRemoveFromCart} />
              }
            />
          )}
          {userType === 'customer' && (
            <Route
              path="/place-order"
              element={<PlaceOrder onOrderPlaced={handleOrderPlaced} />}
            />
          )}
          {userType === 'customer' && (
            <Route
              path="/place-order/:offerId"
              element={<PlaceOrderWithOffer onOrderPlaced={handleOrderPlaced} />}
            />
          )}
          <Route
            path="/order-list"
            element={<OrderList refreshTrigger={refreshOrders} />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
