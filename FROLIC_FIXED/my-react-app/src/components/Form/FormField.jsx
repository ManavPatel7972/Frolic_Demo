import React from 'react';

/**
 * A reusable form field component that handles labels, inputs, and error states.
 */
const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    options, // For select inputs
    required = false,
    icon // Optional icon element
}) => {
    const baseClasses = "w-full bg-white/5 border rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 transition-all font-sans";
    const borderClasses = error ? "border-red-500 focus:ring-red-500/50" : "border-white/10 focus:ring-primary/50";
    const paddingClasses = icon ? "pl-12" : "px-4";

    return (
        <div className="space-y-2 group">
            <label htmlFor={name} className="block text-sm font-medium text-gray-400 ml-1 group-focus-within:text-primary transition-colors">
                {label} {required && <span className="text-primary">*</span>}
            </label>

            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                        {icon}
                    </div>
                )}

                {type === 'select' ? (
                    <>
                        <select
                            id={name}
                            name={name}
                            value={value}
                            onChange={onChange}
                            className={`${baseClasses} ${borderClasses} ${paddingClasses} appearance-none cursor-pointer pr-10`}
                        >
                            <option value="" disabled className="bg-dark">{placeholder || "Select an option"}</option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-dark py-2">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </>
                ) : type === 'textarea' ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        rows="4"
                        className={`${baseClasses} ${borderClasses} ${paddingClasses} resize-none focus:ring-opacity-50`}
                    />
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`${baseClasses} ${borderClasses} ${paddingClasses} focus:ring-opacity-50`}
                    />
                )}
            </div>

            {error && (
                <p className="text-xs text-red-500 ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormField;
