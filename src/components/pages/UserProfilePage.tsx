import { useState, useEffect } from "react";
import { Camera, User, Mail, Phone, MapPin, Calendar, Heart, ShoppingBag, Award, Star, Edit3, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface UserProfilePageProps {
  onNavigateBack: () => void;
}

export function UserProfilePage({ onNavigateBack }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // User data - this would typically come from a user context or API
  const [userData, setUserData] = useState({
    name: "Amara Okafor",
    bio: "Fashion enthusiast and cultural ambassador. Passionate about authentic African designs and connecting heritage with modern style.",
    email: "amara.okafor@email.com",
    phone: "+1 (555) 234-5678",
    location: "Atlanta, GA",
    memberSince: "March 2023",
    totalOrders: 24,
    favoriteItems: 18,
    reviewsGiven: 12,
    loyaltyPoints: 1240,
    preferredCategories: "Dresses, Traditional",
    avgOrderValue: "$127.50"
  });

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll for fixed header
  useEffect(() => {
    const handleScroll = () => {
      const profileHeader = document.getElementById('profile-header-content');
      if (profileHeader) {
        const rect = profileHeader.getBoundingClientRect();
        setIsHeaderFixed(rect.top <= -5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // Here you would typically save to an API
    setIsEditing(false);
    console.log('Profile saved:', userData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-body">Back to Shop</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <header 
        className="relative text-white overflow-hidden"
        style={{
          background: 'var(--vibrant-energy-gradient)',
          paddingBottom: '2rem',
          marginTop: '-1px'
        }}
      >
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,255,255,0.1)_20px,rgba(255,255,255,0.1)_40px)]"></div>
        </div>

        {/* Profile Picture Container */}
        <div 
          className="relative flex justify-center items-center"
          style={{ height: '60vh', minHeight: '400px' }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1639572495229-92f12489b356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3NTU0MTU3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Profile Picture"
            className="w-full h-full object-cover filter blur-[0.5px]"
            style={{ borderRadius: 'var(--radius-sm)' }}
          />
          
          {/* Camera Button */}
          <button
            className="absolute bottom-5 right-5 bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center transition-colors hover:bg-white/30"
            onClick={() => console.log('Change profile picture')}
          >
            <Camera className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Profile Info */}
        <div 
          id="profile-header-content"
          className={`relative text-center transition-all duration-300 ${
            isHeaderFixed 
              ? 'fixed top-0 left-0 w-full z-40 py-4 px-8' 
              : 'py-4'
          }`}
          style={{
            background: isHeaderFixed ? 'var(--vibrant-energy-gradient)' : 'transparent'
          }}
        >
          {isEditing ? (
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="text-2xl font-bold bg-white/20 backdrop-blur-sm rounded px-4 py-2 text-white placeholder-white/70 border border-white/30 w-full text-center font-heading"
                style={{ fontFamily: 'var(--font-heading)' }}
              />
              <textarea
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className="bg-white/20 backdrop-blur-sm rounded px-4 py-2 text-white placeholder-white/70 border border-white/30 w-full text-center resize-none font-body"
                style={{ fontFamily: 'var(--font-body)' }}
                rows={3}
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSaveProfile}
                  className="btn-moema-sm btn-moema-warning"
                  style={{ height: '36px' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-moema-sm btn-moema-outline"
                  style={{ 
                    height: '36px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 
                className="text-3xl font-bold mb-2 font-heading"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {userData.name}
              </h1>
              <p 
                className="text-white/90 mb-6 max-w-md mx-auto font-body"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {userData.bio}
              </p>

              {/* Stats Section */}
              <div className="flex justify-center items-center gap-8 flex-wrap mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold font-heading">{userData.totalOrders}</div>
                  <div className="text-sm text-white/80 font-body">Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold font-heading">{userData.favoriteItems}</div>
                  <div className="text-sm text-white/80 font-body">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold font-heading">{userData.loyaltyPoints}</div>
                  <div className="text-sm text-white/80 font-body">Points</div>
                </div>
                <button 
                  onClick={toggleEdit}
                  className="btn-moema-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    height: '36px'
                  }}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Personal Information */}
          <section 
            className="p-6 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: isMobile ? 'none' : 'var(--shadow-md)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <User 
                className="h-6 w-6"
                style={{ color: 'var(--primary-blue)' }}
              />
              <h3 
                className="text-xl font-semibold font-heading"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--gray-700)'
                }}
              >
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div 
                className="flex items-center p-3 rounded"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Mail 
                  className="h-5 w-5 mr-3"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <span 
                  className="font-medium mr-2 font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Email:
                </span>
                <span 
                  className="font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-800)'
                  }}
                >
                  {userData.email}
                </span>
              </div>

              <div 
                className="flex items-center p-3 rounded"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Phone 
                  className="h-5 w-5 mr-3"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <span 
                  className="font-medium mr-2 font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Phone:
                </span>
                <span 
                  className="font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-800)'
                  }}
                >
                  {userData.phone}
                </span>
              </div>

              <div 
                className="flex items-center p-3 rounded"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <MapPin 
                  className="h-5 w-5 mr-3"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <span 
                  className="font-medium mr-2 font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Location:
                </span>
                <span 
                  className="font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-800)'
                  }}
                >
                  {userData.location}
                </span>
              </div>

              <div 
                className="flex items-center p-3 rounded"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Calendar 
                  className="h-5 w-5 mr-3"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <span 
                  className="font-medium mr-2 font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Member Since:
                </span>
                <span 
                  className="font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-800)'
                  }}
                >
                  {userData.memberSince}
                </span>
              </div>
            </div>
          </section>

          {/* Shopping Statistics */}
          <section 
            className="p-6 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: isMobile ? 'none' : 'var(--shadow-md)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag 
                className="h-6 w-6"
                style={{ color: 'var(--primary-blue)' }}
              />
              <h3 
                className="text-xl font-semibold font-heading"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--gray-700)'
                }}
              >
                Shopping Statistics
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="p-4 rounded text-center"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Heart 
                  className="h-8 w-8 mx-auto mb-2"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <div 
                  className="text-xl font-bold font-heading"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--gray-900)'
                  }}
                >
                  {userData.favoriteItems}
                </div>
                <div 
                  className="text-sm font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Favorites
                </div>
              </div>

              <div 
                className="p-4 rounded text-center"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <ShoppingBag 
                  className="h-8 w-8 mx-auto mb-2"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <div 
                  className="text-xl font-bold font-heading"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--gray-900)'
                  }}
                >
                  {userData.totalOrders}
                </div>
                <div 
                  className="text-sm font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Total Orders
                </div>
              </div>

              <div 
                className="p-4 rounded text-center"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Star 
                  className="h-8 w-8 mx-auto mb-2"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <div 
                  className="text-xl font-bold font-heading"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--gray-900)'
                  }}
                >
                  {userData.reviewsGiven}
                </div>
                <div 
                  className="text-sm font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Reviews Given
                </div>
              </div>

              <div 
                className="p-4 rounded text-center"
                style={{
                  backgroundColor: 'var(--light-gray)',
                  border: '0.5px solid var(--gray-200)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <Award 
                  className="h-8 w-8 mx-auto mb-2"
                  style={{ color: 'var(--primary-blue)' }}
                />
                <div 
                  className="text-xl font-bold font-heading"
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--gray-900)'
                  }}
                >
                  {userData.avgOrderValue}
                </div>
                <div 
                  className="text-sm font-body"
                  style={{ 
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gray-600)'
                  }}
                >
                  Avg. Order Value
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section 
            className="lg:col-span-2 p-6 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: isMobile ? 'none' : 'var(--shadow-md)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <User 
                className="h-6 w-6"
                style={{ color: 'var(--primary-blue)' }}
              />
              <h3 
                className="text-xl font-semibold font-heading"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--gray-700)'
                }}
              >
                About Me
              </h3>
            </div>
            
            <div className="space-y-4">
              <p 
                className="font-body leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--gray-700)',
                  lineHeight: '1.6'
                }}
              >
                As a passionate advocate for African fashion and culture, I believe that clothing is more than just fabric – it's a celebration of heritage, identity, and artistry. My journey with African fashion began during my first visit to Ghana, where I was mesmerized by the vibrant colors, intricate patterns, and rich storytelling woven into every piece.
              </p>
              <p 
                className="font-body leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--gray-700)',
                  lineHeight: '1.6'
                }}
              >
                I specialize in supporting contemporary African designers who blend traditional techniques with modern aesthetics. My wardrobe reflects my commitment to sustainable fashion and ethical sourcing, featuring pieces that not only look beautiful but also support African artisans and communities.
              </p>
              <p 
                className="font-body leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--gray-700)',
                  lineHeight: '1.6'
                }}
              >
                When I'm not exploring the latest collections, I enjoy attending cultural events, learning about different African traditions, and sharing my passion for authentic African fashion through social media and fashion communities. I believe that by wearing these beautiful designs, we honor the creativity and craftsmanship of African culture while making a statement about diversity and inclusion in the fashion world.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}