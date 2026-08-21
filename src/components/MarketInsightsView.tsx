import React from 'react';
import { UserProfile, ActiveTab } from '../types';
import { CommonMarketDashboard } from './CommonMarketDashboard';

interface MarketInsightsViewProps {
  profile: UserProfile;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const MarketInsightsView: React.FC<MarketInsightsViewProps> = ({ profile, setActiveTab }) => {
  return (
    <CommonMarketDashboard
      profile={profile}
      onNavigateToMarketplace={() => setActiveTab && setActiveTab('marketplace')}
    />
  );
};
