import { useState, useEffect } from 'react';

function PlaceOrder({ onOrderPlaced }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    offer_id: '',
  });
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all available offers
  useEffect(() => {
    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching offers:', error);
        setLoading(false);
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setFormData({ customer_name: '', offer_id: '' }); // Reset form
        onOrderPlaced(); // Notify parent to refresh the order list
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return <div>Loading available offers...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="place-order-form">
      <div className="form-group">
        <label htmlFor="customer_name">Customer Name:</label>
        <input
          type="text"
          id="customer_name"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="offer_id">Select Offer:</label>
        <select
          id="offer_id"
          name="offer_id"
          value={formData.offer_id}
          onChange={handleChange}
          required
        >
          <option value="">--Select an Offer--</option>
          {offers.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.name} - ${offer.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Place Order</button>
    </form>
  );
}

export default PlaceOrder;
