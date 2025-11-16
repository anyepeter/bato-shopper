import React, { createContext, useContext, ReactNode } from 'react';
import { AppState, AppActions, useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';

interface AppContextType {
  state: AppState;
  actions: AppActions;
  auth: ReturnType<typeof useAuth>;
  cart: ReturnType<typeof useCart>;
  favorites: ReturnType<typeof useFavorites>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  try {
    const [state, actions] = useAppState();
    const auth = useAuth();
    const cart = useCart();
    const favorites = useFavorites();

    const value: AppContextType = {
      state,
      actions,
      auth,
      cart,
      favorites
    };

    console.log('✅ AppProvider initialized successfully');

    return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    );
  } catch (error) {
    console.error('❌ AppProvider initialization failed:', error);
    
    // Return error UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-6">
          <h2 className="text-xl mb-4">App Initialization Error</h2>
          <p className="text-sm mb-4">Failed to initialize application state</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Reload
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 text-xs text-left bg-gray-900 p-3 rounded overflow-auto max-w-md">
              {error?.toString()}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

AppProvider.displayName = 'AppProvider';