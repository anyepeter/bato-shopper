import { footerSections } from "../../constants/footer";

interface FooterNavigationProps {
  onNavigateToPage: (page: string) => void;
}

export function FooterNavigation({ onNavigateToPage }: FooterNavigationProps) {
  return (
    <div className="lg:col-span-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {footerSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <h4 
              className="text-lg"
              style={{ 
                fontFamily: 'var(--font-heading)',
                color: 'var(--pure-white)'
              }}
            >
              {section.title}
            </h4>
            <ul className="space-y-3">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <button
                    onClick={() => link.page && onNavigateToPage(link.page)}
                    className="text-base transition-colors hover:underline cursor-pointer"
                    style={{ 
                      color: '#cccccc',
                      fontFamily: 'var(--font-body)',
                      background: 'none',
                      border: 'none',
                      padding: '0',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary-blue)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#cccccc';
                    }}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}