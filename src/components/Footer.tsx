import { FooterFeatureBar } from "./footer/FooterFeatureBar";
import { FooterBrand } from "./footer/FooterBrand";
import { FooterNavigation } from "./footer/FooterNavigation";
import { FooterContact } from "./footer/FooterContact";
import { FooterCopyright } from "./footer/FooterCopyright";

interface FooterProps {
  onNavigateToPage: (page: string) => void;
}

export function Footer({ onNavigateToPage }: FooterProps) {
  return (
    <footer 
      className="relative"
      style={{ 
        backgroundColor: 'var(--black)',
        color: 'var(--pure-white)',
        fontFamily: 'var(--font-body)'
      }}
    >
      <FooterFeatureBar />
      
      <div className="py-12">
        <div className="max-w-[1600px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            <FooterBrand />
            <FooterNavigation onNavigateToPage={onNavigateToPage} />
            <FooterContact />
          </div>
        </div>
      </div>

      <FooterCopyright />
    </footer>
  );
}