'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (testName, status, details) => {
    setTestResults(prev => [
      ...prev, 
      { testName, status, details, timestamp: new Date().toISOString() }
    ]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Check if API is reachable
      try {
        const response = await axios.get('/api/test');
        addResult('API Test', 'success', response.data);
      } catch (error) {
        addResult('API Test', 'error', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }

      // Test 2: Try to login with test credentials
      try {
        const response = await axios.post('/api/auth/login', {
          email: 'test@example.com',
          password: 'test123',
          role: 'patient'
        });
        addResult('Login Test', 'success', response.data);
      } catch (error) {
        addResult('Login Test', 'error', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }

      // Test 3: Check authentication status
      try {
        const response = await axios.get('/api/auth/check');
        addResult('Auth Check', 'success', response.data);
      } catch (error) {
        addResult('Auth Check', 'error', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
      
    } catch (error) {
      addResult('Test Suite', 'error', {
        message: 'Test suite failed to run',
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>
      
      <button
        onClick={runTests}
        disabled={isLoading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Running Tests...' : 'Run Tests'}
      </button>

      <div className="space-y-4">
        {testResults.map((test, index) => (
          <div 
            key={index} 
            className={`p-4 border rounded ${
              test.status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{test.testName}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                test.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {test.status.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(test.details, null, 2)}
              </pre>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {new Date(test.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
