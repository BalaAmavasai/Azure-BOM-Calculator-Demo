import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BOMItem } from '../types';

interface CostChartsProps {
  items: BOMItem[];
}

const COLORS = ['#0ea5e9', '#3b82f6', '#1d4ed8', '#0284c7', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export const CostCharts: React.FC<CostChartsProps> = ({ items }) => {
  if (items.length === 0) return null;

  // Group by Category
  const categoryData = Object.values(items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { name: item.category, value: 0 };
    }
    acc[item.category].value += item.totalMonthlyCost;
    return acc;
  }, {} as Record<string, { name: string; value: number }>));

  // Top 5 most expensive services
  const serviceData = [...items]
    .sort((a, b) => b.totalMonthlyCost - a.totalMonthlyCost)
    .slice(0, 5)
    .map(item => ({
      name: item.serviceName.length > 15 ? item.serviceName.substring(0, 15) + '...' : item.serviceName,
      cost: item.totalMonthlyCost
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Cost by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Services by Cost</h3>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(val) => `$${val}`} />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} cursor={{fill: '#f0f9ff'}} />
              <Bar dataKey="cost" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
