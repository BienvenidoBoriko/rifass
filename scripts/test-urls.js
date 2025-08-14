const http = require('http');

const testUrls = [
  '/uploads/raffle-images/raffle-1755138864050-h5exb5yf1u.jpg',
  '/uploads/payment-proofs/payment-proof-1754673047046-4n2wmiypq9.jpg'
];

const host = 'localhost';
const port = 3001;

function testUrl(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'HEAD'
    };

    const req = http.request(options, (res) => {
      console.log(`✅ ${path} - Status: ${res.statusCode} - Content-Type: ${res.headers['content-type']}`);
      resolve(res.statusCode);
    });

    req.on('error', (err) => {
      console.log(`❌ ${path} - Error: ${err.message}`);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${path} - Timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Probando URLs de imágenes...\n');
  
  for (const url of testUrls) {
    try {
      await testUrl(url);
    } catch (error) {
      console.log(`❌ Error testing ${url}: ${error.message}`);
    }
  }
  
  console.log('\n📝 URLs completas para probar en el navegador:');
  testUrls.forEach(url => {
    console.log(`   http://localhost:3001${url}`);
  });
}

runTests();
