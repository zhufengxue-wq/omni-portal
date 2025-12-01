import { LucideIcon } from 'lucide-react';

export interface SkillCategory {
  category: string;
  iconName: string; // Storing icon name as string for API compatibility
  color: string;
  bg: string;
  skills: string[];
}

export interface AllianceAchievement {
  id: string;
  title: string;
  detail: string;
  year: string;
  iconName: 'School' | 'Investment' | 'Community' | 'Award';
  level?: string;
}

export interface ZoneOfGenius {
    enjoy: string[];      // 我享受的是...
    effortless: string[]; // 做起来轻而易举的是...
}

export interface UserProfile {
  name: string;
  title: string;
  location: string;
  intro: string;
  tags: string[];
  skillStack: SkillCategory[];
  allianceAchievements: AllianceAchievement[];
  zoneOfGenius: ZoneOfGenius; // New field
}

export interface ProjectRole {
  id: string;
  title: string;
  requiredTalents: string[];
  assignedUserId?: string;
  equityShare: number;
  isFilled: boolean;
}

export interface Project {
  id: number | string;
  title: string;
  description: string;
  progress: number;
  rolesNeeded: string[];
  detailedRoles?: ProjectRole[]; // New field to store rich role data
  image: string;
  owner?: string; 
  isRecommended?: boolean; // New field for AI matching recommendation
  // Extended for Finance View
  userEquity?: number;
  totalDividends?: number;
}

export interface Transaction {
  id: number;
  name: string;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'investment';
}

export interface FinanceData {
  totalAssets: number;
  monthlyPassiveIncome: number;
  monthlyExpense: number;
  activeProjects: Project[];
  transactions: Transaction[];
}

export interface OmniItem {
  id: number;
  // Added 'rwa' type
  type: 'school' | 'services' | 'goods' | 'places' | 'events' | 'healer' | 'travel' | 'investment' | 'rwa';
  title: string;
  subtitle: string;
  price: string;
  unit?: string;
  image: string;
  tag: string;
  isLive?: boolean;
  rating?: number;
  date?: string;
  dist?: string;
  avatars: string[];
  description?: string;
  
  // RWA & Token Gating specific fields
  apy?: string;          // e.g. "8.5%"
  minInvestment?: string;// e.g. "1000 USDT"
  tokenGate?: string;    // e.g. "Requires: Omni OG NFT"
  benefits?: string[];   // e.g. ["7 days free stay", "Owner dividend"]
}

export interface ToolboxItem {
  id: string;
  name: string;
  desc: string;
  iconName: string;
  category: 'tools' | 'thinkTank';
  features?: string[];
  actionLabel?: string; 
  // Fields for external/curated mode (optional if we are in internal mode)
  externalUrl?: string;
  pricing?: string;
  aiMatchReason?: string;
  usedByCount?: number;
}

export interface AllianceTask {
    id: number;
    title: string;
    description: string;
    reward: number; // Token amount
    type: 'Design' | 'Dev' | 'Ops' | 'Content';
    requiredSkills: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    applicants: number;
    isMatched?: boolean; // If it matches user profile
}