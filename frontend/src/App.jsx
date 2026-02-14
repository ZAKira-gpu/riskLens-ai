import React, { useState } from 'react';
import { Shield, Activity, BarChart3, AlertTriangle, Search, Menu, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, change, icon: Icon, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-500',
    purple: 'bg-purple-500/10 text-purple-500',
    rose: 'bg-rose-500/10 text-rose-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.indigo}`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </motion.div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-8 hidden md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">RiskLens AI</span>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarItem icon={Activity} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <SidebarItem icon={Shield} label="Risk Profile" active={activeTab === 'Risk Profile'} onClick={() => setActiveTab('Risk Profile')} />
          <SidebarItem icon={AlertTriangle} label="Incidents" active={activeTab === 'Incidents'} onClick={() => setActiveTab('Incidents')} />
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20">
          <p className="text-xs text-indigo-300 font-medium mb-2">PRO PLAN</p>
          <p className="text-sm font-semibold mb-3">Upgrade for ML insights</p>
          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors">
            Upgrade Now
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search risks, users, transactions..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <User size={20} className="text-slate-300" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold">Good afternoon, Admin</h1>
              <p className="text-slate-400 mt-1">Here's what's happening with your risk portfolio today.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all">
                Export Data
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-600/20">
                Run Simulation
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Transactions" value="10,000" change="+12.5%" icon={Activity} color="indigo" />
            <StatCard label="Risk Score Avg" value="0.42" change="-2.4%" icon={Shield} color="purple" />
            <StatCard label="Critical Alerts" value="14" change="+4" icon={AlertTriangle} color="rose" />
            <StatCard label="Potential Loss" value="$52,430" change="+8.1%" icon={BarChart3} color="amber" />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-6">Recent Risk Signals</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">Suspicious Activity Detected</p>
                        <p className="text-xs text-slate-500">Transaction ID #TRX-{1000 + i} • 2 mins ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-500">0.89 Risk</p>
                      <p className="text-xs text-slate-500">$2,450.00</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-6">Risk Distribution</h3>
              <div className="flex flex-col items-center justify-center h-full pb-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[16px] border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-[16px] border-indigo-500 border-t-transparent border-r-transparent -rotate-45"></div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">64%</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Overall Risk</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-xs text-slate-400 font-medium">Stable (64%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <span className="text-xs text-slate-400 font-medium">Volatile (36%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
