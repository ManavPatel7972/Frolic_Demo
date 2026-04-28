import React from 'react';

const FormPageLayout = ({ title, subtitle, children }) => {
    return (
        <div className="container mx-auto px-6 py-12 flex justify-center relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">{title}</h1>
                    <p className="text-gray-400 text-lg font-light leading-relaxed">{subtitle}</p>
                </div>

                <div className="glass-dark p-8 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-3xl">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FormPageLayout;
