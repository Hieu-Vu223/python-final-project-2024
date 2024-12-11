import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PlaceOrderWithOffer({ onOrderPlaced }) {
  const { offerId } = useParams(); // Use offerId from the URL
  const [offer, setOffer] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/offers/${offerId}`) // Fetch the specific offer details
      .then((res) => res.json())
      .then((data) => {
        setOffer(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching offer details:', error);
        setLoading(false);
      });
  }, [offerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName,
          offer_id: offer.id,
        }),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        onOrderPlaced(); // Notify parent
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (loading) {
    return <div>Loading offer details...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="place-order-form">
      <div className="offer-details">
        <h3>{offer.name}</h3>
        <p>Price: ${offer.price.toFixed(2)}</p>
        <p>{offer.description}</p>
      </div>
      <div className="form-group">
        <label htmlFor="customer_name">Your Name:</label>
        <input
          type="text"
          id="customer_name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Confirm Order</button>
    </form>
  );
}

export default PlaceOrderWithOffer;
