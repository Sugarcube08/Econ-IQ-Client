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
  orgProfile: OrgProfile;
  commercialConfig: CommercialConfig;
  dataReadiness: DataReadiness;
  securitySetup: SecuritySetup;

  // Multi-org details (pre-prepared architecture)
  activeOrgId: string;
  organizations: Array<{ id: string; name: string }>;

  // Actions
  updateOrgProfile: (profile: Partial<OrgProfile>) => void;
  updateCommercialConfig: (config: Partial<CommercialConfig>) => void;
  updateDataReadiness: (readiness: Partial<DataReadiness>) => void;
  updateSecuritySetup: (setup: Partial<SecuritySetup>) => void;
  switchOrganization: (orgId: string) => void;
  addOrganization: (name: string) => void;
}

const defaultOrgProfile: OrgProfile = {
  name: 'Standard Steel Castings Ltd.',
  industry: 'manufacturing',
  businessType: 'corporation',
  country: 'India',
  state: 'Punjab',
  primaryContact: 'Arjan Vohra',
  companySize: '201-1000',
};

const defaultCommercialConfig: CommercialConfig = {
  windowDays: 365,
  currency: 'INR',
  reportingPref: 'standard',
  calendar: 'gregorian',
};

const defaultDataReadiness: DataReadiness = {
  erp: 'connected',
  sync: 'connected',
  ledger: 'connected',
  customer: 'connected',
};

const defaultSecuritySetup: SecuritySetup = {
  adminContact: 'admin@standardsteel.com',
  apiAccess: true,
  userRolesCount: 3,
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
    orgProfile: defaultOrgProfile,
    commercialConfig: defaultCommercialConfig,
    dataReadiness: defaultDataReadiness,
    securitySetup: defaultSecuritySetup,
    activeOrgId: 'org_default',
    organizations: [{ id: 'org_default', name: 'Primary Organization' }],
  };

  const persist = (nextState: Partial<OnboardingState>) => {
    if (typeof window !== 'undefined') {
      const current = { ...get(), ...nextState };
      localStorage.setItem('econ_onboarding_state', JSON.stringify({
        orgProfile: current.orgProfile,
        commercialConfig: current.commercialConfig,
        dataReadiness: current.dataReadiness,
        securitySetup: current.securitySetup,
        activeOrgId: current.activeOrgId,
        organizations: current.organizations,
      }));
    }
  };

  return {
    ...initialState,

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
    },

    updateSecuritySetup: (setup) => {
      const updated = { ...get().securitySetup, ...setup };
      set({ securitySetup: updated });
      persist({ securitySetup: updated });
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
