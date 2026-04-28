import { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Users,
    Trophy,
    ArrowRight,
    Sparkles,
    Loader2,
    HelpCircle,
    ShieldCheck,
    Zap,
    Mail,
    Phone,
    Info,
    List,
    Link as LinkIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService, participantService, instituteService, departmentService } from '../../services/api';
import Modal from '../../components/Modal';
import EventRegistration from '../Events/EventRegistration';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isAdmin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const [events, setEvents] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDept, setActiveDept] = useState('all');
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [stats, setStats] = useState({
        location: 'Darshan University',
        date: '22-24 March 2025',
        eventsCount: '0 Events',
        participantsCount: '0 Students'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, participantsData, institutesData, departmentsData] = await Promise.allSettled([
                    eventService.getAll(),
                    participantService.getAll(),
                    instituteService.getAll(),
                    departmentService.getAll()
                ]);

                const newStats = { ...stats };

                if (eventsData.status === 'fulfilled') {
                    setEvents(eventsData.value);
                    newStats.eventsCount = `${eventsData.value.length} Events`;
                }

                if (departmentsData.status === 'fulfilled') {
                    setDepartments(departmentsData.value);
                }

                if (participantsData.status === 'fulfilled') {
                    newStats.participantsCount = `${participantsData.value.length} Students`;
                }

                setStats(newStats);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEvents = activeDept === 'all'
        ? events
        : events.filter(e => e.DepartmentID?._id === activeDept || e.DepartmentID === activeDept);

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setIsRegModalOpen(true);
    };

    return (
        <div className="space-y-24 pb-20 overflow-x-hidden -mt-24 md:-mt-32">
            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/30 rounded-full blur-[120px]"
                    ></motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[120px]"
                    ></motion.div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-dark border border-white/10 mb-10 shadow-[0_0_15px_rgba(233,30,99,0.2)]">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">Registration Live • Frolic 2025</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-display font-extrabold text-white mb-8 tracking-tighter leading-[1.05]">
                            {user ? (
                                <>Welcome back, <br /><span className="text-gradient uppercase">{user.UserName}!</span></>
                            ) : (
                                <>CHALLENGE YOUR <br /><span className="text-gradient uppercase">POTENTIAL.</span></>
                            )}
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-sans font-light">
                            Join the ultimate technical and cultural symposium. Unleash your innovation, compete with the best, and redefine excellence in the heart of Frolic.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('events').scrollIntoView({ behavior: 'smooth' })} 
                                className="btn-primary py-5 px-12 text-lg flex items-center gap-3 group shadow-[0_10px_30px_rgba(233,30,99,0.4)]"
                            >
                                <Sparkles size={20} /> Explore Events <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                            </motion.button>
                            {!user && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/login" className="btn-outline py-5 px-12 text-lg">
                                        Join the Community
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40"
                >
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-transparent"></div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="container mx-auto px-6"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <MapPin className="text-primary" />, label: "Location", val: stats.location },
                        { icon: <Calendar className="text-primary" />, label: "Date", val: stats.date },
                        { icon: <Trophy className="text-primary" />, label: "Events", val: stats.eventsCount },
                        { icon: <Users className="text-primary" />, label: "Participants", val: stats.participantsCount }
                    ].map((stat, i) => (
                        <motion.div 
                            key={i} 
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="glass p-8 rounded-3xl text-center border border-white/5 hover:border-primary/30 transition-colors"
                        >
                            <div className="flex justify-center mb-4">{stat.icon}</div>
                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-xl font-bold text-white font-display">{stat.val}</h4>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Departments Filter & Events List */}
            <section id="events" className="container mx-auto px-6 scroll-mt-32">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-display font-bold text-white mb-6">Our Events</h2>

                    {/* Department Navigation (As per Photo) */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setActiveDept('all')}
                            className={`text-sm md:text-base font-bold uppercase tracking-wider transition-all relative ${activeDept === 'all' ? 'text-primary' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Show All
                            {activeDept === 'all' && (
                                <motion.div 
                                    layoutId="activeDept"
                                    className="absolute -bottom-6 left-0 right-0 h-1 bg-primary rounded-full"
                                ></motion.div>
                            )}
                        </motion.button>
                        {departments.map((dept) => (
                            <motion.button
                                key={dept._id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveDept(dept._id)}
                                className={`text-sm md:text-base font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeDept === dept._id ? 'text-primary' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {dept.DepartmentName}
                                {activeDept === dept._id && (
                                    <motion.div 
                                        layoutId="activeDept"
                                        className="absolute -bottom-6 left-0 right-0 h-1 bg-primary rounded-full"
                                    ></motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    layout
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[500px] glass rounded-3xl animate-pulse"></div>
                        ))
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <motion.div 
                                layout
                                key={event._id} 
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.4 } }}
                                className="group flex flex-col glass-dark border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(233,30,99,0.15)] h-full"
                            >
                                {/* Event Card Image Container */}
                                <div className="relative aspect-[4/5] overflow-hidden m-4 rounded-[1.5rem]">
                                    <img
                                        src={event.EventImage || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60`}
                                        alt={event.EventName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Event Type Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className="px-4 py-1.5 bg-primary rounded-full text-[10px] font-bold text-white shadow-xl flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                            {event.EventType || 'Technical'}
                                        </div>
                                    </div>
                                </div>

                                {/* Event Card Content */}
                                <div className="px-8 pb-8 pt-2 flex flex-col flex-grow text-left">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{event.EventName}</h3>

                                    <p className="text-gray-400 text-sm mb-4">Boys, Girls</p>
                                    <p className="text-gray-400 text-sm font-medium mb-6">{event.EventType || 'Technical'}</p>

                                    {/* Action Icons */}
                                    <div className="mt-auto flex items-center justify-between text-gray-500">
                                        <motion.button whileHover={{ scale: 1.2, color: '#e91e63' }} className="transition-colors">
                                            <List size={22} strokeWidth={1.5} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.2, color: '#e91e63' }}
                                            onClick={() => handleRegisterClick(event)}
                                            className="transition-colors"
                                        >
                                            <LinkIcon size={22} strokeWidth={1.5} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div variants={itemVariants} className="col-span-full py-20 text-center glass rounded-[2.5rem]">
                            <p className="text-gray-400 text-lg">No events found for this category.</p>
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* Rules Section */}
            <section id="rules" className="container mx-auto px-6 scroll-mt-32">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-display font-bold text-white mb-4">Event Rules & Guidelines</h2>
                        <p className="text-gray-400">Please read carefully to ensure a fair and exciting competition for everyone.</p>
                    </motion.div>
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {[
                            { title: "Registration", desc: "All participants must register through the official portal before the deadline." },
                            { title: "ID Cards", desc: "Students must carry their college ID cards at all times during the event." },
                            { title: "Conduct", desc: "Professional behavior is expected. Any form of malpractice will lead to disqualification." },
                            { title: "Team Size", desc: "Adhere to the specific team size mentioned for each event." },
                            { title: "Deadlines", desc: "Reporting time for events is 30 minutes prior to the scheduled start." },
                            { title: "Decision", desc: "The judge's decision will be final and binding for all participants." }
                        ].map((rule, i) => (
                            <motion.div 
                                key={i} 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="glass p-8 rounded-3xl border border-white/5 flex gap-5"
                            >
                                <div className="p-3 bg-primary/10 rounded-2xl h-fit">
                                    <ShieldCheck className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">{rule.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{rule.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQs Section */}
            <section id="faqs" className="container mx-auto px-6 scroll-mt-32">
                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-display font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-400">Everything you need to know about Frolic 2025.</p>
                    </motion.div>
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        {[
                            { q: "Who can participate in Frolic?", a: "Frolic is open to all university and college students across the country." },
                            { q: "How many events can I register for?", a: "You can register for as many events as long as their timings don't overlap." },
                            { q: "Is there a registration fee?", a: "Yes, each event has a specific registration fee mentioned in its details." },
                            { q: "Will I get a certificate?", a: "All participants will receive a certificate of participation. Winners get special merit certificates." },
                            { q: "How do I reach Darshan University?", a: "Bus facilities will be provided from major city points. Check the facilities section for details." }
                        ].map((faq, i) => (
                            <motion.details 
                                key={i} 
                                variants={itemVariants}
                                className="glass-dark border border-white/10 rounded-2xl group overflow-hidden"
                            >
                                <summary className="p-6 cursor-pointer flex justify-between items-center text-white font-bold select-none list-none">
                                    {faq.q}
                                    <HelpCircle className="text-gray-500 group-open:text-primary transition-colors" size={20} />
                                </summary>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="p-6 pt-0 text-gray-400 text-sm border-t border-white/5"
                                >
                                    {faq.a}
                                </motion.div>
                            </motion.details>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Facilities Section */}
            <section id="facilities" className="container mx-auto px-6 scroll-mt-32">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-display font-bold text-white mb-4">Campus Facilities</h2>
                    <p className="text-gray-400">We ensure a comfortable and productive environment for all participants.</p>
                </motion.div>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {[
                        { icon: <Zap className="text-yellow-400" />, title: "High-Speed Wi-Fi", desc: "Dedicated high-speed internet access across all event venues for participants." },
                        { icon: <Users className="text-green-400" />, title: "Food Courts", desc: "Multiple food stalls and a main cafeteria serving a variety of cuisines." },
                        { icon: <ShieldCheck className="text-blue-400" />, title: "Medical Support", desc: "24/7 medical assistance and on-campus clinic available for emergencies." },
                        { icon: <MapPin className="text-red-400" />, title: "Transport", desc: "Shuttle bus services from the city center to the campus and back." },
                        { icon: <Info className="text-purple-400" />, title: "Help Desk", desc: "Information centers at every major building to guide you through the event." },
                        { icon: <Trophy className="text-primary" />, title: "Rest Zones", desc: "Comfortable lounges and rest areas to recharge between your events." }
                    ].map((facility, i) => (
                        <motion.div 
                            key={i} 
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="glass-dark p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all text-center group"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                {facility.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{facility.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{facility.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="container mx-auto px-6 scroll-mt-32">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-dark rounded-[3rem] p-12 border border-white/10 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <motion.h2 variants={itemVariants} className="text-4xl font-display font-bold text-white mb-6">Get in Touch</motion.h2>
                            <motion.p variants={itemVariants} className="text-gray-400 mb-12">Have any questions? Our team is here to help you. Reach out through any of these channels.</motion.p>

                            <div className="space-y-8">
                                {[
                                    { icon: <Mail size={24} />, label: "Email Us", val: "frolic@darshan.ac.in" },
                                    { icon: <Phone size={24} />, label: "Call Us", val: "+91 98765 43210" },
                                    { icon: <MapPin size={24} />, label: "Location", val: "Darshan University, Rajkot-Morbi Highway, Rajkot." }
                                ].map((c, i) => (
                                    <motion.div key={i} variants={itemVariants} className="flex items-center gap-6">
                                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary">
                                            {c.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">{c.label}</p>
                                            <p className="text-white font-semibold">{c.val}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass p-8 rounded-[2rem] border border-white/10"
                        >
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Full Name</label>
                                        <input type="text" placeholder="Enter Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email</label>
                                        <input type="email" placeholder="Enter Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Subject</label>
                                    <input type="text" placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-2">Message</label>
                                    <textarea rows="4" placeholder="Your message here..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary w-full py-5 font-bold shadow-lg shadow-primary/20"
                                >
                                    Send Message
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Registration Modal */}
            <Modal
                isOpen={isRegModalOpen}
                onClose={() => setIsRegModalOpen(false)}
                title="Event Registration"
            >
                {selectedEvent && (
                    <EventRegistration
                        event={selectedEvent}
                        onSuccess={() => setIsRegModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
