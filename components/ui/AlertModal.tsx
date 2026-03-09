import { ShieldAlert, X } from "lucide-react";
import { Button } from "./Button";

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: React.ReactNode;
  onClose: () => void;
}

export function AlertModal({ isOpen, title = "안내", message, onClose }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 outline-none transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5 border-4 border-rose-100">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-6 text-sm">{message}</p>
          <Button size="lg" className="w-full rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 h-12" onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
