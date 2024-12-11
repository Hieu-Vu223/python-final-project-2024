import React from 'react';

function CartList({ cart, onRemoveFromCart }) {
  return (
    <ul>
      {cart.map((item) => (
        <li key={item.id}>
          <div>
            <h3>{item.name}</h3>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CartList;
