/**
 * Test script to demonstrate security vulnerabilities
 * Run this after starting the server to see the issues
 */

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🔍 Testing JWT Auth System Security Issues\n');

  // Test 1: Access protected data without authentication
  console.log('1. Accessing secret data without authentication...');
  try {
    const response = await fetch(`${BASE_URL}/secret-data`);
    const data = await response.json();
    console.log('❌ SECURITY ISSUE: Secret data exposed!');
    console.log('Response:', data);
  } catch (error) {
    console.log('✅ Protected (as expected)');
  }

  // Test 2: Access user list without admin privileges
  console.log('\n2. Accessing user list without admin privileges...');
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    console.log('❌ SECURITY ISSUE: User list exposed!');
    console.log('Response:', data);
  } catch (error) {
    console.log('✅ Protected (as expected)');
  }

  // Test 3: Access profile without authentication
  console.log('\n3. Accessing profile without authentication...');
  try {
    const response = await fetch(`${BASE_URL}/profile`);
    const data = await response.json();
    console.log('❌ SECURITY ISSUE: Profile data exposed!');
    console.log('Response:', data);
  } catch (error) {
    console.log('✅ Protected (as expected)');
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
    console.log('❌ SECURITY ISSUE: Login works but no JWT token generated!');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Login failed:', error.message);
  }

  console.log('\n🎯 Summary: This application needs proper JWT authentication!');
  console.log('Use Cursor to help implement secure authentication.');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEndpoints().catch(console.error);
}
