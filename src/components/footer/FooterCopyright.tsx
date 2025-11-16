export function FooterCopyright() {
  return (
    <div 
      className="py-6 border-t"
      style={{ 
        borderTopColor: 'var(--dark-gray)',
        borderTopWidth: '0.5px',
        backgroundColor: '#111111'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-sm text-center md:text-left"
            style={{ 
              color: '#888888',
              fontFamily: 'var(--font-body)'
            }}
          >
            © 2024 Bato. All rights reserved. Celebrating African fashion with modern elegance.
          </p>
          
          <div className="flex gap-6 text-sm">
            <button 
              className="transition-colors"
              style={{ 
                color: '#888888',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888888';
              }}
            >
              Privacy Policy
            </button>
            <button 
              className="transition-colors"
              style={{ 
                color: '#888888',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888888';
              }}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}