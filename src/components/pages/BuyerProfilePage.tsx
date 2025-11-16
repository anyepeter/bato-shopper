import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Heart, 
  Star,
  Edit3,
  Camera,
  Save,
  X,
  Award,
  TrendingUp,
  Package
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useApp } from '../AppProvider';

interface BuyerProfilePageProps {
  onNavigateToPage?: (page: string) => void;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  favoriteItems: number;
  profilePicture: string;
  loyaltyLevel: string;
  rewardPoints: number;
}

export function BuyerProfilePage({ onNavigateToPage }: BuyerProfilePageProps) {
  const { state, auth } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize profile data
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Fashion enthusiast and lover of African culture. Always looking for unique pieces that tell a story.',
    joinDate: 'March 2023',
    totalOrders: 12,
    totalSpent: 2847,
    favoriteItems: 23,
    profilePicture: 'https://stock.pincel.app/wp-content/uploads/2023/11/00100-Professional_headshot_of_a_young_Black_woman_with_curly_hair_full_body_in_a_navy_suit_dark_background.jpg',
    loyaltyLevel: 'Gold Member',
    rewardPoints: 1250
  });

  const [editForm, setEditForm] = useState(profile);

  // Load profile picture on component mount
  useEffect(() => {
    const loadProfilePicture = () => {
      // Use the specific profile picture URL provided
      const specificImageUrl = 'https://stock.pincel.app/wp-content/uploads/2023/11/00100-Professional_headshot_of_a_young_Black_woman_with_curly_hair_full_body_in_a_navy_suit_dark_background.jpg';
      setProfilePicture(specificImageUrl);
      setProfile(prev => ({ ...prev, profilePicture: specificImageUrl }));
      setIsLoading(false);
    };

    loadProfilePicture();
  }, []);

  // Update edit form when profile changes
  useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values
      setEditForm(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
    console.log('Profile saved:', editForm);
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = () => {
    // For demo purposes, we'll keep the same image
    // In a real app, this would open a file picker or image selection dialog
    console.log('Profile picture change requested - this would open an image picker in a real app');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-body">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-profile-page min-h-screen text-white" style={{ backgroundColor: 'hsl(240 10% 3.9%)' }}>
      {/* Mobile-optimized container */}
      <div className="buyer-profile-content w-full pb-28" style={{ minHeight: '180vh' }}>
        
        {/* Profile Header with Gradient Background */}
        <div 
          id="buyer-profile-header-gradient"
          className="buyer-profile-header"
          style={{
            background: 'linear-gradient(180deg, #334eff, #0023ff)',
            paddingBottom: '2rem',
            paddingTop: 0,
            marginTop: '-15px'
          }}
        >
          <div className="header-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', background: 'transparent' }}>
            
            {/* Profile Picture Section */}
            <div className="profile-picture-container relative w-full" style={{ height: '70vh', display: 'flex', justifyContent: 'center' }}>
              <div 
                className="profile-picture-wrapper w-full flex items-center justify-center overflow-hidden"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '3px'
                }}
              >
                <img 
                  src={profilePicture || profile.profilePicture}
                  alt="Profile"
                  className="profile-picture w-full h-full object-cover"
                />
              </div>
              
              {/* Camera Button - Always visible, not just when editing */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleProfilePictureChange}
                className="camera-button absolute"
                style={{
                  bottom: '1rem',
                  right: '1rem',
                  width: '3rem',
                  height: '3rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <Camera className="h-5 w-5" style={{ color: 'white' }} />
              </motion.button>
            </div>

            {/* Name and Bio */}
            <div className="name-bio w-full text-center" style={{ color: 'white' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                {profile.name}
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
                {profile.bio}
              </p>
            </div>
            
            {/* Stats Row */}
            <div className="stats-row w-full flex flex-row items-center justify-center" style={{ gap: '1.5rem' }}>
              <div className="stat-item text-center" style={{ color: 'white' }}>
                <div className="stat-value" style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {profile.totalOrders}
                </div>
                <div className="stat-label" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}>
                  Orders
                </div>
              </div>
              <div className="stat-item text-center" style={{ color: 'white' }}>
                <div className="stat-value" style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  ${profile.totalSpent}
                </div>
                <div className="stat-label" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}>
                  Spent
                </div>
              </div>
              <div className="stat-item text-center" style={{ color: 'white' }}>
                <div className="stat-value" style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {profile.favoriteItems}
                </div>
                <div className="stat-label" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}>
                  Favorites
                </div>
              </div>
              
              {/* Edit Button */}
              <button
                onClick={handleEditToggle}
                className="edit-button"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '2rem', 
          padding: '2rem 1rem' 
        }}>
          
          {/* Personal Information Card */}
          <div 
            className="card"
            style={{ 
              background: 'hsl(240 10% 8%)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div className="card-header" style={{ padding: '1.5rem', paddingBottom: '1rem', background: 'transparent', backgroundColor: 'transparent' }}>
              <div className="card-title" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '1.25rem', 
                fontWeight: 600,
                color: 'hsl(0 0% 98%)',
                fontFamily: 'var(--font-heading)',
                background: 'transparent',
                backgroundColor: 'transparent'
              }}>
                <User className="h-5 w-5" />
                <span style={{ background: 'transparent', backgroundColor: 'transparent' }}>Personal Information</span>
              </div>
            </div>
            
            <div className="card-content" style={{ padding: '0 1.5rem 1.5rem' }}>
              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  color: 'hsl(240 5% 64.9%)',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid hsl(240 3.7% 15.9%)',
                      borderRadius: '0.75rem',
                      background: 'hsl(240 10% 10%)',
                      color: 'hsl(0 0% 98%)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  />
                ) : (
                  <div className="form-display" style={{ 
                    padding: '0.75rem 1rem', 
                    background: 'hsl(240 3.7% 15.9%)', 
                    borderRadius: '0.75rem',
                    color: 'hsl(0 0% 98%)',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {profile.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  color: 'hsl(240 5% 64.9%)',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  <Mail className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid hsl(240 3.7% 15.9%)',
                      borderRadius: '0.75rem',
                      background: 'hsl(240 10% 10%)',
                      color: 'hsl(0 0% 98%)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  />
                ) : (
                  <div className="form-display" style={{ 
                    padding: '0.75rem 1rem', 
                    background: 'hsl(240 3.7% 15.9%)', 
                    borderRadius: '0.75rem',
                    color: 'hsl(0 0% 98%)',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {profile.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  color: 'hsl(240 5% 64.9%)',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  <Phone className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid hsl(240 3.7% 15.9%)',
                      borderRadius: '0.75rem',
                      background: 'hsl(240 10% 10%)',
                      color: 'hsl(0 0% 98%)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  />
                ) : (
                  <div className="form-display" style={{ 
                    padding: '0.75rem 1rem', 
                    background: 'hsl(240 3.7% 15.9%)', 
                    borderRadius: '0.75rem',
                    color: 'hsl(0 0% 98%)',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {profile.phone}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '0.875rem', 
                  fontWeight: 500,
                  color: 'hsl(240 5% 64.9%)',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-body)'
                }}>
                  <MapPin className="h-4 w-4" style={{ marginRight: '0.5rem' }} />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid hsl(240 3.7% 15.9%)',
                      borderRadius: '0.75rem',
                      background: 'hsl(240 10% 10%)',
                      color: 'hsl(0 0% 98%)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-body)'
                    }}
                  />
                ) : (
                  <div className="form-display" style={{ 
                    padding: '0.75rem 1rem', 
                    background: 'hsl(240 3.7% 15.9%)', 
                    borderRadius: '0.75rem',
                    color: 'hsl(0 0% 98%)',
                    fontFamily: 'var(--font-body)'
                  }}>
                    {profile.location}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity & Statistics Card */}
          <div 
            className="card"
            style={{ 
              background: 'hsl(240 10% 8%)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div className="card-header" style={{ padding: '1.5rem', paddingBottom: '1rem', background: 'transparent', backgroundColor: 'transparent' }}>
              <div className="card-title" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '1.25rem', 
                fontWeight: 600,
                color: 'hsl(0 0% 98%)',
                fontFamily: 'var(--font-heading)',
                background: 'transparent',
                backgroundColor: 'transparent'
              }}>
                <ShoppingBag className="h-5 w-5" />
                <span style={{ background: 'transparent', backgroundColor: 'transparent' }}>Activity & Statistics</span>
              </div>
            </div>
            
            <div className="card-content" style={{ padding: '0 1.5rem 1.5rem' }}>
              {/* Stats Grid */}
              <div className="stats-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div 
                  className="stat-card"
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))'
                  }}
                >
                  <Award className="h-5 w-5" style={{ color: 'hsl(221.2 83.2% 53.3%)', marginBottom: '0.5rem' }} />
                  <div className="stat-card-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(0 0% 98%)', fontFamily: 'var(--font-heading)' }}>
                    85%
                  </div>
                  <div className="stat-card-label" style={{ fontSize: '0.875rem', color: 'hsl(240 5% 64.9%)', fontFamily: 'var(--font-body)' }}>
                    Cultural Intelligence
                  </div>
                </div>
                
                <div 
                  className="stat-card accent"
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.2))'
                  }}
                >
                  <ShoppingBag className="h-5 w-5" style={{ color: 'hsl(262.1 83.3% 57.8%)', marginBottom: '0.5rem' }} />
                  <div className="stat-card-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(0 0% 98%)', fontFamily: 'var(--font-heading)' }}>
                    {profile.totalOrders}
                  </div>
                  <div className="stat-card-label" style={{ fontSize: '0.875rem', color: 'hsl(240 5% 64.9%)', fontFamily: 'var(--font-body)' }}>
                    Total Gossips
                  </div>
                </div>
              </div>

              {/* Info Rows */}
              <div>
                <div className="info-row" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'hsl(240 3.7% 15.9%)',
                  borderRadius: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div className="info-row-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar className="h-5 w-5" />
                    <span className="info-row-label" style={{ fontWeight: 500, color: 'hsl(0 0% 98%)', fontFamily: 'var(--font-body)' }}>
                      Member Since
                    </span>
                  </div>
                  <span className="info-row-value" style={{ color: 'hsl(240 5% 64.9%)', fontFamily: 'var(--font-body)' }}>
                    {profile.joinDate}
                  </span>
                </div>
                
                <div className="info-row" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'hsl(240 3.7% 15.9%)',
                  borderRadius: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <div className="info-row-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Package className="h-5 w-5" />
                    <span className="info-row-label" style={{ fontWeight: 500, color: 'hsl(0 0% 98%)', fontFamily: 'var(--font-body)' }}>
                      Countries Visited
                    </span>
                  </div>
                  <span className="info-row-value" style={{ color: 'hsl(240 5% 64.9%)', fontFamily: 'var(--font-body)' }}>
                    12 Countries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Card */}
        <div 
          className="bio-card"
          style={{ 
            margin: '2rem 1rem',
            background: 'hsl(240 10% 8%)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}
        >
          <div className="card-header" style={{ padding: '1.5rem', paddingBottom: '1rem', background: 'transparent', backgroundColor: 'transparent' }}>
            <div className="card-title" style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600,
              color: 'hsl(0 0% 98%)',
              fontFamily: 'var(--font-heading)',
              background: 'transparent',
              backgroundColor: 'transparent'
            }}>
              <span style={{ background: 'transparent', backgroundColor: 'transparent' }}>About Me</span>
            </div>
          </div>
          
          <div className="card-content" style={{ padding: '0 1.5rem 1.5rem' }}>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
                className="bio-textarea"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid hsl(240 3.7% 15.9%)',
                  borderRadius: '0.75rem',
                  background: 'hsl(240 10% 10%)',
                  color: 'hsl(0 0% 98%)',
                  resize: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem'
                }}
              />
            ) : (
              <div className="bio-display" style={{ 
                padding: '0.75rem 1rem', 
                background: 'hsl(240 3.7% 15.9%)', 
                borderRadius: '0.75rem',
                lineHeight: 1.75,
                color: 'hsl(0 0% 98%)',
                fontFamily: 'var(--font-body)'
              }}>
                {profile.bio}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <div 
            className="button-group"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              margin: '0 1rem 2rem'
            }}
          >
            <button
              onClick={handleEditToggle}
              className="button button-cancel"
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid hsl(240 3.7% 15.9%)',
                background: 'transparent',
                color: 'hsl(0 0% 98%)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="button button-save"
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'linear-gradient(to right, hsl(221.2 83.2% 53.3%), hsl(262.1 83.3% 57.8%))',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                fontFamily: 'var(--font-body)'
              }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}