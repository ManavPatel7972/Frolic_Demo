import { useState, useEffect } from 'react';
import { instituteService } from '../../services/api';
import { Search, MapPin, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Institutes = () => {
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();
    const fetchInstitutes = async () => {
        setLoading(true);
        try {
            const data = await instituteService.getAll();
            setInstitutes(data);
        } catch (err) {
            setError('Failed to load institutes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This will also remove all its departments and events.`)) {
            try {
                await instituteService.delete(id);
                fetchInstitutes();
            } catch (err) {
                alert("Failed to delete institute: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const filteredInstitutes = institutes.filter(inst =>
        inst.InstituteName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Participating Institutes</h1>
                    <p className="text-gray-400">Browse through various universities taking part in Frolic.</p>
                </div>

                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search institutes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredInstitutes.length > 0 ? filteredInstitutes.map((inst) => (
                    <div key={inst._id} className="group glass border border-white/10 rounded-3xl overflow-hidden card-hover flex flex-col h-full">
                        <div className="h-64 overflow-hidden relative shrink-0">
                            <img
                                src={inst.InstituteImage || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60'}
                                alt={inst.InstituteName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90 text-xs font-bold tracking-widest uppercase">
                                <MapPin size={14} className="text-primary" />
                                {inst.InstituteLocation || 'Location Pending'}
                            </div>
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                {user?.isAdmin && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(inst._id, inst.InstituteName); }}
                                        className="w-10 h-10 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10"
                                        title="Delete Institute"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-bold text-white mb-4 line-clamp-1">{inst.InstituteName}</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3 flex-grow">
                                {inst.InstituteDescription || "Hosting a variety of technical, non-technical, and cultural events. Represent your institute and win."}
                            </p>
                            <button className="w-full btn-outline py-3.5 flex items-center justify-center gap-2 font-bold text-sm transition-all hover:bg-primary hover:border-primary mt-auto">
                                Explore Events
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-24 text-gray-400 glass rounded-[2.5rem] border border-white/5">
                        <div className="mb-6 opacity-20 flex justify-center">
                            <Search size={64} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                        <p>We couldn't find any institutes matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Institutes;
