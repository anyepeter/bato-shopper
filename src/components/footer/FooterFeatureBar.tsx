import { BootstrapIcon } from "../BootstrapIcon";
import { features } from "../../constants/footer";

export function FooterFeatureBar() {
  return (
    <div 
      className="py-4 border-b"
      style={{ 
        backgroundColor: 'var(--primary-blue)',
        borderBottomColor: 'var(--primary-dark-blue)',
        borderBottomWidth: '0.5px'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2">
              <BootstrapIcon name={feature.icon} size={20} color="var(--pure-white)" />
              <span 
                className="text-sm font-medium text-center"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--pure-white)'
                }}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}