const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const menuItems = [
  // Pizzas
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with San Marzano tomato sauce, fresh mozzarella, basil leaves, and extra-virgin olive oil on a thin, crispy crust.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    name: 'Pepperoni Supreme',
    description: 'Loaded with double pepperoni, melted mozzarella, and our signature spicy tomato sauce. A crowd favorite!',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ sauce base topped with grilled chicken, red onions, cilantro, and a blend of gouda and mozzarella cheeses.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop',
    category: 'Pizza',
    isAvailable: true,
  },
  // Burgers
  {
    name: 'Classic Smash Burger',
    description: 'Double smashed beef patties with American cheese, pickles, onions, ketchup, and mustard on a toasted brioche bun.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
    category: 'Burger',
    isAvailable: true,
  },
  {
    name: 'Truffle Mushroom Burger',
    description: 'Angus beef patty topped with sautéed wild mushrooms, truffle aioli, Swiss cheese, and arugula on a pretzel bun.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=400&fit=crop',
    category: 'Burger',
    isAvailable: true,
  },
  {
    name: 'Spicy Jalapeño Burger',
    description: 'Seasoned beef patty with pepper jack cheese, crispy jalapeños, chipotle mayo, lettuce, and tomato.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=400&fit=crop',
    category: 'Burger',
    isAvailable: true,
  },
  // Drinks
  {
    name: 'Mango Smoothie',
    description: 'Refreshing blend of ripe mangoes, yogurt, honey, and a splash of orange juice. Served ice-cold.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&h=400&fit=crop',
    category: 'Drink',
    isAvailable: true,
  },
  {
    name: 'Iced Caramel Latte',
    description: 'Premium espresso with velvety milk, rich caramel syrup, and a drizzle of caramel on top. Served over ice.',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop',
    category: 'Drink',
    isAvailable: true,
  },
  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm, rich chocolate cake with a molten center, served with vanilla bean ice cream and fresh berries.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&h=400&fit=crop',
    category: 'Dessert',
    isAvailable: true,
  },
  {
    name: 'New York Cheesecake',
    description: 'Creamy, dense cheesecake on a buttery graham cracker crust, topped with a fresh strawberry compote.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=500&h=400&fit=crop',
    category: 'Dessert',
    isAvailable: true,
  },
  // Sides
  {
    name: 'Truffle Parmesan Fries',
    description: 'Crispy golden fries tossed with truffle oil, grated Parmesan cheese, fresh parsley, and garlic.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop',
    category: 'Side',
    isAvailable: true,
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, house-made Caesar dressing, shaved Parmesan, and garlic croutons.',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop',
    category: 'Side',
    isAvailable: true,
  },
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/order-management';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert seed data
    const insertedItems = await MenuItem.insertMany(menuItems);
    console.log(`🌱 Seeded ${insertedItems.length} menu items successfully`);

    // Log summary
    const categories = [...new Set(menuItems.map((item) => item.category))];
    for (const cat of categories) {
      const count = menuItems.filter((item) => item.category === cat).length;
      console.log(`   📁 ${cat}: ${count} items`);
    }

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { menuItems, seedDatabase };
