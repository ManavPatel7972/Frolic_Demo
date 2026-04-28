import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { instituteService, departmentService, eventService, participantService, userService } from '../../services/api';
import { Trash2, Building2, Layers, Calendar, Search, Loader2, Plus, Users as UsersIcon, UserCog, Shield, ShieldOff, Star, StarOff, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const ManageData = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('institutes');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['institutes', 'departments', 'events', 'participants', 'users'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    const [data, setData] = useState({ institutes: [], departments: [], events: [], participants: [], users: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [insts, depts, evts, parts, usrs] = await Promise.all([
                instituteService.getAll(),
                departmentService.getAll(),
                eventService.getAll(),
                participantService.getAll(),
                userService.getAll().catch(() => []) // Handle case where user might not be super admin
            ]);
            
            setData({ 
                institutes: insts || [], 
                departments: depts || [], 
                events: evts || [],
                participants: parts || [],
                users: usrs || []
            });
        } catch (err) {
            console.error("Failed to fetch management data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    const [selectedWinnerEvent, setSelectedWinnerEvent] = useState(null);
    const [eventGroups, setEventGroups] = useState([]);
    const [eventWinners, setEventWinners] = useState([]);
    const [winnerFormData, setWinnerFormData] = useState({ 1: '', 2: '', 3: '' });
    const [winnerLoading, setWinnerLoading] = useState(false);

    const handleWinnerClick = async (event) => {
        setSelectedWinnerEvent(event);
        setIsWinnerModalOpen(true);
        setWinnerLoading(true);
        try {
            const groups = await eventService.getGroups(event._id);
            setEventGroups(groups);
            
            try {
                const winnersData = await eventService.getWinners(event._id);
                setEventWinners(winnersData.winners);
                const prefill = { 1: '', 2: '', 3: '' };
                winnersData.winners.forEach(w => {
                    prefill[w.sequence] = w.GroupID._id;
                });
                setWinnerFormData(prefill);
            } catch (err) {
                setEventWinners([]);
                setWinnerFormData({ 1: '', 2: '', 3: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setWinnerLoading(false);
        }
    };

    const handleDeclareWinner = async (sequence) => {
        const groupID = winnerFormData[sequence];
        if (!groupID) return alert('Please Select a Group First before declaring the winner.');
        
        try {
            await eventService.declareWinner(selectedWinnerEvent._id, { GroupID: groupID, sequence });
            alert(`Position ${sequence} declared !`);
            handleWinnerClick(selectedWinnerEvent); 
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleRemoveWinner = async (sequence) => {
        if (!window.confirm(`Are you sure you want to revoke the winner for Position ${sequence}?`)) return;
        try {
            await eventService.removeWinner(selectedWinnerEvent._id, sequence);
            handleWinnerClick(selectedWinnerEvent); 
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (type, id, name) => {
        if (window.confirm(`Permanently remove "${name}" and all its related data?`)) {
            try {
                if (type === 'institute') await instituteService.delete(id);
                if (type === 'department') await departmentService.delete(id);
                if (type === 'event') await eventService.delete(id);
                if (type === 'participant') await participantService.delete(id);
                if (type === 'user') await userService.delete(id);
                fetchData();
            } catch (err) {
                alert("Deletion failed: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleToggleAdmin = async (id, currentStatus) => {
        try {
            await userService.update(id, { isAdmin: !currentStatus });
            fetchData();
        } catch (err) {
            alert("Update failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleToggleCoordinator = async (id, currentStatus) => {
        try {
            await userService.update(id, { isCoordinator: !currentStatus });
            fetchData();
        } catch (err) {
            alert("Update failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleTogglePayment = async (groupId, currentStatus) => {
        try {
            await groupService.update(groupId, { IsPaymentDone: !currentStatus });
            fetchData();
        } catch (err) {
            alert("Payment update failed: " + (err.response?.data?.message || err.message));
        }
    };

    const tabs = [
        { id: 'institutes', label: 'Institutes', icon: <Building2 size={18} /> },
        { id: 'departments', label: 'Departments', icon: <Layers size={18} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
        { id: 'participants', label: 'Participants', icon: <UsersIcon size={18} /> },
        { id: 'users', label: 'Users', icon: <UserCog size={18} /> },
    ];
    
    const visibleTabs = user?.isAdmin ? tabs : tabs.filter(t => ['departments', 'events', 'participants'].includes(t.id));

    const currentList = data[activeTab].filter(item => {

        const query = searchTerm.toLowerCase();
        return (
            (item.InstituteName && item.InstituteName.toLowerCase().includes(query)) ||
            (item.InstituteID?.InstituteName && item.InstituteID.InstituteName.toLowerCase().includes(query)) ||
            (item.DepartmentName && item.DepartmentName.toLowerCase().includes(query)) ||
            (item.DepartmentID?.DepartmentName && item.DepartmentID.DepartmentName.toLowerCase().includes(query)) ||
            (item.EventName && item.EventName.toLowerCase().includes(query)) ||
            (item.ParticipantName && item.ParticipantName.toLowerCase().includes(query)) ||
            (item.ParticipantEmail && item.ParticipantEmail.toLowerCase().includes(query)) ||
            (item.ParticipantEnrollmentNumber && item.ParticipantEnrollmentNumber.toLowerCase().includes(query)) ||
            (item.GroupID?.EventID?.EventName && item.GroupID.EventID.EventName.toLowerCase().includes(query)) ||
            (item.GroupID?.EventID?.DepartmentID?.DepartmentName && item.GroupID.EventID.DepartmentID.DepartmentName.toLowerCase().includes(query)) ||
            (item.UserName && item.UserName.toLowerCase().includes(query)) ||
            (item.EmailAddress && item.EmailAddress.toLowerCase().includes(query))
        );
    });

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage and monitor all institutes, departments, and events.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        {user?.isAdmin && (
                            <>
                                <Link to="/admin/add-institute" className="flex-1 md:flex-none btn-outline flex items-center justify-center gap-2 py-3 px-6 border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400 group transition-all">
                                    <Plus size={18} className="text-blue-500 group-hover:scale-110 transition-transform" /> Institute
                                </Link>
                                <Link to="/admin/add-department" className="flex-1 md:flex-none btn-outline flex items-center justify-center gap-2 py-3 px-6 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-purple-400 group transition-all">
                                    <Plus size={18} className="text-purple-500 group-hover:scale-110 transition-transform" /> Dept
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-8 max-w-fit overflow-x-auto">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                        className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-3 relative overflow-hidden ${
                            activeTab === tab.id 
                            ? 'text-white shadow-[0_0_20px_rgba(233,30,99,0.3)]' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {activeTab === tab.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary animate-in fade-in duration-500"></div>
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {tab.icon} {tab.label}
                            <span className={`${activeTab === tab.id ? 'bg-black/30' : 'bg-white/10'} px-2 py-0.5 rounded-md text-[10px] ml-1`}>
                                {data[tab.id].length}
                            </span>
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="animate-spin text-primary w-12 h-12" />
                </div>
            ) : (
                <div className="glass-dark border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5 text-left">
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest pl-8">Name</th>
                                    {activeTab === 'participants' ? (
                                        <>
                                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Enrollment</th>
                                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Event</th>
                                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Department</th>
                                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Payment</th>
                                        </>
                                    ) : (
                                        <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {activeTab === 'events' ? 'Department' : 
                                            activeTab === 'departments' ? 'Institute' : 
                                            activeTab === 'users' ? 'Email & Role' : 'Description'}
                                        </th>
                                    )}
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {currentList.length > 0 ? currentList.map((item) => (
                                    <tr key={item._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                                    {(item.InstituteName || item.DepartmentName || item.EventName || item.ParticipantName || item.UserName)[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold line-clamp-1">
                                                        {item.InstituteName || item.DepartmentName || item.EventName || item.ParticipantName || item.UserName}
                                                    </span>
                                                    {activeTab === 'participants' && (
                                                        <span className="text-[10px] text-gray-500 font-medium">{item.ParticipantEmail}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {activeTab === 'participants' ? (
                                            <>
                                                <td className="px-6 py-5 text-sm text-center">
                                                    <span className="bg-secondary/10 border border-secondary/30 px-3 py-1.5 rounded-lg text-secondary-light font-mono text-xs shadow-[0_0_10px_rgba(101,31,255,0.1)]">
                                                        {item.ParticipantEnrollmentNumber}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-400">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium group-hover:text-primary-light transition-colors">{item.GroupID?.EventID?.EventName || 'N/A'}</span>
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{item.GroupID?.GroupName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm">
                                                    <span className="text-gray-400 group-hover:text-gray-200 transition-colors uppercase text-[10px] font-bold tracking-widest">{item.GroupID?.EventID?.DepartmentID?.DepartmentName || 'N/A'}</span>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-center">
                                                    <button
                                                        onClick={() => handleTogglePayment(item.GroupID?._id, item.GroupID?.IsPaymentDone)}
                                                        className="transition-transform active:scale-95 group/status"
                                                        title="Click to toggle payment status"
                                                    >
                                                        {item.GroupID?.IsPaymentDone ? (
                                                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1.5 rounded-full font-black border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] uppercase tracking-widest cursor-pointer group-hover/status:bg-emerald-500/20 transition-colors">PAID</span>
                                                        ) : (
                                                            <span className="bg-rose-500/10 text-rose-400 text-[10px] px-3 py-1.5 rounded-full font-black border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)] uppercase tracking-widest cursor-pointer group-hover/status:bg-rose-500/20 transition-colors">UNPAID</span>
                                                        )}
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <td className="px-6 py-5 text-sm text-gray-400">
                                                {
                                                activeTab === 'events' ? (item.DepartmentID?.DepartmentName || 'N/A') :
                                                activeTab === 'departments' ? (item.InstituteID?.InstituteName || 'N/A') :
                                                activeTab === 'users' ? (
                                                    <div className="flex items-center gap-2">
                                                        {item.EmailAddress}
                                                        {item.isAdmin ? (
                                                            <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded-md font-bold">ADMIN</span>
                                                        ) : item.isCoordinator ? (
                                                            <span className="bg-purple-500/10 text-purple-500 text-[10px] px-2 py-0.5 rounded-md font-bold">COORDINATOR</span>
                                                        ) : (
                                                            <span className="bg-gray-500/10 text-gray-400 text-[10px] px-2 py-0.5 rounded-md font-bold">USER</span>
                                                        )}
                                                    </div>
                                                ) :
                                                (item.InstituteDescription || 'University Campus')}
                                            </td>
                                        )}
                                        <td className="px-8 py-5 text-right whitespace-nowrap">
                                            {activeTab === 'users' && (
                                                <>
                                                    <button
                                                        onClick={() => handleToggleCoordinator(item._id, item.isCoordinator)}
                                                        className={`p-3 mr-2 text-gray-500 hover:text-white rounded-xl transition-all ${item.isCoordinator ? 'hover:bg-orange-500' : 'hover:bg-purple-500'}`}
                                                        title={item.isCoordinator ? "Remove Coordinator Role" : "Make Coordinator"}
                                                    >
                                                        {item.isCoordinator ? <StarOff size={18} /> : <Star size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleAdmin(item._id, item.isAdmin)}
                                                        className={`p-3 mr-2 text-gray-500 hover:text-white rounded-xl transition-all ${item.isAdmin ? 'hover:bg-orange-500' : 'hover:bg-green-500'}`}
                                                        title={item.isAdmin ? "Remove Admin Role" : "Make Admin"}
                                                    >
                                                        {item.isAdmin ? <ShieldOff size={18} /> : <Shield size={18} />}
                                                    </button>
                                                </>
                                            )}
                                            {(user?.isAdmin || user?.isCoordinator) && activeTab === 'events' && (
                                                <button
                                                    onClick={() => handleWinnerClick(item)}
                                                    className="p-3 mr-2 text-gray-500 hover:text-white hover:bg-yellow-500/20 hover:text-yellow-400 rounded-xl transition-all"
                                                    title="Declare Event Winners"
                                                >
                                                    <Trophy size={18} />
                                                </button>
                                            )}
                                            {(user?.isAdmin || (activeTab === 'events' || activeTab === 'departments' || activeTab === 'participants')) && (
                                                <button
                                                    onClick={() => handleDelete(
                                                        activeTab === 'events' ? 'event' : 
                                                        activeTab === 'departments' ? 'department' : 
                                                        activeTab === 'participants' ? 'participant' : 
                                                        activeTab === 'users' ? 'user' : 'institute',
                                                        item._id,
                                                        item.InstituteName || item.DepartmentName || item.EventName || item.ParticipantName || item.UserName
                                                    )}
                                                    className="p-3 text-gray-500 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={activeTab === 'participants' ? 6 : 3} className="px-8 py-20 text-center text-gray-500 italic">
                                            No {activeTab} found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={isWinnerModalOpen} onClose={() => setIsWinnerModalOpen(false)} title={`Declare Winners - ${selectedWinnerEvent?.EventName}`}>
                {winnerLoading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-gray-400 text-sm">Select the participating teams and announce the official event winners.</p>
                        
                        {[1, 2, 3].map((seq) => {
                            const existingWinner = eventWinners.find(w => w.sequence === seq);
                            const positionNames = { 1: '1st Place Winner', 2: '2nd Place Runner Up', 3: '3rd Place Runner Up' };
                            const positionColors = { 1: 'text-yellow-400', 2: 'text-gray-300', 3: 'text-orange-400' };

                            return (
                                <div key={seq} className="p-5 glass-dark border border-white/5 rounded-2xl flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <Trophy size={18} className={positionColors[seq]} />
                                        <h4 className={`text-sm font-bold uppercase tracking-wider ${positionColors[seq]}`}>{positionNames[seq]}</h4>
                                    </div>

                                    {existingWinner ? (
                                        <div className="bg-white/5 py-3 px-4 rounded-xl flex items-center justify-between border border-white/10">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Declared Winner</p>
                                                <p className="text-white font-bold">{existingWinner.GroupID?.GroupName}</p>
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">Official</div>
                                                <button 
                                                    onClick={() => handleRemoveWinner(seq)}
                                                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={winnerFormData[seq]}
                                                onChange={(e) => setWinnerFormData({ ...winnerFormData, [seq]: e.target.value })}
                                                className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-gray-900 text-gray-500">Choose a Participating Group / Individual...</option>
                                                {eventGroups.map(group => {
                                                    const groupParticipants = data.participants.filter(p => (p.GroupID?._id || p.GroupID) === group._id);
                                                    const leader = groupParticipants.find(p => p.IsGroupLeader) || groupParticipants[0];
                                                    const leaderInfo = leader ? ` (Leader: ${leader.ParticipantName} - ${leader.ParticipantEnrollmentNumber})` : '';
                                                    
                                                    return (
                                                        <option key={group._id} value={group._id} className="bg-gray-900 text-white">
                                                            Team: {group.GroupName}{leaderInfo}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            <button
                                                onClick={() => handleDeclareWinner(seq)}
                                                className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors py-3 px-6 rounded-xl font-bold text-sm"
                                            >
                                                Declare
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageData;
