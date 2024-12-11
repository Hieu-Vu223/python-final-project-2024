import { useState, useEffect } from 'react';

function OrderList({ refreshTrigger }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="orders-grid">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Order ID: {order.id}</h3>
          <p><strong>Customer Name:</strong> {order.customer_name}</p>
          <p><strong>Offer:</strong> {order.offer_name} - ${order.price.toFixed(2)}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
