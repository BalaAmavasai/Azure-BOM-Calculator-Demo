import React, { useState, useCallback } from 'react';
import { Plus, Sparkles, Download, Cloud, Info } from 'lucide-react';
import { BOMTable } from './components/BOMTable';
import { CostCharts } from './components/CostCharts';
import { AZURE_REGIONS, PREDEFINED_SERVICES } from './constants';
import { BOMItem, ServiceCategory, ServiceDefinition } from './types';
import { generateBOMFromDescription } from './services/geminiService';

const App: React.FC = () => {
  const [bomItems, setBomItems] = useState<BOMItem[]>([]);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  
  // Manual Input State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(PREDEFINED_SERVICES[0].id);
  const [selectedRegion, setSelectedRegion] = useState<string>(AZURE_REGIONS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  
  // AI Input State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const addManualItem = useCallback(() => {
    const serviceDef = PREDEFINED_SERVICES.find(s => s.id === selectedServiceId);
    if (!serviceDef) return;

    const newItem: BOMItem = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: serviceDef.id,
      serviceName: serviceDef.name,
      category: serviceDef.category,
      description: `Standard tier - ${serviceDef.unit}`,
      region: selectedRegion,
      quantity: quantity,
      monthlyUnitCost: serviceDef.basePrice,
      totalMonthlyCost: serviceDef.basePrice * quantity
    };

    setBomItems(prev => [...prev, newItem]);
  }, [selectedServiceId, selectedRegion, quantity]);

  const handleGenerateBOM = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    setAiError(null);

    try {
      const generatedItems = await generateBOMFromDescription(aiPrompt);
      
      const newItems: BOMItem[] = generatedItems.map(g => ({
        id: Math.random().toString(36).substr(2, 9),
        serviceId: 'ai-generated',
        serviceName: g.serviceName,
        category: (g.category as ServiceCategory) || ServiceCategory.OTHER,
        description: g.description,
        region: 'Global/Recommended',
        quantity: g.quantity,
        monthlyUnitCost: g.estimatedMonthlyCost / g.quantity, // Estimating unit cost from total
        totalMonthlyCost: g.estimatedMonthlyCost
      }));

      setBomItems(prev => [...prev, ...newItems]);
      setAiPrompt(''); // Clear prompt on success
      setActiveTab('manual'); // Switch back to view
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeItem = (id: string) => {
    setBomItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQty: number) => {
    setBomItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQty,
          totalMonthlyCost: item.monthlyUnitCost * newQty
        };
      }
      return item;
    }));
  };

  const handleExport = () => {
    const headers = ['Service Name', 'Category', 'Description', 'Region', 'Quantity', 'Unit Cost', 'Total Cost'];
    const rows = bomItems.map(item => [
      item.serviceName,
      item.category,
      item.description,
      item.region,
      item.quantity,
      item.monthlyUnitCost.toFixed(2),
      item.totalMonthlyCost.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "celebal_azure_bom.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-celebal-primary/10 p-2 rounded-lg">
                <Cloud className="text-celebal-primary" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Celebal Technologies</h1>
                <p className="text-xs text-slate-500 font-medium">Azure BOM Calculator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-celebal-primary to-blue-700 rounded-xl p-6 text-white shadow-lg shadow-blue-900/10">
            <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wider">Total Monthly Estimate</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                ${bomItems.reduce((acc, i) => acc + i.totalMonthlyCost, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-blue-200">/mo</span>
            </div>
            <p className="mt-4 text-xs text-blue-200 bg-white/10 inline-block px-2 py-1 rounded">
               {bomItems.length} Services Configured
            </p>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Build your Estimate</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-lg">
                Add services manually from the catalog or use our AI assistant to generate a BOM from a natural language project description.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-slate-400">Powered by</p>
              <div className="font-bold text-slate-600 flex items-center gap-1 justify-end">
                Celebal Technologies
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('manual')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'manual'
                    ? 'border-celebal-primary text-celebal-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="flex items-center gap-2"><Plus size={16}/> Quick Add</span>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'ai'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="flex items-center gap-2"><Sparkles size={16}/> AI Estimator</span>
              </button>
            </nav>
          </div>

          <div className="p-6 bg-slate-50/50">
            {activeTab === 'manual' ? (
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
                  <select 
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 bg-white text-slate-900"
                  >
                    {PREDEFINED_SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${s.basePrice}/{s.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 bg-white text-slate-900"
                  >
                    {AZURE_REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 bg-white text-slate-900"
                  />
                </div>
                <button 
                  onClick={addManualItem}
                  className="w-full md:w-auto px-6 py-2.5 bg-celebal-primary text-white text-sm font-medium rounded-lg hover:bg-blue-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Service
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-4">
                  <div className="flex gap-2">
                    <Info size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-purple-800">
                      Describe your architecture (e.g., "A highly available web app with SQL database, Redis cache, and CDN for global users"). Gemini will suggest services and estimated costs.
                    </p>
                  </div>
                </div>
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g. I need a backend infrastructure for a mobile app with 10k daily users using Kubernetes..."
                  className="w-full h-32 rounded-lg border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-4 bg-white text-slate-900"
                />
                <div className="flex justify-end items-center gap-4">
                  {aiError && <span className="text-red-500 text-sm font-medium">{aiError}</span>}
                  <button 
                    onClick={handleGenerateBOM}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className={`px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center gap-2 ${
                      isGenerating || !aiPrompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-indigo-700'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Generate BOM
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-8">
          <BOMTable 
            items={bomItems} 
            onRemove={removeItem}
            onUpdateQuantity={updateQuantity}
          />
          
          <CostCharts items={bomItems} />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Celebal Technologies. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            *Pricing estimates are for demonstration purposes only and may not reflect current Azure market rates. Always verify with the official Azure Pricing Calculator.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;