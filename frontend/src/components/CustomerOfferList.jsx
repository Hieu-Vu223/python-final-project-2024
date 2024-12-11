import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerOfferList({ refreshTrigger, onAddToCart }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); // Show loading state
    fetch('/api/offers')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setOffers(data); // Update offers
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching offers:', error);
        setLoading(false);
      });
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (loading) {
    return <div>Loading offers...</div>;
  }

  if (!offers.length) {
    return <div>No offers available at the moment. Please check back later!</div>;
  }

  return (
    <div className="customer-offer-list">
      {offers.map((offer) => (
        <div key={offer.id} className="offer-card">
          <h3>{offer.name}</h3>
          <p className="price">${offer.price.toFixed(2)}</p>
          <p className="description">{offer.description}</p>
          <button
            className="order-button"
            onClick={() => navigate('/place-order')}
          >
            Order Now
          </button>
          <button onClick={() => onAddToCart({ ...offer, quantity: 1 })}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default CustomerOfferList;
