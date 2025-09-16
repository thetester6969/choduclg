const { exec, execSync } = require('child_process');

// Asynchronous version with callback
function runCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      if (callback) callback(error, null, stderr);
      return;
    }
    if (stderr) {
      console.warn(`Warning: ${stderr}`);
    }
    console.log(`Output: ${stdout}`);
    if (callback) callback(null, stdout, stderr);
  });
}

// Synchronous version
function runCommandSync(command) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(`Output: ${output}`);
    return output;
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    throw error;
  }
}

// Promise-based version
function runCommandPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// Example usage:
// runCommand('dir', (error, output, stderr) => {
//   if (!error) {
//     console.log('Command completed successfully');
//   }
// });

// runCommandSync('echo Hello World');

// Your curl command
const curlCommand = `curl -X POST "https://api.ljmash.xyz/api/match/update"
-H "accept: */*"
-H "accept-language: en-IN,en-US;q=0.9,en-GB;q=0.8,en;q=0.7,gu;q=0.6" 
-H "content-type: application/json"
-H "origin: https://ljmash.xyz" 
-H "priority: u=1, i" 
-H "referer: https://ljmash.xyz/" 
-H "sec-ch-ua: \\"Not;A=Brand\\";v=\\"99\\", \\"Google Chrome\\";v=\\"139\\", \\"Chromium\\";v=\\"139\\"" 
-H "sec-ch-ua-mobile: ?0" 
-H "sec-ch-ua-platform: \\"Windows\\"" 
-H "sec-fetch-dest: empty" 
-H "sec-fetch-mode: cors" 
-H "sec-fetch-site: same-site" 
-H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" --data-raw "{\\"id1\\":\\"10000\\",\\"id2\\":\\"415\\"}"`;

// Alternative endpoints to try if the main one doesn't work
const alternativeEndpoints = [
  "https://api.ljmash.xyz/api/match/update",
  "https://api.ljmash.xyz/api/matches/update", 
  "https://api.ljmash.xyz/match/update",
  "https://ljmash.xyz/api/match/update"
];

let currentEndpointIndex = 0;

// Function to run the curl command every second
function startPeriodicCurl() {
  console.log('Starting periodic curl requests...');
  console.log('Press Ctrl+C to stop');
  
  // Run immediately first
  runCurlCommand();
  
  // Then run every second (1000ms)
  const interval = setInterval(() => {
    runCurlCommand();
  }, 1000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nStopping periodic curl requests...');
    clearInterval(interval);
    process.exit(0);
  });
  
  return interval;
}

// Function to run a single curl request
function runCurlCommand() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] Executing curl request...`);
  
  const currentEndpoint = alternativeEndpoints[currentEndpointIndex];
  const currentCommand = curlCommand.replace("https://api.ljmash.xyz/api/match/update", currentEndpoint);
  
  runCommandPromise(currentCommand)
    .then(result => {
      if (result.stdout.includes("404") || result.stdout.includes("Not Found")) {
        console.log(`[${timestamp}] 404 Error with endpoint: ${currentEndpoint}`);
        
        // Try next endpoint
        currentEndpointIndex = (currentEndpointIndex + 1) % alternativeEndpoints.length;
        if (currentEndpointIndex === 0) {
          console.log(`[${timestamp}] Tried all endpoints, cycling back to first one`);
        } else {
          console.log(`[${timestamp}] Trying next endpoint: ${alternativeEndpoints[currentEndpointIndex]}`);
        }
      } else {
        console.log(`[${timestamp}] Success with ${currentEndpoint}:`, result.stdout.trim());
      }
    })
    .catch(err => {
      console.error(`[${timestamp}] Error with ${currentEndpoint}:`, err.error.message);
    });
}

// Start the periodic execution
startPeriodicCurl();