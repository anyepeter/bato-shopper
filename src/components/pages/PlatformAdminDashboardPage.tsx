import { ArrowLeft } from 'lucide-react';

interface PlatformAdminDashboardPageProps {
  onNavigateBack?: () => void;
}

export function PlatformAdminDashboardPage({ 
  onNavigateBack
}: PlatformAdminDashboardPageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light-gray)', padding: '2rem' }}>
      <div className="max-w-4xl mx-auto">
        {onNavigateBack && (
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
        )}
        
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
            Platform Admin Dashboard
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--medium-gray)'
          }}>
            This is a buyers-only application. Platform admin portal access is not available.
          </p>
        </div>
      </div>
    </div>
  );
}
