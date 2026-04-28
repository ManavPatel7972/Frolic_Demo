import React from 'react';
import { Mail, Phone, MapPin, Rocket, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark-lighter border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Rocket className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-display font-bold text-white tracking-tight">
                                Frolic<span className="text-primary">.</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Connect, compete, and celebrate at Frolic. The ultimate technical and cultural fest experience for students.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-9 h-9 glass flex items-center justify-center rounded-full hover:bg-primary transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 glass flex items-center justify-center rounded-full hover:bg-primary transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 glass flex items-center justify-center rounded-full hover:bg-primary transition-colors">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="/" className="text-gray-400 text-sm hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#events" className="text-gray-400 text-sm hover:text-primary transition-colors">All Events</a></li>
                            <li><a href="#rules" className="text-gray-400 text-sm hover:text-primary transition-colors">Rule Book</a></li>
                            <li><a href="#faqs" className="text-gray-400 text-sm hover:text-primary transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Guidelines */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 text-sm hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 text-sm hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 text-sm hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 text-sm hover:text-primary transition-colors">Registration</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary shrink-0" />
                                <span className="text-gray-400 text-sm">Darshan University, Rajkot - Morbi Highway, Gujarat - 363650</span>
                                
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span className="text-gray-400 text-sm">+91-9876543210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span className="text-gray-400 text-sm">frolic@darshan.ac.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Frolic Fest. All rights reserved. Designed with ❤️ for enthusiasts.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
