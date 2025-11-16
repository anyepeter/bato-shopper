import { ArrowLeft } from 'lucide-react';

interface AdminCreateAccountPageProps {
  onNavigateBack: () => void;
  onCreateAccount: (userData: any) => Promise<void>;
  onNavigateToSignIn: () => void;
  isLoading?: boolean;
}

export function AdminCreateAccountPage({ 
  onNavigateBack,
  onCreateAccount,
  onNavigateToSignIn,
  isLoading = false
}: AdminCreateAccountPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-gray)', padding: '2rem' }}>
      <div 
        className="w-full max-w-md p-8"
        style={{ 
          backgroundColor: 'var(--pure-white)',
          borderRadius: '3px',
          boxShadow: 'var(--shadow-standard-desktop)'
        }}
      >
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
        
        <h1 style={{ 
          fontFamily: 'var(--font-heading)',
          color: 'var(--primary-blue)',
          marginBottom: '1rem'
        }}>
          Admin Create Account
        </h1>
        <p style={{ 
          fontFamily: 'var(--font-body)',
          color: 'var(--medium-gray)'
        }}>
          Admin account creation page is under construction.
        </p>
      </div>
    </div>
  );
}
