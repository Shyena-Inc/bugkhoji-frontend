#!/usr/bin/env node

// Simple script to test your deployed backend
import https from 'https';

const testEndpoint = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.bugkhoji.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DebugScript/1.0'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
};

async function debugBackend() {
  console.log('🔍 Testing deployed backend at https://api.bugkhoji.com\n');

  // Test 1: Root endpoint
  console.log('1️⃣ Testing root endpoint (/)...');
  try {
    const result = await testEndpoint('/');
    console.log(`   Status: ${result.statusCode}`);
    console.log(`   Response: ${result.data.slice(0, 100)}...`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 2: Registration endpoint
  console.log('\n2️⃣ Testing researcher registration...');
  const testUser = {
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    password: 'TestPassword123!',
    role: 'RESEARCHER',
    termsAccepted: true
  };

  try {
    const result = await testEndpoint('/v1/register/researcher', 'POST', testUser);
    console.log(`   Status: ${result.statusCode}`);
    console.log(`   Response: ${result.data}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Login endpoint
  console.log('\n3️⃣ Testing researcher login...');
  const loginData = {
    email: 'test@example.com',
    password: 'TestPassword123!'
  };

  try {
    const result = await testEndpoint('/v1/login/researcher', 'POST', loginData);
    console.log(`   Status: ${result.statusCode}`);
    console.log(`   Response: ${result.data}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n✅ Backend testing complete!');
  console.log('\n📝 Key things to check in your deployed backend:');
  console.log('   - Database connection string');
  console.log('   - Environment variables (JWT_SECRET, etc.)');
  console.log('   - CORS configuration');
  console.log('   - Build/deployment process');
  console.log('   - Server logs on your deployment platform');
}

debugBackend().catch(console.error);
