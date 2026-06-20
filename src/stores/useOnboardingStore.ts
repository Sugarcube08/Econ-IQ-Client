'use client';

import { create } from 'zustand';

export interface OrgProfile {
  name: string;
  industry: string;
  businessType: string;
  country: string;
  state: string;
  primaryContact: string;
  companySize: string;
}

export interface CommercialConfig {
  windowDays: number;
  currency: string;
  reportingPref: string;
  calendar: string;
}

export interface DataReadiness {
  erp: 'connected' | 'pending' | 'none';
  sync: 'connected' | 'pending' | 'none';
  ledger: 'connected' | 'pending' | 'none';
  customer: 'connected' | 'pending' | 'none';
}

export interface SecuritySetup {
  adminContact: string;
  apiAccess: boolean;
  userRolesCount: number;
}

interface OnboardingState {
  // Wizard states
  currentStep: number;
  orgProfile: OrgProfile;
  commercialConfig: CommercialConfig;
  dataReadiness: DataReadiness;
  securitySetup: SecuritySetup;
  
  // Status flags
  isOnboarded: boolean;
  completedTour: boolean;
  
  // Activation Checklist states
  checklist: {
    orgSetup: boolean;
    firstUser: boolean;
    firstSync: boolean;
    firstRun: boolean;
    firstReport: boolean;
  };

  // Multi-org details (pre-prepared architecture)
  activeOrgId: string;
  organizations: Array<{ id: string; name: string }>;

  // Actions
  setStep: (step: number) => void;
  updateOrgProfile: (profile: Partial<OrgProfile>) => void;
  updateCommercialConfig: (config: Partial<CommercialConfig>) => void;
  updateDataReadiness: (readiness: Partial<DataReadiness>) => void;
  updateSecuritySetup: (setup: Partial<SecuritySetup>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setTourCompleted: (completed: boolean) => void;
  updateChecklistItem: (key: keyof OnboardingState['checklist'], value: boolean) => void;
  switchOrganization: (orgId: string) => void;
  addOrganization: (name: string) => void;
}

const defaultOrgProfile: OrgProfile = {
  name: '',
  industry: '',
  businessType: '',
  country: '',
  state: '',
  primaryContact: '',
  companySize: '',
};

const defaultCommercialConfig: CommercialConfig = {
  windowDays: 365,
  currency: 'USD',
  reportingPref: 'standard',
  calendar: 'gregorian',
};

const defaultDataReadiness: DataReadiness = {
  erp: 'none',
  sync: 'none',
  ledger: 'none',
  customer: 'none',
};

const defaultSecuritySetup: SecuritySetup = {
  adminContact: '',
  apiAccess: false,
  userRolesCount: 1,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => {
  // Safe retrieval from localStorage in client environment
  let savedState: unknown = null;
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('econ_onboarding_state');
    if (raw) {
      try {
        savedState = JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse onboarding state:', e);
      }
    }
  }

  const initialState = (savedState as OnboardingState | null) || {
    currentStep: 1,
    orgProfile: defaultOrgProfile,
    commercialConfig: defaultCommercialConfig,
    dataReadiness: defaultDataReadiness,
    securitySetup: defaultSecuritySetup,
    isOnboarded: false,
    completedTour: false,
    checklist: {
      orgSetup: false,
      firstUser: false,
      firstSync: false,
      firstRun: false,
      firstReport: false,
    },
    activeOrgId: 'org_default',
    organizations: [{ id: 'org_default', name: 'Primary Organization' }],
  };

  const persist = (nextState: Partial<OnboardingState>) => {
    if (typeof window !== 'undefined') {
      const current = { ...get(), ...nextState };
      localStorage.setItem('econ_onboarding_state', JSON.stringify({
        currentStep: current.currentStep,
        orgProfile: current.orgProfile,
        commercialConfig: current.commercialConfig,
        dataReadiness: current.dataReadiness,
        securitySetup: current.securitySetup,
        isOnboarded: current.isOnboarded,
        completedTour: current.completedTour,
        checklist: current.checklist,
        activeOrgId: current.activeOrgId,
        organizations: current.organizations,
      }));
    }
  };

  return {
    ...initialState,

    setStep: (step) => {
      set({ currentStep: step });
      persist({ currentStep: step });
    },

    updateOrgProfile: (profile) => {
      const updated = { ...get().orgProfile, ...profile };
      set({ orgProfile: updated });
      persist({ orgProfile: updated });
    },

    updateCommercialConfig: (config) => {
      const updated = { ...get().commercialConfig, ...config };
      set({ commercialConfig: updated });
      persist({ commercialConfig: updated });
    },

    updateDataReadiness: (readiness) => {
      const updated = { ...get().dataReadiness, ...readiness };
      set({ dataReadiness: updated });
      persist({ dataReadiness: updated });
      
      // If ERP or Data sync gets connected, check off data sync in checklist
      if (updated.erp === 'connected' || updated.sync === 'connected') {
        get().updateChecklistItem('firstSync', true);
      }
    },

    updateSecuritySetup: (setup) => {
      const updated = { ...get().securitySetup, ...setup };
      set({ securitySetup: updated });
      persist({ securitySetup: updated });
    },

    completeOnboarding: () => {
      set({ isOnboarded: true });
      persist({ isOnboarded: true });
      get().updateChecklistItem('orgSetup', true);
    },

    resetOnboarding: () => {
      const reset = {
        currentStep: 1,
        orgProfile: defaultOrgProfile,
        commercialConfig: defaultCommercialConfig,
        dataReadiness: defaultDataReadiness,
        securitySetup: defaultSecuritySetup,
        isOnboarded: false,
        completedTour: false,
        checklist: {
          orgSetup: false,
          firstUser: false,
          firstSync: false,
          firstRun: false,
          firstReport: false,
        },
        activeOrgId: 'org_default',
        organizations: [{ id: 'org_default', name: 'Primary Organization' }],
      };
      set(reset);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('econ_onboarding_state');
      }
    },

    setTourCompleted: (completed) => {
      set({ completedTour: completed });
      persist({ completedTour: completed });
    },

    updateChecklistItem: (key, value) => {
      const updatedChecklist = { ...get().checklist, [key]: value };
      set({ checklist: updatedChecklist });
      persist({ checklist: updatedChecklist });
    },

    switchOrganization: (orgId) => {
      set({ activeOrgId: orgId });
      persist({ activeOrgId: orgId });
    },

    addOrganization: (name) => {
      const id = 'org_' + ((Date.now() % 900000) + 100000);
      const updatedOrgs = [...get().organizations, { id, name }];
      set({ organizations: updatedOrgs, activeOrgId: id });
      persist({ organizations: updatedOrgs, activeOrgId: id });
    },
  };
});
