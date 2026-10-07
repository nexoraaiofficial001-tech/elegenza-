import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'customer' | 'staff' | 'rider' | 'admin';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  phoneVerified?: boolean;
  loyaltyPoints: number;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isRider: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  verifyPhone: (phone: string, code: string) => Promise<boolean>;
  isPhoneVerified: (phone: string) => boolean;
  addLoyaltyPoints: (points: number) => void;
  deductLoyaltyPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'eleganza_user_v1';
const VERIFIED_PHONES_KEY = 'eleganza_verified_phones_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default demo session configured with user's email as Admin
    return {
      uid: 'admin_nexora',
      name: 'Nexora Admin',
      email: 'nexora.aiofficial001@gmail.com',
      role: 'admin',
      phone: '+923005240034',
      phoneVerified: true,
      loyaltyPoints: 1000,
    };
  });

  const [verifiedPhones, setVerifiedPhones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(VERIFIED_PHONES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['03001234567', '+923001234567'];
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(VERIFIED_PHONES_KEY, JSON.stringify(verifiedPhones));
    } catch {}
  }, [verifiedPhones]);

  const login = async (email: string, role: UserRole = 'customer') => {
    const newUser: AppUser = {
      uid: 'usr_' + Date.now(),
      name: email.split('@')[0],
      email,
      role,
      loyaltyPoints: 120,
      phoneVerified: true,
    };
    setUser(newUser);
  };

  const loginAsDemo = (role: UserRole) => {
    const demoProfiles: Record<UserRole, AppUser> = {
      admin: {
        uid: 'admin_nexora',
        name: 'Nexora Admin',
        email: 'nexora.aiofficial001@gmail.com',
        role: 'admin',
        phone: '+923005240034',
        phoneVerified: true,
        loyaltyPoints: 1000,
      },
      staff: {
        uid: 'staff_demo',
        name: 'Barista Hamza',
        email: 'staff@cafeeleganza.pk',
        role: 'staff',
        phone: '+923019876543',
        phoneVerified: true,
        loyaltyPoints: 200,
      },
      rider: {
        uid: 'rider_demo',
        name: 'Rider Kashif',
        email: 'rider@cafeeleganza.pk',
        role: 'rider',
        phone: '+923023456789',
        phoneVerified: true,
        loyaltyPoints: 50,
      },
      customer: {
        uid: 'cust_demo',
        name: 'Amina Khalid',
        email: 'amina@example.com',
        role: 'customer',
        phone: '+923001234567',
        phoneVerified: true,
        loyaltyPoints: 340,
      },
    };
    setUser(demoProfiles[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const verifyPhone = async (phone: string, code: string): Promise<boolean> => {
    // Demo verification code is '1234' or any 4-digit code
    if (code.trim().length === 4) {
      const cleanPhone = phone.trim();
      setVerifiedPhones((prev) => Array.from(new Set([...prev, cleanPhone])));
      if (user) {
        setUser((prev) => (prev ? { ...prev, phone: cleanPhone, phoneVerified: true } : null));
      }
      return true;
    }
    return false;
  };

  const isPhoneVerified = (phone: string): boolean => {
    const clean = phone.trim();
    return verifiedPhones.includes(clean);
  };

  const addLoyaltyPoints = (points: number) => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, loyaltyPoints: prev.loyaltyPoints + points } : null));
    }
  };

  const deductLoyaltyPoints = (points: number) => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, loyaltyPoints: Math.max(0, prev.loyaltyPoints - points) } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff' || user?.role === 'admin',
        isRider: user?.role === 'rider',
        login,
        loginAsDemo,
        logout,
        verifyPhone,
        isPhoneVerified,
        addLoyaltyPoints,
        deductLoyaltyPoints,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
