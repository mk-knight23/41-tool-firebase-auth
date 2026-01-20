import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, Github, LogIn, UserPlus, Fingerprint, ArrowRight, X, ChevronRight, LayoutDashboard, Settings, LogOut, User } from 'lucide-react';

function App() {
    const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would use the firebase context
        console.log('Auth attempt:', { email, password });
        setView('dashboard');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <AnimatePresence mode="wait">
                {view === 'dashboard' ? (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-6xl flex gap-6 h-[800px]"
                    >
                        {/* Sidebar */}
                        <div className="w-80 glass-card rounded-[3rem] p-8 flex flex-col">
                            <div className="flex items-center gap-3 mb-12">
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span className="text-xl font-black tracking-tight">PROTECT<span className="text-blue-500">MK</span></span>
                            </div>

                            <div className="flex-1 space-y-2">
                                <SidebarItem icon={<LayoutDashboard />} label="Overview" active />
                                <SidebarItem icon={<User />} label="Profile" />
                                <SidebarItem icon={<Settings />} label="Security" />
                            </div>

                            <button
                                onClick={() => setView('login')}
                                className="mt-auto flex items-center gap-3 p-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-6 flex flex-col">
                            <div className="glass-card rounded-[3rem] p-12 flex-1">
                                <h2 className="text-4xl font-black mb-2">Welcome back, <span className="text-blue-500">User</span>!</h2>
                                <p className="text-slate-400 mb-12">Security audit: No anomalies detected in your last session.</p>

                                <div className="grid grid-cols-2 gap-6">
                                    <StatCard label="Security Score" value="98%" detail="Very High" />
                                    <StatCard label="Active Devices" value="03" detail="New York, SF, London" />
                                </div>

                                <div className="mt-12">
                                    <h3 className="text-xl font-black mb-6">Recent Activity</h3>
                                    <div className="space-y-4">
                                        <ActivityRow label="Successful Login" date="10 mins ago" location="NY, US" />
                                        <ActivityRow label="Password Updated" date="2 days ago" location="SF, US" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-600/40 rotate-12">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                                {view === 'login' ? 'Secure Login' : 'Create Account'}
                            </h1>
                            <p className="text-slate-500 font-medium">Enterprise Access Protocol v4.2</p>
                        </div>

                        <div className="glass-card rounded-[3rem] p-10">
                            <form className="space-y-6" onSubmit={handleAuth}>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            className="input-field pl-16"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Secure Password</label>
                                    <div className="relative">
                                        <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="password"
                                            className="input-field pl-16"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group active:scale-95">
                                    {view === 'login' ? 'INITIALIZE LOGIN' : 'CREATE PROTOCOL'} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                <button
                                    onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                                    className="text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest"
                                >
                                    {view === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                                </button>
                            </div>
                        </div>

                        <p className="text-center mt-12 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            Biometric verification enabled • End-to-end encrypted • MK_OS_X
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-blue-600/10 text-blue-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            {icon}
            <span className="font-bold">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
        </button>
    );
}

function StatCard({ label, value, detail }: { label: string, value: string, detail: string }) {
    return (
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{label}</h4>
            <div className="text-4xl font-black mb-1">{value}</div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">{detail}</p>
        </div>
    );
}

function ActivityRow({ label, date, location }: { label: string, date: string, location: string }) {
    return (
        <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <h5 className="font-black text-sm uppercase">{label}</h5>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{date}</p>
                </div>
            </div>
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{location}</div>
        </div>
    );
}

export default App;
