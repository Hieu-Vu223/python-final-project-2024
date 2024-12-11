from flask import Flask, request, jsonify, send_from_directory
from database import init_db, get_db
import os

app = Flask(
    __name__,
    static_folder='../frontend/dist',
    static_url_path=''
)

# Initialize database
init_db()

# Global in-memory cart
cart = []


# --- CART ENDPOINTS ---

@app.route('/api/cart', methods=['POST'])
def add_item_to_cart():
    """Add an item to the cart."""
    data = request.json
    existing_item = next((item for item in cart if item['id'] == data['id']), None)

    if existing_item:
        # Increment quantity if the item already exists
        existing_item['quantity'] += data.get('quantity', 1)
    else:
        # Add new item to the cart
        cart.append({
            'id': data['id'],
            'name': data['name'],
            'price': data['price'],
            'quantity': data.get('quantity', 1)  # Default to 1 if not provided
        })

    return jsonify({'message': 'Item added to cart', 'cart': cart}), 201


@app.route('/api/cart', methods=['GET'])
def get_cart_items():
    """Fetch all items in the cart."""
    return jsonify(cart), 200


@app.route('/api/cart/<int:item_id>', methods=['DELETE'])
def delete_item_from_cart(item_id):
    """Remove an item from the cart by ID."""
    global cart
    cart = [item for item in cart if item['id'] != item_id]
    return jsonify({'message': 'Item removed from cart', 'cart': cart}), 200


# --- OFFER ENDPOINTS ---

@app.route('/api/offers', methods=['POST'])
def create_offer():
    """API to create a new offer."""
    data = request.json
    # Breakpoint here
    print(f"Creating new offer with data: {data}")  # Debug: log the data received
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO offers (name, price, description) VALUES (?, ?, ?)',
        (data['name'], data['price'], data['description'])
    )
    db.commit()
    print(f"Offer created successfully with ID: {cursor.lastrowid}")  # Debug: log the created offer ID
    return jsonify({'id': cursor.lastrowid, 'message': 'Offer created successfully'}), 201

@app.route('/api/offers', methods=['GET'])
def get_offers():
    """API to fetch all offers."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM offers')
    offers = cursor.fetchall() # Inspect the fetched rows

    # Breakpoint here
    print(f"Fetched offers: {offers}")  # Debug: log the fetched offers

    return jsonify([
        {
            'id': o[0],
            'name': o[1],
            'price': o[2],
            'description': o[3]
        } for o in offers
    ])


@app.route('/api/offers/<int:offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    """Delete an offer by ID."""
    db = get_db()
    cursor = db.cursor()

    # Log the offer_id
    print(f"Attempting to delete offer with ID: {offer_id}")

    # Check if the offer exists
    cursor.execute('SELECT * FROM offers WHERE id = ?', (offer_id,))
    offer = cursor.fetchone()
    if not offer:
        print("Offer not found.")
        return jsonify({'message': 'Offer not found'}), 404

    # Delete the offer
    cursor.execute('DELETE FROM offers WHERE id = ?', (offer_id,))
    db.commit()
    print("Offer deleted successfully.")
    return jsonify({'message': 'Offer deleted successfully'}), 200


@app.route('/api/offers/<int:offer_id>', methods=['PUT'])
def update_offer(offer_id):
    """Update an offer by ID."""
    data = request.json
    if not data or 'name' not in data or 'price' not in data or 'description' not in data:
        return jsonify({'message': 'Invalid data'}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the offer exists
    cursor.execute('SELECT * FROM offers WHERE id = ?', (offer_id,))
    offer = cursor.fetchone()
    if not offer:
        return jsonify({'message': 'Offer not found'}), 404

    # Update the offer
    cursor.execute(
        'UPDATE offers SET name = ?, price = ?, description = ? WHERE id = ?',
        (data['name'], data['price'], data['description'], offer_id)
    )
    db.commit()
    return jsonify({'message': 'Offer updated successfully'}), 200


# --- ORDER ENDPOINTS ---

@app.route('/api/orders', methods=['POST'])
def create_order():
    """API to create a new order."""
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO orders (customer_name, offer_id, status) VALUES (?, ?, ?)',
        (data['customer_name'], data['offer_id'], 'pending')
    )
    db.commit()
    return jsonify({'id': cursor.lastrowid}), 201


@app.route('/api/orders', methods=['GET'])
def get_orders():
    """API to fetch all orders with offer details."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT orders.id, orders.customer_name, orders.status, offers.name AS offer_name, offers.price 
        FROM orders
        JOIN offers ON orders.offer_id = offers.id
    ''')
    orders = cursor.fetchall()
    return jsonify([
        {
            'id': o[0],
            'customer_name': o[1],
            'status': o[2],
            'offer_name': o[3],
            'price': o[4]
        } for o in orders
    ])


# --- REACT APP SERVING ---

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve the React app."""
    if path != "" and os.path.exists(f"{app.static_folder}/{path}"):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5555)
