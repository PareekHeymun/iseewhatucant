import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  MapPin, Clock, User, MessageCircle, Navigation, Phone, 
  CheckCircle, AlertCircle, Wrench, Calendar, Send
} from 'lucide-react';
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
  voiceNote?: string;
  updates?: Array<{
    id: string;
    message: string;
    timestamp: string;
    author: string;
    type: 'system' | 'comment' | 'status_change';
  }>;
}

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
  userRole: 'citizen' | 'admin';
  onAddUpdate: (reportId: string, message: string) => void;
}

export function ReportDetail({ report, onBack, userRole, onAddUpdate }: ReportDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      onAddUpdate(report.id, newComment);
      setNewComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  const getEstimatedETA = () => {
    // Mock calculation based on Google Routes API
    const baseTime = new Date();
    baseTime.setMinutes(baseTime.getMinutes() + Math.random() * 60 + 15);
    return baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto mb-4">
            ← Back
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2">{report.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getStatusColor(report.status)}>
                  {getStatusIcon(report.status, "w-3 h-3 mr-1")}
                  {report.status.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(report.priority)}>
                  {report.priority} priority
                </Badge>
                <Badge variant="outline">
                  {report.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3>Progress</h3>
                <span className="text-sm text-muted-foreground">{getStatusProgress(report.status)}%</span>
              </div>
              <Progress value={getStatusProgress(report.status)} className="h-2" />
              
              {/* Status Timeline */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className={`text-center ${getStatusProgress(report.status) >= 25 ? 'text-blue-600' : 'text-muted-foreground'}`}>
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getStatusProgress(report.status) >= 25 ? 'bg-blue-600' : 'bg-muted'}`} />
                  Submitted
                </div>
                <div className={`text-center ${getStatusProgress(report.status) >= 50 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getStatusProgress(report.status) >= 50 ? 'bg-yellow-600' : 'bg-muted'}`} />
                  Assigned
                </div>
                <div className={`text-center ${getStatusProgress(report.status) >= 75 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getStatusProgress(report.status) >= 75 ? 'bg-orange-600' : 'bg-muted'}`} />
                  In Progress
                </div>
                <div className={`text-center ${getStatusProgress(report.status) >= 100 ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${getStatusProgress(report.status) >= 100 ? 'bg-green-600' : 'bg-muted'}`} />
                  Resolved
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.description && (
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
            )}

            {report.photo && (
              <div>
                <h4 className="text-sm font-medium mb-2">Photo Evidence</h4>
                <ImageWithFallback 
                  src={report.photo}
                  alt="Report evidence"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {report.voiceNote && (
              <div>
                <h4 className="text-sm font-medium mb-2">Voice Note</h4>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  🎵 Voice note available (Click to play)
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Submitted</span>
                </div>
                <p className="text-muted-foreground">{new Date(report.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-muted-foreground">Ward {report.ward}</p>
              </div>
              {report.assignedTo && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Assigned To</span>
                  </div>
                  <p className="text-muted-foreground">{report.assignedTo}</p>
                </div>
              )}
              {report.status === 'in-progress' && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">ETA</span>
                  </div>
                  <p className="text-muted-foreground">{getEstimatedETA()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact/Emergency Info */}
        {userRole === 'citizen' && report.status !== 'resolved' && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Need immediate assistance?</h4>
                  <p className="text-sm text-muted-foreground">Contact the assigned department</p>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Updates/Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Updates & Communication</CardTitle>
            <CardDescription>
              Track progress and communicate with the assigned team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <Textarea
                placeholder="Add a comment or ask for an update..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button type="submit" size="sm" disabled={isSubmitting || !newComment.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Comment'}
              </Button>
            </form>

            {/* Updates Timeline */}
            <div className="space-y-4 border-t pt-4">
              {report.updates?.map((update) => (
                <div key={update.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {update.type === 'system' ? 'S' : update.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">{update.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                      {update.type === 'status_change' && (
                        <Badge variant="outline" className="text-xs">
                          Status Update
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{update.message}</p>
                  </div>
                </div>
              ))}
              
              {/* Initial submission update */}
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">System</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Report Created
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Report submitted and automatically routed to {report.assignedTo || 'the appropriate department'} based on category and location.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}