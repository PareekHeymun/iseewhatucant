import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, CheckCircle, AlertCircle, Wrench, MapPin, Calendar, MessageCircle } from 'lucide-react';
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
  assignedTo?: string;
  estimatedCompletion?: string;
  updates?: Array<{
    id: string;
    message: string;
    timestamp: string;
    author: string;
  }>;
}

interface MyReportsProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
}

export function MyReports({ reports, onReportClick }: MyReportsProps) {
  const [selectedTab, setSelectedTab] = useState('all');

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'submitted': return 25;
      case 'assigned': return 50;
      case 'in-progress': return 75;
      case 'resolved': return 100;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string, className: string = "w-4 h-4") => {
    switch (status) {
      case 'submitted': return <Clock className={className} />;
      case 'assigned': return <AlertCircle className={className} />;
      case 'in-progress': return <Wrench className={className} />;
      case 'resolved': return <CheckCircle className={className} />;
      default: return <Clock className={className} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'assigned': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'in-progress': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      default: return '';
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

  const filterReports = (status: string) => {
    if (status === 'all') return reports;
    return reports.filter(report => report.status === status);
  };

  const getTabCount = (status: string) => {
    return filterReports(status).length;
  };

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onReportClick(report)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {report.photo && (
            <ImageWithFallback 
              src={report.photo}
              alt="Report"
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium truncate">{report.title}</h3>
                <div className="flex space-x-2">
                  <Badge variant="outline" className={getPriorityColor(report.priority)}>
                    {report.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(report.status)}>
                    {getStatusIcon(report.status, "w-3 h-3 mr-1")}
                    {report.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="text-muted-foreground">{getStatusProgress(report.status)}%</span>
              </div>
              <Progress value={getStatusProgress(report.status)} className="h-2" />
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Ward {report.ward}</span>
              </div>
              {report.assignedTo && (
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Assigned to {report.assignedTo}</span>
                </div>
              )}
              {report.estimatedCompletion && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Est. {report.estimatedCompletion}</span>
                </div>
              )}
            </div>

            {/* Latest Update */}
            {report.updates && report.updates.length > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{report.updates[report.updates.length - 1].message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {report.updates[report.updates.length - 1].author} • {new Date(report.updates[report.updates.length - 1].timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1>My Reports</h1>
          <p className="text-muted-foreground">Track the progress of your submitted issues</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <Card className="p-3 text-center">
            <div className="text-lg font-medium">{reports.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-medium text-blue-600">{getTabCount('submitted')}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-medium text-orange-600">{getTabCount('in-progress')}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-medium text-green-600">{getTabCount('resolved')}</div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({reports.length})</TabsTrigger>
            <TabsTrigger value="submitted">Pending ({getTabCount('submitted')})</TabsTrigger>
            <TabsTrigger value="assigned">Assigned ({getTabCount('assigned')})</TabsTrigger>
            <TabsTrigger value="in-progress">Active ({getTabCount('in-progress')})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({getTabCount('resolved')})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {reports.map(report => <ReportCard key={report.id} report={report} />)}
          </TabsContent>

          <TabsContent value="submitted" className="mt-6 space-y-4">
            {filterReports('submitted').map(report => <ReportCard key={report.id} report={report} />)}
          </TabsContent>

          <TabsContent value="assigned" className="mt-6 space-y-4">
            {filterReports('assigned').map(report => <ReportCard key={report.id} report={report} />)}
          </TabsContent>

          <TabsContent value="in-progress" className="mt-6 space-y-4">
            {filterReports('in-progress').map(report => <ReportCard key={report.id} report={report} />)}
          </TabsContent>

          <TabsContent value="resolved" className="mt-6 space-y-4">
            {filterReports('resolved').map(report => <ReportCard key={report.id} report={report} />)}
          </TabsContent>
        </Tabs>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4">You haven't submitted any reports yet.</p>
            <Button>Submit Your First Report</Button>
          </div>
        )}
      </div>
    </div>
  );
}