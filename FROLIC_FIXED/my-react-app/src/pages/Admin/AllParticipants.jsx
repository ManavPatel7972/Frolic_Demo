import { useState, useEffect } from 'react';
import { participantService, groupService } from '../../services/api';
import { 
    Users, 
    Search, 
    Loader2, 
    Building2, 
    Layers, 
    GraduationCap, 
    Calendar,
    Filter,
    Download,
    Trash2,
    ArrowUpDown,
    CreditCard,
    CheckCircle2
} from 'lucide-react';

const AllParticipants = () => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'ParticipantName', direction: 'asc' });

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const data = await participantService.getAll();
            setParticipants(data || []);
        } catch (err) {
            console.error("Failed to fetch participants", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete participant "${name}"? This action cannot be undone.`)) {
            try {
                await participantService.delete(id);
                fetchParticipants();
            } catch (err) {
                alert("Deletion failed: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleToggleGroupStatus = async (groupId, field, currentValue) => {
        try {
            await groupService.update(groupId, { [field]: !currentValue });
            fetchParticipants();
        } catch (err) {
            alert(`Failed to update ${field}: ` + (err.response?.data?.message || err.message));
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const sortedParticipants = [...participants].sort((a, b) => {
        let aVal = getNestedValue(a, sortConfig.key) || '';
        let bVal = getNestedValue(b, sortConfig.key) || '';
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredParticipants = sortedParticipants.filter(p => 
        p.ParticipantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ParticipantEnrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ParticipantInstituteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.GroupID?.EventID?.EventName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ['Name', 'Enrollment', 'Institute', 'Department', 'Event', 'Mobile', 'Email'];
        const rows = filteredParticipants.map(p => [
            p.ParticipantName,
            p.ParticipantEnrollmentNumber,
            p.ParticipantInstituteName,
            p.GroupID?.EventID?.DepartmentID?.DepartmentName || 'N/A',
            p.GroupID?.EventID?.EventName || 'N/A',
            p.ParticipantMobile,
            p.ParticipantEmail
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "frolic_participants.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-4">
                        <Users className="text-primary" size={40} />
                        Participant Registry
                    </h1>
                    <p className="text-gray-400">Manage and monitor all students registered for Frolic Events.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, ID or event..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <button 
                        onClick={exportToCSV}
                        className="btn-outline flex items-center gap-2 py-4 px-6 border-primary/30 text-white hover:bg-primary/10"
                    >
                        <Download size={18} /> Export CSV
                    </button>
                    
                </div>
            </div>

            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-primary w-12 h-12" />
                    <p className="text-gray-500 font-medium">Loading participants database...</p>
                </div>
            ) : (
                <div className="glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th onClick={() => handleSort('ParticipantName')} className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors group">
                                        <div className="flex items-center gap-2">
                                            Participant <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </th>
                                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
                                    <th onClick={() => handleSort('GroupID.EventID.EventName')} className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors group">
                                        <div className="flex items-center gap-2">
                                            Event <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </th>
                                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Institute & Dept</th>
                                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredParticipants.length > 0 ? filteredParticipants.map((p) => (
                                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg shadow-inner">
                                                    {p.ParticipantName ? p.ParticipantName[0] : '?'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold group-hover:text-primary transition-colors">{p.ParticipantName}</p>
                                                    <p className="text-xs text-gray-500">ID: {p.ParticipantEnrollmentNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Filter size={14} className="text-primary" />
                                                    { p.ParticipantEmail }
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Filter size={14} className="text-primary" />
                                                    { p.ParticipantMobile }
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                                                <Calendar size={14} className="text-primary" />
                                                <span className="text-sm font-bold text-white">
                                                    { p.GroupID?.EventID?.EventName || 'Unassigned'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-sm text-white font-medium">
                                                    <Building2 size={14} className="text-blue-400" />
                                                    {p.ParticipantInstituteName || 'External'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Layers size={14} className="text-purple-400" />
                                                    {p.GroupID?.EventID?.DepartmentID?.DepartmentName || 'Other'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {p.GroupID ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleToggleGroupStatus(p.GroupID?._id, 'IsPaymentDone', p.GroupID?.IsPaymentDone)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                            p.GroupID.IsPaymentDone 
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                                                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20'
                                                        }`}
                                                    >
                                                        <CreditCard size={12} /> {p.GroupID.IsPaymentDone ? 'Paid' : 'Unpaid'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 text-xs italic">No Group</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => handleDelete(p._id, p.ParticipantName)}
                                                className="p-3 text-gray-500 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-lg hover:shadow-red-500/20"
                                                title="Delete Participant"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-32 text-center text-gray-500 italic">
                                            <div className="flex flex-col items-center gap-4">
                                                <Users className="opacity-20" size={60} />
                                                <p className="text-lg">No participants found matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllParticipants;
