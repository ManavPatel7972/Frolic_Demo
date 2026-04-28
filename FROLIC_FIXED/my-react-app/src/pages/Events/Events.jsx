import { useState, useEffect } from 'react';
import { eventService } from '../../services/api';
import { Search, Filter, Info, Plus, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import AddEvent from '../Admin/AddEvent';
import EventRegistration from './EventRegistration';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 8;

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await eventService.getAll();
            setEvents(data);
        } catch (err) {
            setError('Failed to load events');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await eventService.delete(id);
                fetchEvents();
            } catch (err) {
                alert("Failed to delete event: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const categories = ['All', 'Technical', 'Non-Technical'];

    const filteredEvents = events.filter(e => {
        const matchesFilter = filter === 'All' || e.EventType === filter;
        const matchesSearch = e.EventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (e.EventDescription && e.EventDescription.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Upcoming Events</h1>
                    <p className="text-gray-400">Discover and register for technical and non-technical competitions.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {(user?.isAdmin || user?.isCoordinator) && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary py-3 px-6 flex items-center gap-2 shrink-0"
                        >
                            <Plus size={20} /> Create Event
                        </button>
                    )}

                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-12 overflow-x-auto scrollbar-none max-w-fit">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setFilter(cat); setCurrentPage(1); }}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {currentEvents.length > 0 ? currentEvents.map((event) => (
                    <div key={event._id} className="group glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden card-hover flex flex-col">
                        <div className="relative h-60 overflow-hidden">
                            <img
                                src={event.EventImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60'}
                                alt={event.EventName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                                    <div className="absolute top-5 left-5 flex gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] ${event.EventType === 'Technical' ? 'bg-blue-600' : 'bg-primary'
                                            } text-white shadow-lg`}>
                                            {event.EventType || 'Technical'}
                                        </span>
                                        {(user?.isAdmin || user?.isCoordinator) && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event._id, event.EventName); }}
                                                className="w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                                                title="Delete Event"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                        </div>

                        <div className="p-8 flex-grow flex flex-col">
                            <div className="text-[10px] font-extrabold text-primary mb-3 tracking-[0.2em] uppercase line-clamp-1">{event.DepartmentID?.DepartmentName || 'Technical'}</div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors line-clamp-1 h-8">{event.EventName}</h3>
                            <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed h-10">{event.EventDescription || "Join this exciting competition and showcase your skills."}</p>

                            <div className="mt-auto pt-6 border-t border-white/5 space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs font-medium uppercase tracking-widest">Entry Fee</span>
                                    <span className="text-white font-bold text-2xl">₹{event.EventFees || '0'}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="btn-outline px-2 py-3.5 text-xs flex items-center justify-center gap-2 font-bold transition-all">
                                        <Info size={16} /> Details
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedEvent(event); setIsRegModalOpen(true); }}
                                        className="btn-primary px-2 py-3.5 text-xs font-bold shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center glass rounded-[2.5rem]">
                        <div className="bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Filter className="text-gray-600 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
                        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Add Event Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Launch New Event"
            >
                <AddEvent isModal={true} onSuccess={() => {
                    setIsModalOpen(false);
                    // Refresh events
                    eventService.getAll().then(setEvents);
                }} />
            </Modal>

            {/* Event Registration Modal */}
            <Modal
                isOpen={isRegModalOpen}
                onClose={() => setIsRegModalOpen(false)}
                title="Register for Event"
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

export default Events;
