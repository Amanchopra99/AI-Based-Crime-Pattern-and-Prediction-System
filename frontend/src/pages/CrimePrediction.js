import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, AlertTriangle, Radar, Shield, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import CrimeMap from '../components/CrimeMap';
import GaugeChart from '../components/GaugeChart';
import { TypeAnimation } from 'react-type-animation';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CrimePrediction = () => {
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [crimeType, setCrimeType] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMapClick = useCallback(({ lat, lng }) => {
    setLatitude(parseFloat(lat.toFixed(4)));
    setLongitude(parseFloat(lng.toFixed(4)));
    setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  }, []);

  const handlePredict = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/predict`,
        { location: location || `${latitude}, ${longitude}`, latitude, longitude, date, time, crime_type: crimeType || null },
        { withCredentials: true }
      );
      setPrediction(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) { case 'High': return '#FF3B30'; case 'Medium': return '#FFB000'; default: return '#34C759'; }
  };
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    // 🔥 Natural tuning
    speech.rate = 0.88;     // slower = more human
    speech.pitch = 1;
    speech.volume = 1;

    const voices = synth.getVoices();

    // 🔥 BEST HUMAN-LIKE VOICES
    const preferred =
      voices.find(v => v.name.includes("Google UK English Male")) ||
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices.find(v => v.name.includes("Microsoft David")) ||
      voices.find(v => v.lang === "en-US");

    if (preferred) speech.voice = preferred;

    synth.speak(speech);
  };
useEffect(() => {
  if (prediction?.analysis) {

    const fullText = `
      Attention...

      ${prediction.risk_level} risk detected in ${prediction.location}.

      ${prediction.analysis}

      Key risk factors include...
      ${prediction.factors.join(". ")}

      Recommended precautions...
      ${prediction.precautions?.join(". ")}

      Stay alert.
    `;

    speakText(fullText);
  }
}, [prediction]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen p-4 lg:p-6" data-testid="crime-prediction-page">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Crime Prediction
        </h1>
        <p className="text-sm text-[#52525B]" style={{ fontFamily: "'Manrope', sans-serif" }}>
          AI-powered crime risk analysis with Claude Sonnet 4.5
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Input Form */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]" data-testid="prediction-form">
            <div className="flex items-center gap-2 mb-4">
              <Radar className="w-5 h-5 text-[#00F0FF]" />
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Prediction Parameters</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium uppercase tracking-[0.1em] text-[#A1A1AA] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Location
                </Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Click on map or type" className="bg-black/40 border-white/10 focus:ring-[#00F0FF] focus:border-[#00F0FF]/50 text-white placeholder-[#52525B] text-sm" data-testid="location-input" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B]">Lat</Label>
                  <Input type="number" step="0.0001" value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))} className="bg-black/40 border-white/10 text-white text-sm font-mono" data-testid="latitude-input" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B]">Lng</Label>
                  <Input type="number" step="0.0001" value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))} className="bg-black/40 border-white/10 text-white text-sm font-mono" data-testid="longitude-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-black/40 border-white/10 text-white text-sm" data-testid="date-input" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] flex items-center gap-1"><Clock className="w-3 h-3" /> Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-black/40 border-white/10 text-white text-sm" data-testid="time-input" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B]">Crime Type</Label>
                <Select value={crimeType} onValueChange={setCrimeType}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white text-sm" data-testid="crime-type-select"><SelectValue placeholder="Any type" /></SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                    <SelectItem value="Theft">Theft</SelectItem>
                    <SelectItem value="Assault">Assault</SelectItem>
                    <SelectItem value="Burglary">Burglary</SelectItem>
                    <SelectItem value="Vandalism">Vandalism</SelectItem>
                    <SelectItem value="Robbery">Robbery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] px-3 py-2 rounded-md text-xs" data-testid="prediction-error">{error}</div>
              )}

              <Button onClick={handlePredict} disabled={loading} className="w-full bg-[#00F0FF] text-black hover:bg-[#33F3FF] font-semibold transition-all duration-200 active:scale-95" data-testid="predict-button">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2"><Radar className="w-4 h-4" /> Analyze Risk</div>
                )}
              </Button>
            </div>
          </div>

          {/* Prediction Result */}
          <AnimatePresence>
            {prediction && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{
                  boxShadow:
                    prediction.risk_level === "High"
                      ? "0 0 30px rgba(255,0,0,0.2)"
                      : prediction.risk_level === "Medium"
                      ? "0 0 30px rgba(255,176,0,0.2)"
                      : "0 0 30px rgba(52,199,89,0.2)"
                }}
                className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]"
                data-testid="prediction-result"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Analysis Result</h3>
                  <button
                  onClick={() => {
                    const fullText = `
                      ${prediction.risk_level} risk detected.
                      ${prediction.analysis}
                    `;
                    speakText(fullText);
                  }}
                  className="text-xs text-[#52525B] hover:text-white transition"
                >
                  🔊 Play Voice
                </button>
                <button
                  onClick={() => window.speechSynthesis.cancel()}
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  ⏹ Stop Voice
                </button>
                  <Shield className="w-5 h-5" style={{ color: getRiskColor(prediction.risk_level) }} />
                </div>

                <div className="flex justify-center py-2">
                  <GaugeChart value={prediction.confidence} riskLevel={prediction.risk_level} label="confidence" size={180} />
                </div>

                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-1">AI Analysis</div>
                  <TypeAnimation
                    key={`${prediction.analysis}-${prediction.confidence}-${Date.now()}`}
                    sequence={[prediction.analysis]}
                    wrapper="p"
                    speed={60}
                    cursor={true}
                    repeat={0}
                    className="text-sm text-[#D4D4D8] leading-relaxed"
                  />
                </div>

                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-2">Risk Factors</div>
                  <div className="space-y-1.5">
                    {prediction.factors.map((factor, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-sm text-[#A1A1AA] bg-white/5 px-3 py-3 rounded-lg border border-white/5 hover:border-white/10 transition-all"
                      >
                      <div key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: getRiskColor(prediction.risk_level) }} />
                        <span style={{ fontFamily: "'Manrope', sans-serif" }}>{factor}</span>
                      </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                {/* PRECAUTIONS */}
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#52525B] mb-2">
                    Precautions
                  </div>

                  <div className="space-y-2">
                    {prediction.precautions?.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#A1A1AA] bg-green-500/5 px-3 py-2 rounded-md"
                      >
                        <Shield className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                <h3 className="text-xs text-purple-400">Pattern Insights</h3>
                {prediction.pattern_insights?.map((p, i) => (
                  <div key={i}>{p}</div>
                ))}
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map */}
        <div className="xl:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-lg overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_24px_rgba(0,0,0,0.5)]" data-testid="prediction-map">
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-xs font-semibold text-white">Location Selection</span>
            </div>
            <span className="text-[10px] font-mono text-[#52525B]">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
          </div>
          <div className="h-[600px]">
            <CrimeMap center={[latitude, longitude]} zoom={12} height="100%" onMapClick={handleMapClick} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrimePrediction;
