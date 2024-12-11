import { useState } from 'react';

function CreateOffer({ onOfferCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      if (response.ok) {
        alert('Offer created successfully!'); // Same success message format as PlaceOrder
        setFormData({ name: '', price: '', description: '' }); // Reset the form
        onOfferCreated(); // Notify parent to refresh the offer list
      } else {
        alert('Failed to create the offer.'); // Error message format for consistency
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('An error occurred while creating the offer.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="create-offer-form">
      <div className="form-group">
        <label htmlFor="name">Offer Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Create Offer</button>
    </form>
  );
}

export default CreateOffer;
