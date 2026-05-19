import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Plus, MapPin, Calendar, Image as ImageIcon, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: 28.6139,
    longitude: 77.2090,
    date: new Date().toISOString().split('T')[0],
    image: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/reports`, { withCredentials: true });
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/reports`, formData, { withCredentials: true });
      setShowDialog(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        latitude: 40.7128,
        longitude: -74.006,
        date: new Date().toISOString().split('T')[0],
        image: ''
      });
      fetchReports();
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/reports/${reportId}`, { withCredentials: true });
        fetchReports();
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  const handleStatusChange = async (reportId, status) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/reports/${reportId}/status`, { status }, { withCredentials: true });
      fetchReports();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-[#34C759]/20 text-[#34C759] border-[#34C759]/30';
      case 'rejected':
        return 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30';
      default:
        return 'bg-[#FFCC00]/20 text-[#FFCC00] border-[#FFCC00]/30';
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#007AFF]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="reports-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-2" style={{ fontFamily: 'Chivo, sans-serif' }}>
            Crime Reports
          </h1>
          <p className="text-base text-[#A1A1AA]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Submit and manage crime incident reports
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#007AFF] text-white hover:bg-[#005BB5]" data-testid="create-report-button">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#121212] border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black" style={{ fontFamily: 'Chivo, sans-serif' }}>
                Submit Crime Report
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="report-form">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.2em]">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-[#050505] border-white/20 text-white"
                  placeholder="Brief description"
                  data-testid="report-title-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.2em]">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="bg-[#050505] border-white/20 text-white min-h-[100px]"
                  placeholder="Detailed description of the incident"
                  data-testid="report-description-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.2em]">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="bg-[#050505] border-white/20 text-white"
                  placeholder="Location address"
                  data-testid="report-location-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.2em]">Latitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="bg-[#050505] border-white/20 text-white"
                    data-testid="report-latitude-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.2em]">Longitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="bg-[#050505] border-white/20 text-white"
                    data-testid="report-longitude-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-[0.2em]">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-[#050505] border-white/20 text-white"
                  data-testid="report-date-input"
                />
              </div>
              <Button type="submit" className="w-full bg-[#007AFF] hover:bg-[#005BB5]" data-testid="submit-report-button">
                Submit Report
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {reports.length === 0 ? (
          <div className="col-span-full bg-[#121212] border border-white/10 rounded-md p-12 text-center">
            <p className="text-[#71717A]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
              No reports yet. Click "New Report" to submit one.
            </p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-[#121212] border border-white/10 rounded-md p-6 hover:border-white/20 transition-colors duration-200"
              data-testid="report-card"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Chivo, sans-serif' }}>
                  {report.title}
                </h3>
                <span className={`px-2 py-1 border text-xs uppercase tracking-wider rounded ${getStatusBadge(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-[#A1A1AA] mb-4 line-clamp-2" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                {report.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#71717A]">
                  <MapPin className="w-4 h-4" />
                  {report.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#71717A]">
                  <Calendar className="w-4 h-4" />
                  {report.date}
                </div>
                <div className="text-sm text-[#71717A]">
                  Submitted by: {report.user_name}
                </div>
              </div>
              {user?.role === 'admin' && report.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(report.id, 'approved')}
                    className="flex-1 bg-[#34C759] hover:bg-[#34C759]/80"
                    data-testid="approve-report-button"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(report.id, 'rejected')}
                    className="flex-1 bg-[#FF3B30] hover:bg-[#FF3B30]/80"
                    data-testid="reject-report-button"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              {user?.role === 'admin' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(report.id)}
                  className="w-full mt-2 border-[#FF3B30]/30 text-[#FF3B30] hover:bg-[#FF3B30]/20"
                  data-testid="delete-report-button"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
