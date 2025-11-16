import { ArrowLeft } from 'lucide-react';

interface AdminProfilePageProps {
  onNavigateBack: () => void;
  currentUser: any;
}

export function AdminProfilePage({ 
  onNavigateBack,
  currentUser
}: AdminProfilePageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light-gray)', padding: '2rem' }}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 mb-6"
          style={{ 
            color: 'var(--primary-blue)',
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div 
          className="p-8"
          style={{ 
            backgroundColor: 'var(--pure-white)',
            borderRadius: '3px',
            boxShadow: 'var(--shadow-standard-desktop)'
          }}
        >
          <h1 style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-blue)',
            marginBottom: '1rem'
          }}>
            Admin Profile
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--medium-gray)'
          }}>
            Admin profile page is under construction.
          </p>
        </div>
      </div>
    </div>
  );
}
