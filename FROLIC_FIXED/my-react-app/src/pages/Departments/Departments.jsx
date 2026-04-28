import { useState, useEffect } from 'react';
import { departmentService } from '../../services/api';
import * as Icons from 'lucide-react';
import { Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user } = useAuth();
    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const data = await departmentService.getAll();
            setDepartments(data);
        } catch (err) {
            setError('Failed to load departments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the department "${name}"? This will also remove all its events.`)) {
            try {
                await departmentService.delete(id);
                fetchDepartments();
            } catch (err) {
                alert("Failed to delete department: " + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Choose Your Domain</h1>
                <p className="text-gray-400 text-lg">Every department brings unique challenges. Select your arena and showcase your expertise.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {departments.length > 0 ? departments.map((dept) => {
                    // Try to use DepartmentImage as icon name if it exists, otherwise default
                    const IconComponent = Icons[dept.DepartmentImage] || Icons.Code;
                    return (
                        <div key={dept._id} className="group glass-dark p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/50 transition-all duration-500 relative overflow-hidden text-center">
                            {/* Background gradient on hover */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/40 transition-colors"></div>

                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative">
                                <IconComponent className="text-primary group-hover:text-white w-10 h-10 transition-colors" />
                                {user?.isAdmin && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(dept._id, dept.DepartmentName); }}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
                                        title="Delete Department"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 line-clamp-1">{dept.DepartmentName}</h3>
                            <p className="text-gray-400 text-sm mb-10 leading-relaxed line-clamp-3">
                                {dept.DepartmentDescription || `Explore the world of innovation and excellence within the ${dept.DepartmentName} community.`}
                            </p>

                            <div className="flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-widest">
                                <span className="text-primary font-bold">12 Events</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="text-gray-500">800+ Students</span>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full text-center py-20 text-gray-500 text-xl glass rounded-3xl">
                        No departments found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Departments;
