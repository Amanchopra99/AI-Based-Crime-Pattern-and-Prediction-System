import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, Radar as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { TrendingUp, MapPin, Clock, Calendar, AlertTriangle, Zap } from 'lucide-react';
import CrimeMap from '../components/CrimeMap';
import LoadingSkeleton from '../components/LoadingSkeleton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const Analytics = () => {
  const [patterns, setPatterns] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [highRiskZones, setHighRiskZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const [patternsRes, hotspotsRes, zonesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/analytics/patterns`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/analytics/hotspots`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/analytics/high-risk-zones`, { withCredentials: true })
      ]);
      setPatterns(patternsRes.data);
      setHotspots(hotspotsRes.data);
      setHighRiskZones(zonesRes.data);
    } catch (error) { console.error('Failed to fetch analytics:', error); } finally { setLoading(false); }
  };

  if (loading) return <div className="p-4 lg:p-6 space-y-4"><LoadingSkeleton type="kpi" count={3} /><LoadingSkeleton type="chart" /></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-4 lg:p-6 space-y-4" data-testid="analytics-page">
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Analytics & Patterns</h1>
        <p className="text-sm text-[#52525B]">Crime trend analysis and geographic intelligence</p>
      </motion.div>

      {/* Insights Row */}
      {patterns?.insights && (
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-1">Total Incidents</div>
            <div className="text-2xl font-mono font-bold text-white" style={{ fontFamily: "'JetBrains Mono'" }}>{patterns.insights.total_crimes}</div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-1">Peak Hour</div>
            <div className="text-2xl font-mono font-bold text-[#FFB000]" style={{ fontFamily: "'JetBrains Mono'" }}>{patterns.insights.peak_hour}</div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-1">Peak Day</div>
            <div className="text-2xl font-mono font-bold text-[#00F0FF]" style={{ fontFamily: "'JetBrains Mono'" }}>{patterns.insights.peak_day}</div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-1">High Risk Zones</div>
            <div className="text-2xl font-mono font-bold text-[#FF3B30]" style={{ fontFamily: "'JetBrains Mono'" }}>{patterns.insights.high_risk_zones}</div>
          </div>
        </motion.div>
      )}

      {/* Map + Zones Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <motion.div variants={item} className="xl:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="p-3 border-b border-white/10 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF3B30]" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Crime Heatmap</h3>
            <div className="ml-auto flex gap-3">
              {[{ c: '#FF3B30', l: 'High' }, { c: '#FFB000', l: 'Med' }, { c: '#34C759', l: 'Low' }].map(b => (
                <div key={b.l} className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.c }} /><span className="text-[10px] text-[#52525B]">{b.l}</span></div>
              ))}
            </div>
          </div>
          <div className="h-[400px]"><CrimeMap hotspots={hotspots} height="100%" /></div>
        </motion.div>

        <motion.div variants={item} className="xl:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>High Risk Zones</h3>
          </div>
          <div className="space-y-2 max-h-[360px] overflow-y-auto">
            {highRiskZones.map((zone, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-2.5 rounded-md bg-white/[0.02] border border-white/5 hover:border-[#FF3B30]/20 transition-colors"
              >
                <div>
                  <div className="text-sm text-white font-medium">{zone.location}</div>
                  <div className="text-[10px] font-mono text-[#52525B]">{zone.count} incidents</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-[#FF3B30]" style={{ fontFamily: "'JetBrains Mono'" }}>{zone.avg_probability?.toFixed(0)}%</div>
                  <div className="text-[10px] text-[#52525B]">avg risk</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly */}
        <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-[#00F0FF]" /><h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Hourly</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={patterns?.hourly || []}>
              <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00F0FF" stopOpacity={0.3} /><stop offset="100%" stopColor="#00F0FF" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="#52525B" style={{ fontSize: '9px', fontFamily: "'JetBrains Mono'" }} interval={5} />
              <YAxis stroke="#52525B" style={{ fontSize: '9px', fontFamily: "'JetBrains Mono'" }} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
              <Area type="monotone" dataKey="count" stroke="#00F0FF" fill="url(#hg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily */}
        <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-3"><Calendar className="w-4 h-4 text-[#FFB000]" /><h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Weekly</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={patterns?.daily || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} />
              <YAxis stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
              <Bar dataKey="count" fill="#FFB000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly */}
        <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-[#34C759]" /><h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Monthly</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={patterns?.monthly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} />
              <YAxis stroke="#52525B" style={{ fontSize: '10px', fontFamily: "'JetBrains Mono'" }} />
              <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
              <Bar dataKey="count" fill="#34C759" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
