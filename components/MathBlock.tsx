import React from 'react';

interface MathBlockProps {
    children?: React.ReactNode;
    label?: string;
}

export const MathBlock = ({ children, label }: MathBlockProps) => {
    return (
        <div className="my-8 relative group">
            {label && (
                <div className="absolute -top-3 left-4 px-2 bg-neutral-900 text-xs text-neutral-500 uppercase tracking-widest border border-neutral-800">
                    {label}
                </div>
            )}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 text-center overflow-x-auto">
                <div className="font-mono text-lg sm:text-xl text-neutral-200 inline-block min-w-full sm:min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Sup = ({ children }: {children?: React.ReactNode}) => (
    <sup className="text-xs text-neutral-400 ml-0.5">{children}</sup>
);

export const Sub = ({ children }: {children?: React.ReactNode}) => (
    <sub className="text-xs text-neutral-500 mr-0.5">{children}</sub>
);