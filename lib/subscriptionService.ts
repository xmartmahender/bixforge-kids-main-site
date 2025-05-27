// lib/subscriptionService.ts
import { db } from "./firebase";
import {
  collection, doc, setDoc, updateDoc,
  query, where, orderBy, limit, getDocs, getDoc,
  Timestamp, serverTimestamp
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

// Collection names
const USERS_COLLECTION = 'users';
const FEEDBACK_COLLECTION = 'userFeedback';
const SUBSCRIPTION_PACKAGES_COLLECTION = 'subscriptionPackages';
const BANKS_COLLECTION = 'availableBanks';

// Subscription Package Types
export interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  accessLevel: 'basic' | 'premium' | 'pro' | 'unlimited';
  contentAccess: {
    stories: boolean;
    videos: boolean;
    codeStories: boolean;
    codeVideos: boolean;
    poems: boolean;
    blog: boolean;
    codePlayground: boolean;
  };
  ageGroupAccess: string[]; // ['0-3', '3-6', '6-9', '9-12']
  maxDownloads: number;
  supportLevel: 'basic' | 'priority' | 'premium';
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Account Types
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  subscriptionId?: string;
  subscriptionPackage?: SubscriptionPackage;
  subscriptionExpiry?: Timestamp;
  profile: {
    childName?: string;
    childAge?: number;
    parentName?: string;
    preferredLanguage: string;
    ageGroup: '0-3' | '3-6' | '6-9' | '9-12';
    interests: string[];
  };
  usage: {
    storiesRead: number;
    videosWatched: number;
    codeStoriesCompleted: number;
    timeSpent: number; // in minutes
    lastActive: Timestamp;
    downloadsUsed: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Feedback Types
export interface UserFeedback {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: 'bug' | 'feature' | 'content' | 'general' | 'complaint' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  subject: string;
  message: string;
  contentId?: string; // If feedback is about specific content
  contentType?: 'story' | 'video' | 'code-story' | 'code-video' | 'poem';
  rating?: number; // 1-5 stars
  attachments?: string[]; // URLs to uploaded files
  adminNotes?: string;
  assignedTo?: string;
  resolvedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subscription Management Functions

// Create default subscription packages
export const createDefaultSubscriptionPackages = async () => {
  const packages: Omit<SubscriptionPackage, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Free Explorer',
      description: 'Perfect for getting started with basic content access',
      price: 0,
      duration: 365, // 1 year
      features: [
        'Access to basic stories',
        'Limited video content',
        'Basic poems collection',
        'Community support'
      ],
      accessLevel: 'basic',
      contentAccess: {
        stories: true,
        videos: false,
        codeStories: false,
        codeVideos: false,
        poems: true,
        blog: true,
        codePlayground: false
      },
      ageGroupAccess: ['0-3', '3-6'],
      maxDownloads: 5,
      supportLevel: 'basic',
      isActive: true
    },
    {
      name: 'Learning Champion',
      description: 'Great for young learners with expanded content access',
      price: 9.99,
      duration: 30, // 1 month
      features: [
        'All stories and videos',
        'Basic coding content',
        'Download capability',
        'Priority support',
        'Progress tracking'
      ],
      accessLevel: 'premium',
      contentAccess: {
        stories: true,
        videos: true,
        codeStories: true,
        codeVideos: false,
        poems: true,
        blog: true,
        codePlayground: true
      },
      ageGroupAccess: ['0-3', '3-6', '6-9'],
      maxDownloads: 25,
      supportLevel: 'priority',
      isActive: true
    },
    {
      name: 'Coding Master',
      description: 'Complete access for aspiring young programmers',
      price: 19.99,
      duration: 30, // 1 month
      features: [
        'Full content library access',
        'All coding tutorials',
        'Advanced code playground',
        'Premium support',
        'Unlimited downloads',
        'Exclusive content'
      ],
      accessLevel: 'pro',
      contentAccess: {
        stories: true,
        videos: true,
        codeStories: true,
        codeVideos: true,
        poems: true,
        blog: true,
        codePlayground: true
      },
      ageGroupAccess: ['0-3', '3-6', '6-9', '9-12'],
      maxDownloads: 100,
      supportLevel: 'premium',
      isActive: true
    },
    {
      name: 'Family Unlimited',
      description: 'Perfect for families with multiple children',
      price: 29.99,
      duration: 30, // 1 month
      features: [
        'Everything in Coding Master',
        'Multiple child profiles',
        'Family progress dashboard',
        'Offline content access',
        'Early access to new content',
        'Dedicated family support'
      ],
      accessLevel: 'unlimited',
      contentAccess: {
        stories: true,
        videos: true,
        codeStories: true,
        codeVideos: true,
        poems: true,
        blog: true,
        codePlayground: true
      },
      ageGroupAccess: ['0-3', '3-6', '6-9', '9-12'],
      maxDownloads: -1, // Unlimited
      supportLevel: 'premium',
      isActive: true
    }
  ];

  try {
    for (const pkg of packages) {
      const packageId = uuidv4();
      await setDoc(doc(db, SUBSCRIPTION_PACKAGES_COLLECTION, packageId), {
        ...pkg,
        id: packageId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('Default subscription packages created successfully');
  } catch (error) {
    console.error('Error creating default subscription packages:', error);
    throw error;
  }
};

// Get all subscription packages
export const getSubscriptionPackages = async (): Promise<SubscriptionPackage[]> => {
  try {
    // First try to get from Firebase
    const querySnapshot = await getDocs(
      query(
        collection(db, SUBSCRIPTION_PACKAGES_COLLECTION),
        orderBy('price', 'asc')
      )
    );

    const packages: SubscriptionPackage[] = [];
    querySnapshot.forEach((doc) => {
      const packageData = { id: doc.id, ...doc.data() } as SubscriptionPackage;
      // Only include active packages for users
      if (packageData.isActive) {
        packages.push(packageData);
      }
    });

    if (packages.length > 0) {
      return packages;
    }

    // Fallback to localStorage for admin-created packages
    const localPackages = localStorage.getItem('subscriptionPackages');
    if (localPackages) {
      const parsedPackages = JSON.parse(localPackages);
      return parsedPackages.filter((pkg: SubscriptionPackage) => pkg.isActive);
    }

    return [];
  } catch (error) {
    console.error('Error fetching subscription packages:', error);

    // Fallback to localStorage if Firebase fails
    try {
      const localPackages = localStorage.getItem('subscriptionPackages');
      if (localPackages) {
        const parsedPackages = JSON.parse(localPackages);
        return parsedPackages.filter((pkg: SubscriptionPackage) => pkg.isActive);
      }
      return [];
    } catch (localError) {
      console.error('Error getting local packages:', localError);
      return [];
    }
  }
};

// User Management Functions

// Create or update user account
export const createOrUpdateUser = async (userData: Partial<UserAccount>): Promise<string> => {
  try {
    const userId = userData.id || uuidv4();
    const now = serverTimestamp();

    const userDoc = {
      ...userData,
      id: userId,
      updatedAt: now,
      ...(userData.id ? {} : { createdAt: now })
    };

    await setDoc(doc(db, USERS_COLLECTION, userId), userDoc, { merge: true });
    return userId;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<UserAccount | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as UserAccount;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Get all users with pagination
export const getUsers = async (limitCount: number = 50): Promise<UserAccount[]> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, USERS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    );

    const users: UserAccount[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as UserAccount);
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Assign subscription to user
export const assignSubscriptionToUser = async (
  userId: string,
  packageId: string
): Promise<boolean> => {
  try {
    const subscriptionPackage = await getDoc(doc(db, SUBSCRIPTION_PACKAGES_COLLECTION, packageId));

    if (!subscriptionPackage.exists()) {
      throw new Error('Subscription package not found');
    }

    const pkg = subscriptionPackage.data() as SubscriptionPackage;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + pkg.duration);

    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      subscriptionId: packageId,
      subscriptionPackage: pkg,
      subscriptionExpiry: Timestamp.fromDate(expiryDate),
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error assigning subscription:', error);
    return false;
  }
};

// Feedback Management Functions

// Submit feedback
export const submitFeedback = async (feedbackData: Omit<UserFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const feedbackId = uuidv4();
    const now = serverTimestamp();

    const feedback = {
      ...feedbackData,
      id: feedbackId,
      status: 'new' as const,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, FEEDBACK_COLLECTION, feedbackId), feedback);
    return feedbackId;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Get all feedback with filtering
export const getFeedback = async (
  status?: string,
  type?: string,
  limitCount: number = 50
): Promise<UserFeedback[]> => {
  try {
    let feedbackQuery = query(
      collection(db, FEEDBACK_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (status) {
      feedbackQuery = query(feedbackQuery, where('status', '==', status));
    }

    if (type) {
      feedbackQuery = query(feedbackQuery, where('type', '==', type));
    }

    const querySnapshot = await getDocs(feedbackQuery);
    const feedback: UserFeedback[] = [];

    querySnapshot.forEach((doc) => {
      feedback.push({ id: doc.id, ...doc.data() } as UserFeedback);
    });

    return feedback;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
};

// Update feedback status
export const updateFeedbackStatus = async (
  feedbackId: string,
  status: UserFeedback['status'],
  adminNotes?: string,
  assignedTo?: string
): Promise<boolean> => {
  try {
    const updateData: {
      status: UserFeedback['status'];
      updatedAt: ReturnType<typeof serverTimestamp>;
      adminNotes?: string;
      assignedTo?: string;
      resolvedAt?: ReturnType<typeof serverTimestamp>;
    } = {
      status,
      updatedAt: serverTimestamp()
    };

    if (adminNotes) updateData.adminNotes = adminNotes;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (status === 'resolved') updateData.resolvedAt = serverTimestamp();

    await updateDoc(doc(db, FEEDBACK_COLLECTION, feedbackId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return false;
  }
};

// Check user access to content
export const checkUserAccess = async (
  userId: string,
  contentType: keyof SubscriptionPackage['contentAccess'],
  ageGroup?: string
): Promise<boolean> => {
  try {
    const user = await getUserById(userId);
    if (!user || !user.subscriptionPackage) {
      return false; // No subscription
    }

    // Check if subscription is expired
    if (user.subscriptionExpiry && user.subscriptionExpiry.toDate() < new Date()) {
      return false; // Subscription expired
    }

    // Check content access
    if (!user.subscriptionPackage.contentAccess[contentType]) {
      return false; // Content type not allowed
    }

    // Check age group access if specified
    if (ageGroup && !user.subscriptionPackage.ageGroupAccess.includes(ageGroup)) {
      return false; // Age group not allowed
    }

    return true;
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
};

// Bank Management Types and Functions
export interface BankInfo {
  id: string;
  name: string;
  code?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Get all available banks
export const getAvailableBanks = async (): Promise<BankInfo[]> => {
  try {
    // First try to get from Firebase
    const querySnapshot = await getDocs(
      query(
        collection(db, BANKS_COLLECTION),
        orderBy('name', 'asc')
      )
    );

    const banks: BankInfo[] = [];
    querySnapshot.forEach((doc) => {
      const bankData = { id: doc.id, ...doc.data() } as BankInfo;
      if (bankData.isActive) {
        banks.push(bankData);
      }
    });

    if (banks.length > 0) {
      return banks;
    }

    // Fallback to localStorage
    const localBanks = localStorage.getItem('availableBanks');
    if (localBanks) {
      return JSON.parse(localBanks);
    }

    // Return default banks if none exist
    return getDefaultBanks();
  } catch (error) {
    console.error('Error fetching banks:', error);

    // Fallback to localStorage
    try {
      const localBanks = localStorage.getItem('availableBanks');
      if (localBanks) {
        return JSON.parse(localBanks);
      }
      return getDefaultBanks();
    } catch (localError) {
      console.error('Error getting local banks:', localError);
      return getDefaultBanks();
    }
  }
};

// Get default banks
const getDefaultBanks = (): BankInfo[] => {
  const defaultBanks = [
    'HBL Bank',
    'Mezan Bank',
    'Allied Bank',
    'UBL Bank',
    'MCB Bank',
    'Standard Chartered',
    'Faysal Bank',
    'Bank Alfalah'
  ];

  return defaultBanks.map((name, index) => ({
    id: `bank_${index + 1}`,
    name,
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }));
};

// Add a new bank
export const addBank = async (bankName: string, bankCode?: string): Promise<string> => {
  try {
    const bankId = uuidv4();
    const now = serverTimestamp();

    const bankData = {
      name: bankName,
      code: bankCode,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, BANKS_COLLECTION, bankId), {
      ...bankData,
      id: bankId
    });

    // Also update localStorage as backup
    const existingBanks = await getAvailableBanks();
    const updatedBanks = [...existingBanks, { ...bankData, id: bankId, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }];
    localStorage.setItem('availableBanks', JSON.stringify(updatedBanks));

    return bankId;
  } catch (error) {
    console.error('Error adding bank:', error);
    throw error;
  }
};

// Update bank
export const updateBank = async (bankId: string, updates: Partial<BankInfo>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, BANKS_COLLECTION, bankId), {
      ...updates,
      updatedAt: serverTimestamp()
    });

    // Update localStorage backup
    const existingBanks = await getAvailableBanks();
    const updatedBanks = existingBanks.map(bank =>
      bank.id === bankId ? { ...bank, ...updates, updatedAt: Timestamp.now() } : bank
    );
    localStorage.setItem('availableBanks', JSON.stringify(updatedBanks));

    return true;
  } catch (error) {
    console.error('Error updating bank:', error);
    return false;
  }
};

// Delete bank (set inactive)
export const deleteBank = async (bankId: string): Promise<boolean> => {
  try {
    await updateDoc(doc(db, BANKS_COLLECTION, bankId), {
      isActive: false,
      updatedAt: serverTimestamp()
    });

    // Update localStorage backup
    const existingBanks = await getAvailableBanks();
    const updatedBanks = existingBanks.filter(bank => bank.id !== bankId);
    localStorage.setItem('availableBanks', JSON.stringify(updatedBanks));

    return true;
  } catch (error) {
    console.error('Error deleting bank:', error);
    return false;
  }
};

// Initialize default banks
export const initializeDefaultBanks = async (): Promise<void> => {
  try {
    const existingBanks = await getAvailableBanks();
    if (existingBanks.length === 0) {
      const defaultBanks = getDefaultBanks();

      for (const bank of defaultBanks) {
        await setDoc(doc(db, BANKS_COLLECTION, bank.id), bank);
      }

      localStorage.setItem('availableBanks', JSON.stringify(defaultBanks));
      console.log('Default banks initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing default banks:', error);
  }
};
