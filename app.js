const fs = require('fs');
// Dynamically import node-fetch, as it's now an ES Module
// We'll assign the default export to a variable named 'fetch'
let nodeFetch;

// Asynchronous IIFE (Immediately Invoked Function Expression) to handle the dynamic import
// This ensures nodeFetch is available before any functions that use it are called.
(async () => {
  try {
    const fetchModule = await import('node-fetch');
    nodeFetch = fetchModule.default; // node-fetch exports its main function as 'default'
    startPinging(); // Start the application after node-fetch is loaded
  } catch (error) {
    console.error('Failed to load node-fetch:', error.message);
    process.exit(1); // Exit if critical module can't be loaded
  }
})();

const endpointsFile = './endpoint.json';
const pingIntervalMs = 5 * 1000; // Ping every 5 seconds (adjust as needed)

/**
 * Pings a given URL and logs the result.
 * @param {string} url - The URL to ping.
 */
async function pingEndpoint(url) {
  // Ensure nodeFetch is available before attempting to use it
  if (!nodeFetch) {
    console.error(`[${new Date().toISOString()}] Error: nodeFetch is not initialized yet. Skipping ping for ${url}.`);
    return;
  }
  try {
    const response = await nodeFetch(url, { method: 'HEAD', timeout: 5000 }); // Use HEAD request for efficiency
    if (response.ok) {
      console.log(`[${new Date().toISOString()}] Successfully pinged: ${url} (Status: ${response.status})`);
    } else {
      console.warn(`[${new Date().toISOString()}] Failed to ping: ${url} (Status: ${response.status})`);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error pinging ${url}: ${error.message}`);
  }
}

/**
 * Loads endpoints from the endpoint.json file.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of endpoint URLs.
 */
async function loadEndpoints() {
  try {
    const data = await fs.promises.readFile(endpointsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading endpoints from ${endpointsFile}:`, error.message);
    return [];
  }
}

/**
 * Starts the continuous pinging of loaded endpoints.
 */
async function startPinging() {
  const endpoints = await loadEndpoints();
  if (endpoints.length === 0) {
    console.warn('No endpoints found to ping. Please check your endpoints.json file.');
    return;
  }

  console.log(`Starting to ping ${endpoints.length} endpoints every ${pingIntervalMs / 1000} seconds.`);

  setInterval(() => {
    endpoints.forEach(endpoint => {
      pingEndpoint(endpoint);
    });
  }, pingIntervalMs);
}

// The startPinging() call is now moved inside the IIFE after node-fetch is loaded.
// So, we remove the standalone call here.
// startPinging();
