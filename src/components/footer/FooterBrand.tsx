import { useState } from "react";
import { BootstrapIcon } from "../BootstrapIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { socialLinks } from "../../constants/footer";

export function FooterBrand() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="lg:col-span-4 space-y-6">
      <div>
        <h3 
          className="text-2xl mb-4"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--primary-blue)'
          }}
        >
          Bato
        </h3>
        <p 
          className="text-base leading-relaxed mb-6"
          style={{ 
            color: '#cccccc',
            fontFamily: 'var(--font-body)'
          }}
        >
          Celebrating African heritage through modern fashion. Discover our curated collection of authentic African-inspired clothing and accessories.
        </p>
      </div>

      <div className="space-y-4">
        <h4 
          className="text-lg"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--pure-white)'
          }}
        >
          Stay Updated
        </h4>
        
        {isSubscribed ? (
          <div 
            className="p-4 rounded"
            style={{ 
              backgroundColor: 'var(--success-green)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <p className="text-sm">✓ Thank you for subscribing!</p>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1"
              style={{
                backgroundColor: 'var(--medium-gray)',
                border: 'none',
                color: 'var(--pure-white)',
                borderRadius: 'var(--radius-sm)'
              }}
            />
            <Button
              type="submit"
              className="btn-moema btn-moema-primary btn-moema-sm"
              style={{ 
                height: '40px',
                padding: '0 16px'
              }}
            >
              <BootstrapIcon name="arrow-right" size={16} />
            </Button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        <h4 
          className="text-lg"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--pure-white)'
          }}
        >
          Follow Us
        </h4>
        <div className="flex gap-3">
          {socialLinks.map((social, index) => (
            <button
              key={index}
              onClick={() => window.open(social.url, '_blank')}
              className="btn-moema-icon btn-moema-icon-sm"
              style={{
                backgroundColor: 'var(--medium-gray)',
                color: 'var(--pure-white)',
                width: '40px',
                height: '40px'
              }}
              title={social.name}
            >
              <BootstrapIcon name={social.icon} size={20} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}