import { useState } from 'react';
import { Mail, Lock, Github, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        UserName: '',
        EmailAddress: '',
        PhoneNumber: '',
        UserPassword: '',
        ConfirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!isLogin && formData.UserPassword !== formData.ConfirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            let userData;
            if (isLogin) {
                userData = await login({
                    EmailAddress: formData.EmailAddress,
                    UserPassword: formData.UserPassword
                });
            } else {
                userData = await register({
                    UserName: formData.UserName,
                    EmailAddress: formData.EmailAddress,
                    PhoneNumber: formData.PhoneNumber,
                    UserPassword: formData.UserPassword,
                    isAdmin: false
                });
            }

            if (userData?.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isLogin ? 'sign in' : 'sign up'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-dark to-dark pt-24 pb-20">
            <div className="w-full max-w-md">
                <div className="glass-dark p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="text-center mb-10 relative z-10">
                        <h1 className="text-4xl font-display font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <p className="text-gray-400">{isLogin ? 'Sign in to continue to Frolic.' : 'Join the biggest technical festival.'}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm relative z-10">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.UserName}
                                        onChange={(e) => setFormData({ ...formData, UserName: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={formData.EmailAddress}
                                    onChange={(e) => setFormData({ ...formData, EmailAddress: e.target.value })}
                                    placeholder="name@university.edu"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.PhoneNumber}
                                        onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                                        placeholder="1234567890"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={formData.UserPassword}
                                    onChange={(e) => setFormData({ ...formData, UserPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.ConfirmPassword}
                                        onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                                    />
                                </div>
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                    <input type="checkbox" className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50" />
                                    Remember me
                                </label>
                                <Link to="#" className="text-primary hover:text-primary-light transition-colors">Forgot password?</Link>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="relative my-10 flex items-center z-10">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Or continue with</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition-colors">
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition-colors">
                            <Github size={18} />
                            GitHub
                        </button>
                    </div>

                    <p className="mt-8 text-center text-gray-400 text-sm relative z-10">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                            className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                            {isLogin ? 'Sign up for free' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
