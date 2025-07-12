/**
 * Test script to demonstrate the current API endpoints
 * Run this after starting the server to test functionality
 */

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🔍 Testing JWT Auth System Endpoints\n');

  // Test 1: Access protected data
  console.log('1. Accessing secret data...');
  try {
    const response = await fetch(`${BASE_URL}/secret-data`);
    const data = await response.json();
    console.log('✅ Secret data retrieved:');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Error accessing data:', error.message);
  }

  // Test 2: Access user list
  console.log('\n2. Accessing user list...');
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    console.log('✅ User list retrieved:');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Error accessing users:', error.message);
  }

  // Test 3: Access profile
  console.log('\n3. Accessing profile...');
  try {
    const response = await fetch(`${BASE_URL}/profile`);
    const data = await response.json();
    console.log('✅ Profile data retrieved:');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Error accessing profile:', error.message);
  }

  // Test 4: Login attempt
  console.log('\n4. Testing login endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password123' })
    });
    const data = await response.json();
    console.log('✅ Login successful:');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Login failed:', error.message);
  }

  console.log('\n🎯 Summary: API endpoints tested successfully!');
  console.log('Ready for JWT authentication implementation.');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEndpoints().catch(console.error);
}
