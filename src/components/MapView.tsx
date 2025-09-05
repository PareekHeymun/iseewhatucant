import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin, Filter, Clock, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'assigned' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  location: { lat: number; lng: number };
  createdAt: string;
  photo?: string;
  ward: number;
}

interface MapViewProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
}

export function MapView({ reports, onReportClick }: MapViewProps) {
  const [filteredReports, setFilteredReports] = useState(reports);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState<Report | null>(null);

  useEffect(() => {
    let filtered = reports;
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(report => report.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    setFilteredReports(filtered);
  }, [reports, categoryFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500';
      case 'assigned': return 'bg-yellow-500';
      case 'in-progress': return 'bg-orange-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-3 h-3" />;
      case 'assigned': return <AlertCircle className="w-3 h-3" />;
      case 'in-progress': return <Wrench className="w-3 h-3" />;
      case 'resolved': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Filters */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span>Filters</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="sanitation">Sanitation</SelectItem>
              <SelectItem value="safety">Public Safety</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
              <SelectItem value="traffic">Traffic</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mock Map Area */}
      <div className="relative bg-muted h-64 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p>Interactive Map View</p>
          <p className="text-sm">Shows {filteredReports.length} reports</p>
        </div>
        
        {/* Mock map markers */}
        <div className="absolute inset-0 overflow-hidden">
          {filteredReports.slice(0, 8).map((report, index) => (
            <button
              key={report.id}
              className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg ${getStatusColor(report.status)} 
                transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary`}
              style={{
                left: `${20 + (index % 4) * 20}%`,
                top: `${30 + Math.floor(index / 4) * 40}%`
              }}
              onClick={() => setSelectedMarker(report)}
            />
          ))}
        </div>
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="p-4 bg-card border-b">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{selectedMarker.title}</h3>
                <Badge variant="outline" className={getPriorityColor(selectedMarker.priority)}>
                  {selectedMarker.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{selectedMarker.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedMarker.status)}`} />
                  <span className="text-sm capitalize">{selectedMarker.status.replace('-', ' ')}</span>
                </div>
                <Button size="sm" onClick={() => onReportClick(selectedMarker)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports List */}
      <div className="p-4 pb-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2>Recent Reports</h2>
          <span className="text-sm text-muted-foreground">{filteredReports.length} reports</span>
        </div>
        
        {filteredReports.map((report) => (
          <Card key={report.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onReportClick(report)}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {report.photo && (
                  <ImageWithFallback 
                    src={report.photo}
                    alt="Report"
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="truncate font-medium">{report.title}</h3>
                    <Badge variant="outline" className={getPriorityColor(report.priority)}>
                      {report.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{report.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status.replace('-', ' ')}</span>
                    </div>
                    <span>Ward {report.ward} • {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No reports match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}