import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Database, Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DatasetViewer = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: res } = await axios.get(`${BACKEND_URL}/api/dataset?page=${page}&limit=25`, { withCredentials: true });
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleDownload = async () => {
    try {
      const { data: res } = await axios.get(`${BACKEND_URL}/api/dataset/download`, { withCredentials: true });
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'delhi_crime_dataset.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  const filtered = search ? data.filter(d =>
    d.location?.toLowerCase().includes(search.toLowerCase()) ||
    d.crime_type?.toLowerCase().includes(search.toLowerCase()) ||
    d.district?.toLowerCase().includes(search.toLowerCase())
  ) : data;

  const getRiskClass = (level) => {
    switch (level) {
      case 'High': return 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/20';
      case 'Medium': return 'bg-[#FFB000]/15 text-[#FFB000] border-[#FFB000]/20';
      default: return 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/20';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-6 space-y-4" data-testid="dataset-page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Crime Dataset</h1>
          <p className="text-sm text-[#52525B]">Delhi NCR Crime Records - {total} total records</p>
        </div>
        <Button onClick={handleDownload} className="bg-[#00F0FF] text-black hover:bg-[#33F3FF] gap-2" data-testid="download-dataset">
          <Download className="w-4 h-4" /> Download JSON
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search location, crime type, district..."
          className="pl-10 bg-[#0A0A0A] border-white/10 text-white placeholder-[#52525B]" data-testid="dataset-search" />
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="dataset-table">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                {['Location', 'District', 'Crime Type', 'Risk', 'Prob.', 'Date', 'Time', 'FIR Status', 'Victim Age', 'Weapon'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5"><td colSpan={10} className="py-3 px-3"><div className="h-3 bg-white/5 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 px-3 text-white text-xs font-medium whitespace-nowrap">{row.location}</td>
                  <td className="py-2 px-3 text-[#A1A1AA] text-xs whitespace-nowrap">{row.district}</td>
                  <td className="py-2 px-3 text-[#A1A1AA] text-xs whitespace-nowrap">{row.crime_type}</td>
                  <td className="py-2 px-3"><span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getRiskClass(row.risk_level)}`}>{row.risk_level}</span></td>
                  <td className="py-2 px-3 text-xs font-mono text-white">{row.probability}%</td>
                  <td className="py-2 px-3 text-[#52525B] text-xs font-mono whitespace-nowrap">{row.date}</td>
                  <td className="py-2 px-3 text-[#52525B] text-xs font-mono">{row.time}</td>
                  <td className="py-2 px-3 text-[#A1A1AA] text-xs whitespace-nowrap">{row.fir_status}</td>
                  <td className="py-2 px-3 text-[#52525B] text-xs">{row.victim_age_group}</td>
                  <td className="py-2 px-3 text-[#52525B] text-xs">{row.weapon_used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t border-white/10">
          <span className="text-xs text-[#52525B] font-mono">Page {page} of {totalPages} ({total} records)</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="border-white/10 text-white hover:bg-white/5 gap-1"><ChevronLeft className="w-3 h-3" /> Prev</Button>
            <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="border-white/10 text-white hover:bg-white/5 gap-1">Next <ChevronRight className="w-3 h-3" /></Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DatasetViewer;
