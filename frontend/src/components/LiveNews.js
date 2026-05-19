import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Radio, ExternalLink } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LiveNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/news`, { withCredentials: true });
      setNews(data);
    } catch (e) {
      console.error('Failed to fetch news:', e);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return 'Just now';
    if (hrs === 1) return '1h ago';
    return `${hrs}h ago`;
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]" data-testid="live-news">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#FF3B30]" />
          <h3 className="text-sm font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Live Crime Intel
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
          <span className="text-xs text-[#FF3B30] font-mono uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* News Feed */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-16 h-16 rounded bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          news.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="w-16 h-16 rounded object-cover shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white line-clamp-2 mb-1 group-hover:text-[#00F0FF] transition-colors" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-[#52525B]">
                    <span className="uppercase tracking-wider font-mono">{item.category}</span>
                    <span>|</span>
                    <span>{timeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveNews;
