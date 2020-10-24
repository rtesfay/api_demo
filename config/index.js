require('dotenv').config();

let configurations = {
  'jwtPrivateKey': process.env.jwtPrivateKey,
  'db': process.env.DB_URL,
  'port': process.env.PORT,
}

for (let key in configurations) {
  if (!configurations[key]) {
    console.log('FATAL ERROR: Incomplete configuration.');
    process.exit(1);
  }
}

module.exports = configurations;