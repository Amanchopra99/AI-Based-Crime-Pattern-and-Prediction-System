import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Brain, Target, BarChart3, Database, AlertTriangle, CheckCircle, Cpu, Layers, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const AIModelInfo = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/ai-model-info`, { withCredentials: true })
      .then(res => setInfo(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00F0FF]" /></div>;
  if (!info) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-4 lg:p-6 space-y-4" data-testid="ai-model-page">
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>AI Model Documentation</h1>
        <p className="text-sm text-[#52525B]">Complete details about the AI algorithm, accuracy metrics, and methodology</p>
      </motion.div>

      {/* Model Overview */}
      <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-4"><Brain className="w-5 h-5 text-[#00F0FF]" /><h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit'" }}>Model Overview</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Model Name', value: info.model.name, color: '#00F0FF' },
            { label: 'Base Model', value: info.model.base_model, color: '#3B82F6' },
            { label: 'Architecture', value: info.model.architecture, color: '#FFB000' },
            { label: 'Parameters', value: info.model.parameters, color: '#34C759' },
          ].map((m, i) => (
            <div key={i} className="bg-black/40 border border-white/5 rounded-md p-3">
              <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-1">{m.label}</div>
              <div className="text-sm font-semibold text-white" style={{ fontFamily: "'JetBrains Mono'" }}>{m.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Methodology Pipeline */}
      <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-4"><Layers className="w-5 h-5 text-[#FFB000]" /><h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit'" }}>Methodology Pipeline</h2></div>
        <p className="text-sm text-[#A1A1AA] mb-4">{info.methodology.description}</p>
        <div className="space-y-2">
          {info.methodology.pipeline.map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-black/40 border border-white/5 rounded-md">
              <div className="w-6 h-6 rounded-full bg-[#00F0FF]/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-mono font-bold text-[#00F0FF]">{i + 1}</span>
              </div>
              <p className="text-sm text-[#A1A1AA]" style={{ fontFamily: "'Manrope'" }}>{step.replace(/^\d+\.\s*[A-Z\s]+:\s*/, '')}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Algorithms Used */}
      <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-4"><Cpu className="w-5 h-5 text-[#3B82F6]" /><h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit'" }}>Algorithms Used</h2></div>
        <div className="space-y-3">
          {info.methodology.algorithms_used.map((algo, i) => (
            <div key={i} className="bg-black/40 border border-white/5 rounded-md p-4 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">{algo.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/20">{algo.accuracy}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded">{algo.type}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFB000] bg-[#FFB000]/10 px-2 py-0.5 rounded">{algo.purpose}</span>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">{algo.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-4"><Target className="w-5 h-5 text-[#FF3B30]" /><h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit'" }}>Performance Metrics</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-black/40 border border-white/5 rounded-md p-3 text-center">
            <div className="text-2xl font-mono font-bold text-[#00F0FF]">{info.performance_metrics.overall_accuracy}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#52525B]">Overall Accuracy</div>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-md p-3 text-center">
            <div className="text-2xl font-mono font-bold text-[#34C759]">{info.performance_metrics.auc_roc}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#52525B]">AUC-ROC Score</div>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-md p-3 text-center">
            <div className="text-2xl font-mono font-bold text-[#FFB000]">{info.performance_metrics.training_data_size}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#52525B]">Training Data</div>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-md p-3 text-center">
            <div className="text-2xl font-mono font-bold text-white">{info.performance_metrics.validation_split}</div>
            <div className="text-[10px] uppercase tracking-wider text-[#52525B]">Train/Test Split</div>
          </div>
        </div>

        {/* Precision/Recall/F1 Table */}
        <h3 className="text-sm font-semibold text-white mb-2">Per-Class Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="metrics-table">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-[#52525B]">Risk Level</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-[#52525B]">Precision</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-[#52525B]">Recall</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-[#52525B]">F1-Score</th>
              </tr>
            </thead>
            <tbody>
              {['High', 'Medium', 'Low'].map(level => (
                <tr key={level} className="border-b border-white/5">
                  <td className="py-2 px-3"><span className={`text-xs font-mono px-2 py-0.5 rounded border ${level === 'High' ? 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/20' : level === 'Medium' ? 'bg-[#FFB000]/15 text-[#FFB000] border-[#FFB000]/20' : 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/20'}`}>{level}</span></td>
                  <td className="py-2 px-3 font-mono text-white">{info.performance_metrics.precision[level]}</td>
                  <td className="py-2 px-3 font-mono text-white">{info.performance_metrics.recall[level]}</td>
                  <td className="py-2 px-3 font-mono text-white">{info.performance_metrics.f1_score[level]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Dataset Info */}
      <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-4"><Database className="w-5 h-5 text-[#34C759]" /><h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit'" }}>Dataset Information</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Region', value: info.dataset_info.region },
            { label: 'Total Records', value: info.dataset_info.total_records },
            { label: 'Locations', value: info.dataset_info.locations_covered },
            { label: 'Districts', value: info.dataset_info.districts_covered },
          ].map((d, i) => (
            <div key={i} className="bg-black/40 border border-white/5 rounded-md p-3">
              <div className="text-[10px] uppercase tracking-wider text-[#52525B]">{d.label}</div>
              <div className="text-lg font-mono font-bold text-white">{d.value}</div>
            </div>
          ))}
        </div>
        <h3 className="text-sm font-semibold text-white mb-2">Features Used ({info.dataset_info.features.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {info.dataset_info.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#A1A1AA] py-1">
              <CheckCircle className="w-3 h-3 text-[#34C759] shrink-0" />{f}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Limitations */}
      <motion.div variants={item} className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-[#FFB000]" /><h2 className="text-lg font-semibold text-white" style={{ fontFamily: "'Outfit'" }}>Limitations & Disclaimers</h2></div>
        <div className="space-y-2">
          {info.limitations.map((l, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FFB000] shrink-0 mt-0.5" />{l}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIModelInfo;
