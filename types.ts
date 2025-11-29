export interface ServiceDefinition {
  id: string;
  name: string;
  category: ServiceCategory;
  basePrice: number; // Monthly base estimation
  unit: string;
}

export enum ServiceCategory {
  COMPUTE = 'Compute',
  STORAGE = 'Storage',
  NETWORKING = 'Networking',
  DATABASE = 'Database',
  AI_ML = 'AI + Machine Learning',
  ANALYTICS = 'Analytics',
  IDENTITY = 'Identity',
  SECURITY = 'Security',
  OTHER = 'Other'
}

export interface BOMItem {
  id: string;
  serviceId: string; // Refers to a known service or 'custom'
  serviceName: string;
  category: ServiceCategory;
  description: string;
  region: string;
  quantity: number;
  monthlyUnitCost: number;
  totalMonthlyCost: number;
}

export interface AIRsponseItem {
  serviceName: string;
  category: string; // String from AI, needs mapping
  description: string;
  estimatedMonthlyCost: number;
  quantity: number;
  reasoning: string;
}
