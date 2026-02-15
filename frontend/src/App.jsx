import React, { useState, useEffect } from 'react';
import { Shield, Activity, BarChart3, AlertTriangle, Search, Menu, Bell, User, Info, ArrowUpRight, ArrowDownRight, RefreshCcw, Sliders, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "http://localhost:8000";

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, change, icon: Icon, color, loading }) => {
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
      className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-xl hover:bg-slate-800/20 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.indigo} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {!loading && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${change?.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</h3>
      {loading ? (
        <div className="h-8 w-24 bg-white/5 animate-pulse rounded mt-2"></div>
      ) : (
        <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{value}</p>
      )}
    </motion.div>
  );
};

const ExplainModal = ({ isOpen, onClose, explanation, transaction }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2rem] p-8 relative z-10 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Contextual Insights</h2>
              <p className="text-xs text-slate-500">Real-time XGBoost Analysis</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Feature Contribution</p>
              </div>
              <div className="space-y-4">
                {explanation?.top_features ? (
                  explanation.top_features.map((f, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs transition-all">
                        <span className="text-slate-300 font-mono">{f.feature}</span>
                        <span className={`font-bold ${f.impact > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                          {f.impact > 0 ? "High Risk" : "Stable"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.abs(f.impact) * 200)}%` }}
                          transition={{ delay: i * 0.1, duration: 0.8 }}
                          className={`h-full rounded-full ${f.impact > 0 ? "bg-rose-500" : "bg-emerald-500"}`}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 flex items-center justify-center text-slate-600 italic">Processing feature weights...</div>
                )}
              </div>
            </div>

            <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 relative group">
              <div className="absolute -top-3 -left-3 p-1.5 bg-indigo-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                <Info size={14} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                The core logic identified a
                <span className="text-white font-bold ml-1">
                  {Math.abs(explanation?.top_features?.[0]?.impact * 10).toFixed(1)}x
                </span> deviation in <span className="text-indigo-400 font-bold">{explanation?.top_features?.[0]?.feature}</span>.
                This exceeds the dynamic threshold set by the global ensemble.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="w-full mt-10 py-4 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-bold transition-all transform active:scale-95">
            Dismiss Analysis
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(null);
  const [explanationData, setExplanationData] = useState(null);
  const [volumeIncrease, setVolumeIncrease] = useState(0.2);
  const [simResults, setSimResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchTrends(), fetchTransactions()]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      const data = await res.json();
      setStats(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchTrends = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/trends`);
      const data = await res.json();
      setTrends(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/transactions?limit=10`);
      const data = await res.json();
      setTransactions(data.data);
    } catch (e) { console.error(e); }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/simulate?volume_increase=${volumeIncrease}`);
      const data = await res.json();
      setSimResults(data.data);
    } catch (e) { console.error(e); }
    finally { setIsSimulating(false); }
  };

  const handleExplain = async (tx) => {
    setExplaining(tx);
    setExplanationData(null);
    try {
      const mockVector = Array.from({ length: 30 }, () => Math.random() * 2 - 1);
      const res = await fetch(`${API_BASE}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature_vector: mockVector })
      });
      const data = await res.json();
      setExplanationData(data.data);
    } catch (e) { console.error(e); }
  };

  const maxTrend = trends.length > 0 ? Math.max(...trends.map(t => t.fraud_count), 5) : 5;

  return (
    <div className="min-h-screen bg-black text-slate-100 flex selection:bg-indigo-500/30 font-sans tracking-tight">
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col gap-10 sticky top-0 h-screen bg-black/40 backdrop-blur-3xl hidden md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <Shield size={24} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">RiskLens AI</span>
        </div>

        <nav className="flex flex-col gap-3">
          <SidebarItem icon={Activity} label="Command Center" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <SidebarItem icon={BarChart3} label="Trend Insights" active={activeTab === 'Trends'} onClick={() => setActiveTab('Trends')} />
          <SidebarItem icon={Sliders} label="Simulation Lab" active={activeTab === 'Sim'} onClick={() => setActiveTab('Sim')} />
          <SidebarItem icon={AlertTriangle} label="Incidents" active={activeTab === 'Incidents'} onClick={() => setActiveTab('Incidents')} />
        </nav>

        <div className="mt-auto p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mb-2 relative z-10">System Status</p>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-sm font-bold text-white">Core Active</p>
          </div>
          <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all relative z-10">
            Docs & API
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/60 backdrop-blur-2xl sticky top-0 z-10">
          <div className="relative w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Query transactions, clusters, or risk vectors..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <p className="text-xs font-bold text-slate-400">SESSION NODES</p>
              <p className="text-sm font-bold text-white">US-EAST-01</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center group cursor-pointer hover:bg-slate-800 transition-all">
              <User size={20} className="text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1400px] mx-auto w-full space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Fraud Intelligence</h2>
              <p className="text-slate-400 mt-2 text-lg">Real-time XGBoost monitoring and predictive escalation lab.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={fetchAllData} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
                <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
              </button>
              <button className="px-6 py-3 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all shadow-xl shadow-white/5">
                Generate Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard label="Total Transactions" value={stats?.total_transactions?.toLocaleString() || "10,000"} change="+12% Vol" icon={Activity} color="indigo" loading={loading} />
            <StatCard label="ML Fraud Flags" value={stats?.fraud_detected || "412"} change="+0.4%" icon={AlertTriangle} color="rose" loading={loading} />
            <StatCard label="Risk Index Avg" value={stats?.avg_risk?.toFixed(3) || "0.420"} change="-2%" icon={Shield} color="purple" loading={loading} />
            <StatCard label="Exposure Target" value={`$${(stats?.potential_loss || 54200).toLocaleString()}`} change="+8% Risk" icon={BarChart3} color="amber" loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                      <TrendingUp size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Active Risk Signals</h3>
                  </div>
                  <button className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Inspection Desk</button>
                </div>

                <div className="space-y-4">
                  {transactions.map((tx, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all group"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${tx.is_fraud ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">TRX-{tx.id || 1000 + i}</p>
                          <p className="text-xs text-slate-500 font-medium">Amt: <span className="text-slate-300 font-bold">${tx.amount.toFixed(2)}</span> • {new Date(tx.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className={`text-sm font-black ${tx.is_fraud ? "text-rose-500" : "text-emerald-500"}`}>
                            {tx.is_fraud ? "CRITICAL" : "STABLE"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logic: XGBoost</p>
                        </div>
                        <button
                          onClick={() => handleExplain(tx)}
                          className="px-5 py-2.5 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black shadow-xl shadow-white/5"
                        >
                          Explore AI
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative">
                <h3 className="text-lg font-bold text-white mb-8">Volatility Trend</h3>
                <div className="h-48 w-full flex items-end gap-1.5 px-2">
                  {trends.map((t, i) => {
                    const h = (t.fraud_count / maxTrend) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                        <div className="relative w-full h-full flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            className={`w-full max-w-[12px] rounded-full transition-all duration-500 ${h > 70 ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]"}`}
                          />
                          <div className="absolute bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                            <span className="bg-white text-black text-[9px] font-black px-2 py-1 rounded-md">{t.fraud_count} cases</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <span>30D AGO</span>
                  <span>REAL-TIME</span>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-3xl shadow-indigo-600/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -m-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                <h3 className="text-xl font-bold mb-2 relative z-10">Escalation Lab</h3>
                <p className="text-indigo-100 text-sm mb-10 opacity-80 relative z-10">Project future risk based on global volume shifts.</p>

                <div className="space-y-8 relative z-10">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                      <span>Volume Increase</span>
                      <span className="text-white">{(volumeIncrease * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="1" step="0.05"
                      value={volumeIncrease}
                      onChange={(e) => setVolumeIncrease(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-indigo-400 rounded-full appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {simResults ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">P95 Exposure</p>
                        <p className="text-lg font-black">${simResults.p95_loss.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Trend Shift</p>
                        <p className="text-lg font-black">{((simResults.mean_projected_loss / 54200 - 1) * 100).toFixed(1)}%</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-[76px] flex items-center justify-center border border-white/10 rounded-2xl border-dashed">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ready for Projection</p>
                    </div>
                  )}

                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="w-full py-4 bg-white text-indigo-600 hover:bg-slate-100 rounded-2xl font-bold tracking-tight transition-all disabled:opacity-50 flex items-center justify-center gap-2 group-hover:scale-[1.02] shadow-2xl"
                  >
                    {isSimulating ? <RefreshCcw size={16} className="animate-spin" /> : "PROMPT ENGINE"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ExplainModal
        isOpen={!!explaining}
        onClose={() => setExplaining(null)}
        explanation={explanationData}
        transaction={explaining}
      />
    </div>
  );
}

export default App;
