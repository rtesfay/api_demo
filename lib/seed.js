// seed
const config = require('../config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Product } = require('../models');
const { Cart } = require('../models');

// one user
async function seedUsers() {
  const user = new User({
    name: 'Yohannes',
    username: 'testuser',
    password: bcrypt.hashSync('test1234', 10)
  });

  await user.save();
  return user;
}

// 5 products
async function seedProducts(user) {
  const products = [];
  for (let i=0; i<5; i++) {
    products.push(
      new Product({
        name: `Product ${i + 1}`,
        description: 'description',
        price: (i+1) * 50.0,
        vendor: user._id
     })
    );
  }

  await Product.create(products);
  return products;
}

// 2 products in cart
async function seedCart(user, products) {
  await Cart.create({
    user: user._id,
    cartItems: [
      {
        product: products[0],
        quantity: 3
      },
      {
        product: products[1],
        quantity: 4
      }
    ]
  });
}

async function seed() {
  const user = await seedUsers();
  const products = await seedProducts(user);
  await seedCart(user, products);
  
  console.log('Seed Successful');
  console.log('********* Credentials: UserName - testuser, Password - test1234 **********');
  process.exit(0);
}

process.on('uncaughtException', err => { 
  console.log(err); process.exit(1); 
});
process.on('unhandledRejection', err => { 
  console.log(err); process.exit(1); 
});

// prepare and start seed
(async function () {
  await mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  await mongoose.connection.db.dropDatabase();
  await seed();
})();
