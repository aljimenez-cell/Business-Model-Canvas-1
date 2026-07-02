/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BMCItem {
  id: string;
  text: string;
  isAiEnriched?: boolean;
}

export interface BusinessModelCanvas {
  id: string;
  projectName: string;
  description: string;
  // The 9 Canvas Blocks
  keyPartnerships: BMCItem[];
  keyActivities: BMCItem[];
  keyResources: BMCItem[];
  valuePropositions: BMCItem[];
  customerRelationships: BMCItem[];
  channels: BMCItem[];
  customerSegments: BMCItem[];
  costStructure: BMCItem[];
  revenueStreams: BMCItem[];
  createdAt: string;
}

export type CanvasBlockId =
  | 'keyPartnerships'
  | 'keyActivities'
  | 'keyResources'
  | 'valuePropositions'
  | 'customerRelationships'
  | 'channels'
  | 'customerSegments'
  | 'costStructure'
  | 'revenueStreams';

export interface BMCBlockConfig {
  id: CanvasBlockId;
  title: string;
  emoji: string;
  description: string;
  placeholder: string;
  questions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  // If this message triggers a state update or carries block enrichment suggestions
  suggestions?: string[];
  blockToEnrich?: CanvasBlockId;
}

export interface HealthReport {
  synergies: string[];
  redFlags: string[];
  nextSteps: string[];
}
