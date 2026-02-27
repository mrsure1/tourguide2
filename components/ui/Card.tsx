import React from 'react';

export const Card = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={`premium-card overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={`p-5 flex flex-col space-y-1.5 border-b border-slate-100 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
    return (
        <h3 className={`font-bold leading-none tracking-tight text-slate-900 ${className}`}>
            {children}
        </h3>
    );
};

export const CardContent = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={`p-5 pt-0 ${className}`}>
            {children}
        </div>
    );
};

export const CardFooter = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={`p-5 flex items-center bg-slate-50 border-t border-slate-100 ${className}`}>
            {children}
        </div>
    );
};
