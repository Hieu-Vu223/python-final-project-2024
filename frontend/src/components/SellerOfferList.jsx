import { useState, useEffect } from 'react';

function SellerOfferList({ refreshTrigger }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch offers from the backend
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
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const response = await fetch(`/api/offers/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Offer deleted successfully!');
          setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete offer.');
        }
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('An error occurred while deleting the offer.');
      }
    }
  };

// Handle editing an offer (New addition for PUT endpoint)
  const handleEdit = (id, updatedOffer) => {
    fetch(`/api/offers/${id}`, {
      method: 'PUT', // PUT method for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOffer),
    })
      .then((res) => {
        if (res.ok) {
          alert('Offer updated successfully!');
          // Refresh offers after update
          setOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.id === id ? { ...offer, ...updatedOffer } : offer
            )
          );
        } else {
          alert('Failed to update offer.');
        }
      })
      .catch((error) => {
        console.error('Error updating offer:', error);
        alert('An error occurred while updating the offer.');
      });
  };

  if (loading) {
    return <div>Loading offers...</div>;
  }

  return (
    <div className="seller-offer-list">
      {offers.map((offer) => (
        <div key={offer.id} className="offer-card">
          <h3>{offer.name}</h3>
          <p className="price">${offer.price.toFixed(2)}</p>
          <p className="description">{offer.description}</p>
          <button className="delete-button" onClick={() => handleDelete(offer.id)}>
            Delete Offer
          </button>
          <button
            className="edit-button" // New button for editing
            onClick={() => {
              const updatedOffer = {
                name: prompt('Enter new name:', offer.name),
                price: parseFloat(prompt('Enter new price:', offer.price)),
                description: prompt('Enter new description:', offer.description),
              };
              if (updatedOffer.name && updatedOffer.price && updatedOffer.description) {
                handleEdit(offer.id, updatedOffer);
              }
            }}
          >
            Edit Offer
          </button>
        </div>
      ))}
    </div>
  );
}

export default SellerOfferList;
