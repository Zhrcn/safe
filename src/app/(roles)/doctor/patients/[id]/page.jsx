import PatientPageClient from './PatientPageClient';

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  // Return an empty array since we don't know the IDs at build time
  // The page will be generated dynamically at runtime
  return [];
}

export default function PatientPage({ params }) {
  return <PatientPageClient id={params.id} />;
} 