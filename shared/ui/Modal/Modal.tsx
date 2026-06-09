import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title || "Dialog"}</h3>
          <button 
            className="rounded-lg p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            onClick={onClose}
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>
        <div className="mt-4 text-slate-600 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};
