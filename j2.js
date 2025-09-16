// Using built-in https module (works in all Node.js versions)
const https = require('https');
const { URL } = require('url');

// Configuration
const API_URL = "https://api.ljmash.xyz/api/match"; // Fixed URL (removed double slash)
const INTERVAL_MS = 1; // 1 millisecond

// Counter for requests
let requestCount = 0;
let successCount = 0;
let errorCount = 0;

// Function to fetch the API using https module
async function fetchAPI() {
  const timestamp = new Date().toISOString();
  requestCount++;
  
  return new Promise((resolve, reject) => {
    console.log(`[${timestamp}] Request #${requestCount}: Fetching API...`);
    
    const url = new URL(API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-US;q=0.9,en-GB;q=0.8,en;q=0.7,gu;q=0.6',
        'origin': 'https://ljmash.xyz',
        'referer': 'https://ljmash.xyz/',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          successCount++;
          console.log(`[${timestamp}] ✅ Success #${successCount}: Status ${res.statusCode}`);
          console.log(`Response: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
        } else {
          errorCount++;
          console.log(`[${timestamp}] ❌ HTTP Error #${errorCount}: ${res.statusCode} ${res.statusMessage}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      errorCount++;
      console.error(`[${timestamp}] ❌ Network Error #${errorCount}:`, error.message);
      resolve();
    });

    req.on('timeout', () => {
      errorCount++;
      console.error(`[${timestamp}] ❌ Timeout Error #${errorCount}: Request timed out`);
      req.destroy();
      resolve();
    });

    // Set timeout to 5 seconds
    req.setTimeout(5000);
    req.end();
  });
}

// Function to start the periodic API calls
function startPeriodicFetch() {
  console.log('🚀 Starting API fetch every 1 millisecond...');
  console.log('⚠️  WARNING: This will make 1000 requests per second!');
  console.log('Press Ctrl+C to stop\n');
  
  // Start fetching immediately
  fetchAPI();
  
  // Set interval for every 1 millisecond
  const interval = setInterval(() => {
    fetchAPI();
  }, INTERVAL_MS);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping API requests...');
    console.log(`📊 Final Stats:`);
    console.log(`   Total Requests: ${requestCount}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Success Rate: ${((successCount / requestCount) * 100).toFixed(2)}%`);
    
    clearInterval(interval);
    clearInterval(statsInterval);
    process.exit(0);
  });
  
  // Log stats every 5 seconds
  const statsInterval = setInterval(() => {
    console.log(`\n📈 Stats Update:`);
    console.log(`   Requests: ${requestCount} | Success: ${successCount} | Errors: ${errorCount}`);
    console.log(`   Rate: ${(requestCount / ((Date.now() - startTime) / 1000)).toFixed(1)} req/sec\n`);
  }, 5000);
  
  return interval;
}

// Record start time for rate calculation
const startTime = Date.now();

// Start the periodic execution
startPeriodicFetch();
