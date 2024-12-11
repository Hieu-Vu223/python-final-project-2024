import React from 'react';
import CartList from './CartList'; // Import the CartList component

function Cart({ cart, onRemoveFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      {cart.length > 0 ? (
        <>
          <CartList cart={cart} onRemoveFromCart={onRemoveFromCart} />
          <h3>Total: ${total.toFixed(2)}</h3>
        </>
      ) : (
        <p>The cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
