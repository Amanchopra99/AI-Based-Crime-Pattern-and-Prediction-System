import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, FileText, Users, Activity, Clock, MapPin, Zap } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import KPICard from '../components/KPICard';
import CrimeMap from '../components/CrimeMap';
import LiveNews from '../components/LiveNews';
import LoadingSkeleton from '../components/LoadingSkeleton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, trendsRes, hotspotsRes, patternsRes, timelineRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/analytics/stats`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/analytics/trends`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/analytics/hotspots`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/analytics/patterns`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/activity/timeline`, { withCredentials: true })
      ]);
      setStats(statsRes.data);
      setTrends(trendsRes.data.slice(0, 7));
      setHotspots(hotspotsRes.data);
      setPatterns(patternsRes.data);
      setTimeline(timelineRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-4">
        <LoadingSkeleton type="kpi" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><LoadingSkeleton type="chart" /></div>
          <LoadingSkeleton type="card" count={4} />
        </div>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) { case 'High': return '#FF3B30'; case 'Medium': return '#FFB000'; default: return '#34C759'; }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-4 lg:p-6 space-y-4" data-testid="dashboard-home">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Intelligence Dashboard
          </h1>
          <p className="text-sm text-[#52525B] mt-0.5" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Real-time crime analytics and predictions
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/5">
          <div className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
          <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-wider">System Online</span>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={Zap} label="Total Predictions" value={stats?.total_predictions || 0} trend="14%" trendDirection="up" color="#00F0FF" delay={0} />
        <KPICard icon={AlertTriangle} label="High Risk Alerts" value={stats?.risk_distribution?.high || 0} trend="8%" trendDirection="up" color="#FF3B30" delay={0.05} />
        <KPICard icon={FileText} label="Active Reports" value={stats?.total_reports || 0} trend="5%" trendDirection="up" color="#FFB000" delay={0.1} />
        <KPICard icon={Users} label="System Users" value={stats?.total_users || 0} trend="3%" trendDirection="up" color="#34C759" delay={0.15} />
      </div>

      {/* Main Grid: Map + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Crime Map - Main visual */}
        <motion.div variants={item} className="xl:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00F0FF]" />
              <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Crime Heatmap
              </h3>
            </div>
            <span className="text-xs font-mono text-[#52525B]">{hotspots.length} incidents</span>
          </div>
          <div className="h-[400px]">
            <CrimeMap hotspots={hotspots} height="100%" />
          </div>
        </motion.div>

        {/* Right Sidebar: News + Activity */}
        <div className="xl:col-span-4 space-y-4">
          <motion.div variants={item}>
            <LiveNews />
          </motion.div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Pattern */}
        <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#FFB000]" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Hourly Crime Pattern
            </h3>
            {patterns?.insights && (
              <span className="ml-auto text-xs font-mono text-[#FFB000] bg-[#FFB000]/10 px-2 py-0.5 rounded border border-[#FFB000]/20">
                Peak: {patterns.insights.peak_hour}
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={patterns?.hourly || []}>
              <defs>
                <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} interval={3} />
              <YAxis stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontFamily: "'JetBrains Mono'", fontSize: '12px' }} />
              <Area type="monotone" dataKey="count" stroke="#00F0FF" fill="url(#hourlyGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crime Types Distribution */}
        <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#3B82F6]" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Crime Type Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={(patterns?.crime_types || []).slice(0, 7)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} />
              <YAxis dataKey="type" type="category" stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontFamily: "'JetBrains Mono'", fontSize: '12px' }} />
              <Bar dataKey="count" fill="#00F0FF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Activity Timeline</h3>
        </div>
        <div className="space-y-2">
          {timeline.length > 0 ? timeline.map((act, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getRiskColor(act.risk_level) }} />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-white truncate block">{act.title}</span>
                <span className="text-xs text-[#52525B]">{act.description}</span>
              </div>
              <span className="text-[10px] font-mono text-[#52525B] shrink-0">
                {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : ''}
              </span>
            </motion.div>
          )) : (
            <div className="text-center py-8 text-[#52525B]">No recent activity</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
