import { ArrowLeft } from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateBack: () => void;
  currentAdminView: string;
  onAdminNavigate: (view: string) => void;
  currentUser: any;
  onNavigateToPage: (page: string) => void;
}

export function AdminDashboardPage({ 
  onNavigateBack,
  currentAdminView,
  onAdminNavigate,
  currentUser,
  onNavigateToPage
}: AdminDashboardPageProps) {
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
            Admin Dashboard
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--medium-gray)'
          }}>
            Admin dashboard page is under construction.
          </p>
        </div>
      </div>
    </div>
  );
}
