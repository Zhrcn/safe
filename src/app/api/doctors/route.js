// Mock data for doctors
const doctors = [
  { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Johnson', specialty: 'Neurology' },
];

export async function GET() {
  return new Response(JSON.stringify(doctors), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
