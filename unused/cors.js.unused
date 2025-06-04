// Define CORS headers for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// Helper function to add CORS headers to a response
export function addCorsHeaders(response) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Helper function to handle OPTIONS preflight requests
export function handleCorsOptions() {
  const response = new Response(null, { status: 204 });
  return addCorsHeaders(response);
} 