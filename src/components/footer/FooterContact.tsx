import { LocationIcon, PhoneIcon, EmailIcon } from "../BootstrapIcon";

export function FooterContact() {
  return (
    <div className="lg:col-span-2 space-y-4">
      <h4 
        className="text-lg"
        style={{ 
          fontFamily: 'var(--font-heading)',
          color: 'var(--pure-white)'
        }}
      >
        Contact
      </h4>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <LocationIcon size={20} color="var(--primary-blue)" className="mt-0.5" />
          <div>
            <p className="text-sm" style={{ color: '#cccccc' }}>
              123 Fashion District<br />
              New York, NY 10001
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <PhoneIcon size={20} color="var(--primary-blue)" />
          <p className="text-sm" style={{ color: '#cccccc' }}>
            +1 (555) 123-4567
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <EmailIcon size={20} color="var(--primary-blue)" />
          <p className="text-sm" style={{ color: '#cccccc' }}>
            hello@modishstyle.com
          </p>
        </div>
      </div>
    </div>
  );
}