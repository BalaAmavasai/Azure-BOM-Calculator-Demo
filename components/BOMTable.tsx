import React from 'react';
import { BOMItem } from '../types';
import { Trash2, Edit2 } from 'lucide-react';

interface BOMTableProps {
  items: BOMItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
}

export const BOMTable: React.FC<BOMTableProps> = ({ items, onRemove, onUpdateQuantity }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500">No services added to the Bill of Materials yet.</p>
        <p className="text-sm text-slate-400 mt-2">Use the "Quick Add" or "AI Estimator" to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Service Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Details / Region</th>
              <th className="px-6 py-4 font-semibold text-center">Qty</th>
              <th className="px-6 py-4 font-semibold text-right">Unit Cost</th>
              <th className="px-6 py-4 font-semibold text-right">Total</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.serviceName}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                  <div className="flex flex-col">
                    <span>{item.description}</span>
                    <span className="text-xs text-slate-400">{item.region}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <input 
                    type="number" 
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-16 rounded-md border-slate-300 py-1 text-center text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                   />
                </td>
                <td className="px-6 py-4 text-right text-slate-600">
                  ${item.monthlyUnitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  ${item.totalMonthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold text-slate-900">
            <tr>
              <td colSpan={5} className="px-6 py-4 text-right text-base">Monthly Total</td>
              <td className="px-6 py-4 text-right text-base text-blue-700">
                ${items.reduce((sum, item) => sum + item.totalMonthlyCost, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>
             <tr>
              <td colSpan={5} className="px-6 py-2 text-right text-sm text-slate-500 border-t-0">Annual Total (Est.)</td>
              <td className="px-6 py-2 text-right text-sm text-slate-600 border-t-0">
                ${(items.reduce((sum, item) => sum + item.totalMonthlyCost, 0) * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
