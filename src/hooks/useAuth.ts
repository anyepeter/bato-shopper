import { useState } from "react";
import { User } from "../types";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    setIsAuthLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser: User = {
        id: 1,
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: 'User',
        email: email,
        phone: '+1 (555) 123-4567',
        avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150`
      };
      
      setCurrentUser(mockUser);
      return mockUser;
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAdminSignIn = async (email: string, password: string, rememberMe: boolean, adminCode?: string) => {
    setIsAuthLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAdminUser: User = {
        id: 1001,
        firstName: 'Admin',
        lastName: 'User',
        email: email,
        phone: '+1 (555) 123-4567',
        isAdmin: true,
        adminLevel: 'Senior Administrator',
        department: 'Operations',
        jobTitle: 'Senior Administrator',
        companyName: 'Modish Style Inc.',
        location: 'New York, NY',
        bio: 'Experienced e-commerce administrator with 5+ years managing online retail platforms.',
        emergencyContact: '+1 (555) 987-6543',
        supervisorEmail: 'supervisor@modishstyle.com',
        avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150`
      };
      
      setCurrentUser(mockAdminUser);
      return mockAdminUser;
    } catch (error) {
      throw new Error('Invalid admin credentials');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleCreateAccount = async (userData: any) => {
    setIsAuthLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        country: userData.country,
        city: userData.city,
        avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150`
      };
      
      setCurrentUser(newUser);
      return newUser;
    } catch (error) {
      throw new Error('Failed to create account');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAdminCreateAccount = async (userData: any) => {
    setIsAuthLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Admin account request submitted successfully! You will receive an email notification once your request has been reviewed and approved by the system administrator.');
    } catch (error) {
      throw new Error('Failed to submit admin account request');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleUpdateProfile = async (userData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentUser(prev => prev ? { ...prev, ...userData } : null);
      alert('Profile updated successfully!');
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    isAuthLoading,
    handleSignIn,
    handleAdminSignIn,
    handleCreateAccount,
    handleAdminCreateAccount,
    handleUpdateProfile,
    handleSignOut
  };
}