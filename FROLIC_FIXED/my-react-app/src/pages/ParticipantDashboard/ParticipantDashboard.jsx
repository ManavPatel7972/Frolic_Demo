import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { participantService, eventService } from '../../services/api';
import { Loader2, Ticket, Calendar, Award, User as UserIcon, Users, Mail, Phone, MapPin, Building, GraduationCap, ChevronRight, Activity, Zap, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ParticipantDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);
    const [myWinnings, setMyWinnings] = useState({});
    const [allParticipantsState, setAllParticipants] = useState([]);
    const [stats, setStats] = useState({ events: 0, technical: 0, nonTechnical: 0 });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchRegistrations = async () => {
            try {
                const allParticipants = await participantService.getAll();
                setAllParticipants(allParticipants);
                const myRegistrations = allParticipants.filter(p => p.ParticipantEmail === user.EmailAddress);
                
                const winningsMap = {};
                if (myRegistrations.length > 0) {
                    await Promise.all(myRegistrations.map(async (reg) => {
                        const eventId = reg.GroupID?.EventID?._id || reg.GroupID?.EventID;
                        if (eventId) {
                            try {
                                const winData = await eventService.getWinners(eventId);
                                const myWin = winData.winners.find(w => w.GroupID._id === reg.GroupID._id);
                                if (myWin) {
                                    winningsMap[reg._id] = myWin.sequence;
                                }
                            } catch (e) {}
                        }
                    }));
                }
                setMyWinnings(winningsMap);
                setRegistrations(myRegistrations);

                let techCount = 0;
                let nonTechCount = 0;
                myRegistrations.forEach(reg => {
                    const eventType = reg.GroupID?.EventID?.EventType;
                    if (eventType === 'Technical') techCount++;
                    else if (eventType) nonTechCount++;
                });

                setStats({
                    events: myRegistrations.length,
                    technical: techCount,
                    nonTechnical: nonTechCount
                });
            } catch (err) {
                console.error("Failed to fetch participant data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">My <span className="text-primary">Profile</span></h1>
                    <p className="text-gray-400">View your details, registered events, and activity.</p>
                </div>
                <Link to="/#events" className="btn-primary py-3 px-6 flex items-center gap-2 shrink-0 shadow-lg shadow-primary/20">
                    <Ticket size={18} /> Browse More Events
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Profile Card */}
                <div className="lg:col-span-1 glass-dark rounded-[2rem] p-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    
                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-white/10">
                            <span className="text-3xl font-bold text-white tracking-widest uppercase">{user?.UserName?.substring(0,2)}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user?.UserName}</h2>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-primary uppercase tracking-widest border border-white/5">Participant</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-400">
                            <Mail size={18} className="text-primary" />
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5">Email</p>
                                <p className="text-sm font-medium text-white">{user?.EmailAddress}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <Phone size={18} className="text-primary" />
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5">Phone</p>
                                <p className="text-sm font-medium text-white">{user?.PhoneNumber || "N/A"}</p>
                            </div>
                        </div>
                        
                        {registrations.length > 0 && (
                            <>
                                <div className="h-px bg-white/5 my-4"></div>
                                <div className="flex items-center gap-4 text-gray-400">
                                    <GraduationCap size={18} className="text-primary" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5">Institute</p>
                                        <p className="text-sm font-medium text-white">{registrations[0].ParticipantInstituteName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-400">
                                    <UserIcon size={18} className="text-primary" />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-0.5">Enrollment ID</p>
                                        <p className="text-sm font-medium text-white uppercase">{registrations[0].ParticipantEnrollmentNumber}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <Ticket size={24} />
                            </div>
                            <p className="text-3xl font-display font-bold text-white mb-1">{stats.events}</p>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Total Events</p>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <p className="text-3xl font-display font-bold text-white mb-1">{stats.technical}</p>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Technical</p>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                                <Award size={24} />
                            </div>
                            <p className="text-3xl font-display font-bold text-white mb-1">{stats.nonTechnical}</p>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Non-Tech</p>
                        </div>
                    </div>

                    {/* Registrations List */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="text-primary" size={24} />
                            <h3 className="text-2xl font-display font-bold text-white">My Events</h3>
                        </div>

                        {registrations.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {registrations.map(reg => {
                                    const event = reg.GroupID?.EventID;
                                    const isTech = event?.EventType === 'Technical';
                                    const teamMembers = allParticipantsState.filter(p => p.GroupID?._id === reg.GroupID?._id);
                                    
                                    return (
                                        <div key={reg._id} className="glass-dark p-5 rounded-2xl border border-white/5 flex flex-col gap-4 hover:border-white/20 transition-colors group">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                                                        <img 
                                                            src={event?.EventImage || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&fit=crop`} 
                                                            alt="Event" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${isTech ? 'bg-blue-600' : 'bg-primary'} text-white`}>
                                                                {event?.EventType || 'N/A'}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-bold tracking-widest">TEAM: {reg.GroupID?.GroupName}</span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{event?.EventName || 'Unknown Event'}</h4>
                                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                                            <span className="flex items-center gap-1.5"><MapPin size={12}/> {event?.DepartmentID?.DepartmentName || 'Campus'}</span>
                                                            <span className="flex items-center gap-1.5"><UserIcon size={12}/> {reg.IsGroupLeader ? 'Leader' : 'Member'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 sm:flex-col sm:items-end w-full sm:w-auto">
                                                    <div className="text-left sm:text-right flex-grow flex flex-col items-start sm:items-end gap-3 w-full">
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Status</p>
                                                            <p className="text-emerald-400 font-bold text-xs bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 inline-block min-w-[100px] text-center">Registered</p>
                                                        </div>
                                                        
                                                        {myWinnings[reg._id] && (
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Result</p>
                                                                <p className={`font-black text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 justify-center min-w-[100px] shadow-lg ${
                                                                    myWinnings[reg._id] === 1 ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10 shadow-yellow-400/10' :
                                                                    myWinnings[reg._id] === 2 ? 'text-gray-300 border-gray-400/50 bg-gray-400/10 shadow-gray-400/10' :
                                                                    'text-orange-400 border-orange-400/50 bg-orange-400/10 shadow-orange-400/10'
                                                                }`}>
                                                                    <Trophy size={14} /> 
                                                                    {myWinnings[reg._id] === 1 ? '1st Place' : myWinnings[reg._id] === 2 ? '2nd Place' : '3rd Place'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button onClick={() => navigate('/#events')} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors hidden sm:block">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            {teamMembers.length > 1 && (
                                                <div className="mt-2 pt-4 border-t border-white/5">
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                                                        <Users size={12} /> Team Members ({teamMembers.length})
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                        {teamMembers.map(member => (
                                                            <div key={member._id} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                                    {member.ParticipantName.substring(0,2).toUpperCase()}
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <p className="text-sm text-white font-bold truncate flex items-center gap-1">
                                                                        {member.ParticipantName} 
                                                                        {member.IsGroupLeader && <Award size={10} className="text-primary"/>}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-400 truncate">{member.ParticipantEnrollmentNumber}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="glass p-12 rounded-[2rem] text-center border overflow-hidden border-white/5 border-dashed relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-50"></div>
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                                    <Ticket className="text-gray-500 w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">No Events Registered</h3>
                                <p className="text-gray-400 mb-8 max-w-sm mx-auto relative z-10">You haven't registered for any events yet. Explore our exciting lineup and join the competition!</p>
                                <Link to="/#events" className="btn-outline inline-flex relative z-10 font-bold bg-dark">Explore Events</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantDashboard;
