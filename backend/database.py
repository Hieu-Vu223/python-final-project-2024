import sqlite3
import os
from flask import g

DATABASE = 'fresh4less.db'


def init_db():
    """Initialize the database with tables"""
    if os.path.exists(DATABASE):
        return

    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()

    # Create tables
    cursor.executescript('''
        CREATE TABLE offers (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT
        );

        CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            customer_name TEXT NOT NULL,
            offer_id INTEGER,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (offer_id) REFERENCES offers (id)
        );

        CREATE TABLE cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            offer_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (offer_id) REFERENCES offers (id)
        );
    ''')

    # Add some sample data
    cursor.executescript('''
        INSERT INTO offers (name, price, description)
        VALUES 
            ('Pizza Bundle', 15.99, 'Two large pizzas from closing time'),
            ('Bakery Box', 9.99, 'Assorted pastries and bread');
    ''')

    db.commit()
    db.close()


def get_db():
    """Get a database connection, reuse it if it already exists"""
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row  # Enable column access by name
    return g.db


def close_db(e=None):
    """Close the database connection"""
    db = g.pop('db', None)
    if db is not None:
        db.close()
