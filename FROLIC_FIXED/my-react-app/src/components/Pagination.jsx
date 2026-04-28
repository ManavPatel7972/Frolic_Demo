import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 py-4">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 glass border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-white/5 transition-all"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all ${currentPage === page
                                ? 'bg-primary text-white shadow-[0_0_20px_rgba(233,30,99,0.3)]'
                                : 'glass border border-white/5 text-gray-400 hover:text-white hover:border-primary/30'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 glass border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-30 transition-all font-sans"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
