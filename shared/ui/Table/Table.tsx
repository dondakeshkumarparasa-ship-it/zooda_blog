import React from "react";

export interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};
