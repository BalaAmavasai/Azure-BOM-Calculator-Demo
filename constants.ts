import { ServiceCategory, ServiceDefinition } from './types';

export const AZURE_REGIONS = [
  "East US",
  "East US 2",
  "West US",
  "West Europe",
  "North Europe",
  "Southeast Asia",
  "Central India",
  "Japan East"
];

export const PREDEFINED_SERVICES: ServiceDefinition[] = [
  { id: 'vm-linux-d2s', name: 'Virtual Machine (Linux, D2s v3)', category: ServiceCategory.COMPUTE, basePrice: 70, unit: 'Instance' },
  { id: 'vm-windows-d2s', name: 'Virtual Machine (Windows, D2s v3)', category: ServiceCategory.COMPUTE, basePrice: 136, unit: 'Instance' },
  { id: 'aks-standard', name: 'Azure Kubernetes Service (Standard)', category: ServiceCategory.COMPUTE, basePrice: 72, unit: 'Cluster Mgmt' },
  { id: 'app-service-p1v2', name: 'App Service (Premium V2 P1v2)', category: ServiceCategory.COMPUTE, basePrice: 146, unit: 'Instance' },
  { id: 'func-premium', name: 'Azure Functions (Premium)', category: ServiceCategory.COMPUTE, basePrice: 150, unit: 'Plan' },
  
  { id: 'sql-db-s0', name: 'Azure SQL Database (Standard S0)', category: ServiceCategory.DATABASE, basePrice: 15, unit: 'Database' },
  { id: 'sql-mi-gen5', name: 'Azure SQL Managed Instance (Gen5)', category: ServiceCategory.DATABASE, basePrice: 700, unit: 'Instance' },
  { id: 'cosmos-db', name: 'Azure Cosmos DB (400 RU/s)', category: ServiceCategory.DATABASE, basePrice: 24, unit: '100 RU/s' },
  
  { id: 'blob-storage-hot', name: 'Blob Storage (Hot, 1TB)', category: ServiceCategory.STORAGE, basePrice: 20, unit: 'TB' },
  { id: 'disk-p10', name: 'Managed Disk (SSD P10 128GB)', category: ServiceCategory.STORAGE, basePrice: 18, unit: 'Disk' },
  
  { id: 'vnet', name: 'Virtual Network', category: ServiceCategory.NETWORKING, basePrice: 0, unit: 'VNet' },
  { id: 'app-gateway', name: 'Application Gateway (Standard v2)', category: ServiceCategory.NETWORKING, basePrice: 200, unit: 'Gateway' },
  { id: 'bandwidth', name: 'Bandwidth (Outbound Data Transfer 1TB)', category: ServiceCategory.NETWORKING, basePrice: 80, unit: 'TB' },

  { id: 'ai-search', name: 'Azure AI Search (Basic)', category: ServiceCategory.AI_ML, basePrice: 75, unit: 'Service' },
  { id: 'openai', name: 'Azure OpenAI (S0)', category: ServiceCategory.AI_ML, basePrice: 100, unit: 'Unit' },
];
