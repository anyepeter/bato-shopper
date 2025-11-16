import { ArrowLeft } from 'lucide-react';

interface AdminSignInPageProps {
  onNavigateBack: () => void;
  onSignIn: (email: string, password: string, rememberMe: boolean, adminCode?: string) => Promise<void>;
  onNavigateToCreateAccount: () => void;
  isLoading?: boolean;
}

export function AdminSignInPage({ 
  onNavigateBack,
  onSignIn,
  onNavigateToCreateAccount,
  isLoading = false
}: AdminSignInPageProps) {
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
          Admin Sign In
        </h1>
        <p style={{ 
          fontFamily: 'var(--font-body)',
          color: 'var(--medium-gray)'
        }}>
          Admin sign in page is under construction.
        </p>
      </div>
    </div>
  );
}
