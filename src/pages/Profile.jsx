import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Edit2, Save, X,
    ShieldCheck, Camera, Calendar, LogOut,
    ChevronRight, BadgeCheck, Loader2
} from 'lucide-react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const { role, logout } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        mobile: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const result = await userService.getProfile();
        if (result.success) {
            setProfile(result.data);
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const result = await userService.updateProfile({
            name: profile.name,
            mobile: profile.mobile
        });
        setSaving(false);

        if (result.success) {
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setProfile(result.data);
        } else {
            toast.error(result.error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-[100px] flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Hydrating Profile...</p>
            </div>
        );
    }

    const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen bg-slate-50 pt-[100px] pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                    {/* Left Column: Summary Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card rounded-[2.5rem] p-8 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <User className="w-40 h-40 text-emerald-600" />
                            </div>

                            <div className="relative mb-8">
                                <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <span className="text-4xl font-black text-white">{initials}</span>
                                </div>
                                <div className="absolute bottom-0 right-[35%] bg-white p-2 rounded-xl shadow-lg border border-slate-50 text-emerald-600 cursor-pointer hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{profile.name}</h2>
                            <p className="text-slate-400 font-medium text-sm mb-6">{profile.email}</p>

                            <div className="flex items-center justify-center gap-2 mb-8">
                                <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${role === 'ADMIN' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    }`}>
                                    {role === 'ADMIN' && <ShieldCheck className="h-3 w-3" />}
                                    {role} ACCOUNT
                                </span>
                                {role === 'ADMIN' && (
                                    <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest border border-slate-800">
                                        MASTER
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={logout}
                                className="w-full py-4 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-slate-100 hover:border-rose-100"
                            >
                                <LogOut className="h-4 w-4" /> Sign Out from Harvest
                            </button>
                        </div>

                        {/* Quick Stats/Info */}
                        <div className="glass-card rounded-[2.5rem] p-8 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined On</p>
                                        <p className="text-sm font-bold text-slate-700">Jan 2024</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                        <BadgeCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Level</p>
                                        <p className="text-sm font-bold text-slate-700">Premium Member</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Form Content */}
                    <div className="lg:col-span-8">
                        <div className="glass-card rounded-[3rem] overflow-hidden border border-white">
                            <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity Details</h3>
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Manage your public information</p>
                                </div>
                                {!isEditing && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit Profile
                                    </motion.button>
                                )}
                            </div>

                            <div className="p-10">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Name Input */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Legal Name</label>
                                            <div className="relative group">
                                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profile.name}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    required
                                                    className={`w-full pl-11 pr-4 py-4 rounded-2xl font-bold transition-all ${isEditing
                                                            ? 'bg-white ring-2 ring-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/5'
                                                            : 'bg-slate-50 border-transparent text-slate-500'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Email Input (Read Only) */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center ml-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Auth Email</label>
                                                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Permanent</span>
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border-transparent text-slate-400 font-bold rounded-2xl cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        {/* Mobile Input */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Mobile Identity</label>
                                            <div className="relative group">
                                                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isEditing ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    placeholder="No mobile linked"
                                                    value={profile.mobile || ''}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`w-full pl-11 pr-4 py-4 rounded-2xl font-bold transition-all ${isEditing
                                                            ? 'bg-white ring-2 ring-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/5'
                                                            : 'bg-slate-50 border-transparent text-slate-500'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Placeholder for future field */}
                                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-dashed border-slate-200 flex items-center justify-center">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">More security fields coming soon</p>
                                        </div>
                                    </div>

                                    {/* Edit Actions */}
                                    <AnimatePresence>
                                        {isEditing && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="pt-10 border-t border-slate-50 flex flex-col sm:flex-row gap-4"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        fetchProfile();
                                                    }}
                                                    className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                                >
                                                    <X className="w-4 h-4" /> Terminate Edit
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {saving ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" /> Commit Changes
                                                        </>
                                                    )}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </div>

                            {/* Security Banner */}
                            <div className="bg-slate-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-sm tracking-tight leading-none mb-1">Your data is secured</h4>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption Enabled</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-1 bg-slate-800 rounded-full" />
                                    ))}
                                    <div className="w-8 h-1 bg-emerald-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
