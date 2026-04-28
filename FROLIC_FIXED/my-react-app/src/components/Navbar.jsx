import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/#events' },
        { name: 'Rules', path: '/#rules' },
        { name: 'FAQs', path: '/#faqs' },
        { name: 'Facilities', path: '/#facilities' },
        { name: 'Contact Us', path: '/#contact' },
    ];

    const adminLinks = [
        { name: 'Admin Dashboard', path: '/admin/dashboard' },
        { name: 'Participants', path: '/admin/participants' },
        { name: 'Departments', path: '/admin/manage?tab=departments' },
        { name: 'Events', path: '/admin/manage?tab=events' },
        { name: 'Institute', path: '/admin/manage?tab=institutes' },
        { name: 'ManageAll', path: '/admin/manage' },
    ];

    const isAdminPath = location.pathname.startsWith('/admin');
    const hasAdminAccess = user?.isAdmin || user?.isCoordinator;
    const currentLinks = (hasAdminAccess && isAdminPath) ? adminLinks : navLinks;

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' && !location.hash;
        if (path.startsWith('/#')) return location.hash === path.substring(1);
        if (path.includes('?')) return (location.pathname + location.search).includes(path);
        if (path === '/admin/manage') return location.pathname === path && !location.search;
        return location.pathname === path;
    };

    const handleNavLinkClick = (e, path) => {
        if (path === '/' || path.startsWith('/#')) {
            const id = path === '/' ? 'home' : path.substring(2);
            if (location.pathname === '/') {
                e.preventDefault();
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (path.startsWith('/#')) {
                setTimeout(() => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
            setIsOpen(false);
        }
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-dark/90 border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent py-6'}`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center h-full">
                <Link to={hasAdminAccess ? "/admin/dashboard" : "/"} className="flex items-center gap-2 group">
                    <motion.div 
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                    >
                       <img src='https://frolic.aswdc.in/images/logo/frolic_logo.png' className="w-full h-full object-contain p-1.5"/>
                    </motion.div>
                    <span className="text-2xl font-display font-bold text-white tracking-tight">
                        Frolic<span className="text-primary">.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {currentLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={(e) => handleNavLinkClick(e, link.path)}
                            className={`text-sm font-medium transition-all relative py-1 ${
                                isActive(link.path) ? 'text-primary' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <motion.div 
                                    layoutId="navIndicator"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(233,30,99,0.5)]"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}

                    {/* Admin Dropdown */}
                    {hasAdminAccess && !isAdminPath && (
                        <div className="relative group">
                            <button
                                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-primary transition-colors"
                                onMouseEnter={() => setIsAdminOpen(true)}
                            >
                                Admin <ChevronDown size={14} className={`transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isAdminOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        onMouseLeave={() => setIsAdminOpen(false)}
                                        className="absolute top-full right-0 mt-2 w-48 glass-dark rounded-2xl border border-white/10 p-2 origin-top-right shadow-2xl"
                                    >
                                        {adminLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                                onClick={() => setIsAdminOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-6">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to={hasAdminAccess ? "/admin/dashboard" : "/profile"} className="flex items-center gap-2 group px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <User size={16} className="text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-white">{user.UserName}</span>
                                </Link>
                            </motion.div>
                            <motion.button 
                                whileHover={{ scale: 1.1, color: '#e91e63' }}
                                onClick={handleLogout}
                                className="text-gray-400 transition-colors flex items-center gap-1 text-sm font-bold"
                            >
                                <LogOut size={16} /> Logout
                            </motion.button>
                        </div>
                    ) : (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link to="/login" className="btn-primary scale-90">
                                Login
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <motion.button 
                    whileTap={{ scale: 0.8 }}
                    className="md:hidden text-white p-2 glass rounded-xl" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="md:hidden absolute top-full left-0 right-0 glass-dark border-t border-white/5 shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {user && (
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl mb-2"
                                >
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <User className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{user.UserName}</p>
                                        <p className="text-gray-400 text-xs">{user.EmailAddress}</p>
                                    </div>
                                </motion.div>
                            )}

                            {currentLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={(e) => handleNavLinkClick(e, link.path)}
                                        className={`text-lg font-bold transition-colors ${isActive(link.path) ? 'text-primary' : 'text-gray-300'}`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {hasAdminAccess && !isAdminPath && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="border-t border-white/10 pt-4 mt-2"
                                >
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Administration</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        {adminLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className="text-gray-300 hover:text-primary transition-colors pl-2 font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {user ? (
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="btn-primary text-center mt-6 flex items-center justify-center gap-2 py-4"
                                >
                                    <LogOut size={20} /> Logout
                                </motion.button>
                            ) : (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Link
                                        to="/login"
                                        className="btn-primary text-center mt-6 block py-4"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
