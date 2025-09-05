import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { ReportSubmission } from './components/ReportSubmission';
import { AdminDashboard } from './components/AdminDashboard';
import { MyReports } from './components/MyReports';
import { MapView } from './components/MapView';
import { ReportDetail } from './components/ReportDetail';
import { BottomNavigation } from './components/BottomNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { 
  MapPin, Plus, TrendingUp, Clock, CheckCircle, AlertTriangle,
  Users, Phone, Settings, LogOut, Bell
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
}

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
  voiceNote?: string;
  ward: number;
  userId: string;
  assignedTo?: string;
  estimatedCompletion?: string;
  updates?: Array<{
    id: string;
    message: string;
    timestamp: string;
    author: string;
    type: 'system' | 'comment' | 'status_change';
  }>;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [hasNotifications, setHasNotifications] = useState(false);

  // Mock data initialization
  useEffect(() => {
    // Initialize with some mock reports
    const mockReports: Report[] = [
      {
        id: '1',
        title: 'Pothole on Main Street',
        description: 'Large pothole near intersection causing damage to vehicles',
        category: 'infrastructure',
        status: 'in-progress',
        priority: 'high',
        location: { lat: 40.7128, lng: -74.0060 },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        ward: 3,
        userId: '1',
        assignedTo: 'Public Works Department',
        estimatedCompletion: '2-3 days',
        updates: [
          {
            id: '1',
            message: 'Crew dispatched to assess the damage. Materials ordered for repair.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            author: 'Public Works Team',
            type: 'status_change'
          }
        ]
      },
      {
        id: '2',
        title: 'Broken Street Light',
        description: 'Street light has been flickering for days and is now completely out',
        category: 'infrastructure',
        status: 'assigned',
        priority: 'medium',
        location: { lat: 40.7589, lng: -73.9851 },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        ward: 1,
        userId: '1',
        assignedTo: 'Electrical Maintenance'
      },
      {
        id: '3',
        title: 'Overflowing Garbage Bin',
        description: 'Garbage bin at park entrance is overflowing, attracting pests',
        category: 'sanitation',
        status: 'resolved',
        priority: 'medium',
        location: { lat: 40.7505, lng: -73.9934 },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        ward: 2,
        userId: '1',
        assignedTo: 'Sanitation Department',
        updates: [
          {
            id: '2',
            message: 'Bin emptied and additional pickup scheduled for high-traffic areas.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            author: 'Sanitation Team',
            type: 'status_change'
          }
        ]
      },
      {
        id: '4',
        title: 'Unsafe Intersection',
        description: 'Traffic signal malfunction causing dangerous conditions',
        category: 'safety',
        status: 'submitted',
        priority: 'high',
        location: { lat: 40.7614, lng: -73.9776 },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        ward: 4,
        userId: '2'
      }
    ];
    
    setReports(mockReports);
    setHasNotifications(mockReports.some(r => r.status === 'submitted' && r.priority === 'high'));
  }, []);

  // Auto-simulate status updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setReports(prev => {
        const updated = [...prev];
        const submittedReports = updated.filter(r => r.status === 'submitted');
        
        if (submittedReports.length > 0 && Math.random() > 0.7) {
          const report = submittedReports[Math.floor(Math.random() * submittedReports.length)];
          const departments = ['Public Works', 'Sanitation Dept', 'Safety Team', 'Traffic Division'];
          report.status = 'assigned';
          report.assignedTo = departments[Math.floor(Math.random() * departments.length)];
          
          toast.success(`Report "${report.title}" has been assigned!`);
          setHasNotifications(true);
        }
        
        return updated;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setActiveTab(userData.role === 'admin' ? 'dashboard' : 'home');
    toast.success(`Welcome, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setSelectedReport(null);
    toast.info('Logged out successfully');
  };

  const handleSubmitReport = (newReport: Report) => {
    setReports(prev => [newReport, ...prev]);
    setActiveTab('my-reports');
    toast.success('Report submitted successfully! You\'ll receive updates via push notifications.');
  };

  const handleAssignReport = (reportId: string, assignee: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'assigned', assignedTo: assignee }
        : report
    ));
    toast.success(`Report assigned to ${assignee}`);
  };

  const handleUpdateStatus = (reportId: string, status: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const updatedReport = { ...report, status: status as Report['status'] };
        
        // Add system update
        if (!updatedReport.updates) updatedReport.updates = [];
        updatedReport.updates.push({
          id: Date.now().toString(),
          message: `Status changed to ${status.replace('-', ' ')}`,
          timestamp: new Date().toISOString(),
          author: 'System',
          type: 'status_change'
        });
        
        return updatedReport;
      }
      return report;
    }));
    
    toast.success(`Report status updated to ${status.replace('-', ' ')}`);
  };

  const handleAddUpdate = (reportId: string, message: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const updatedReport = { ...report };
        if (!updatedReport.updates) updatedReport.updates = [];
        
        updatedReport.updates.push({
          id: Date.now().toString(),
          message,
          timestamp: new Date().toISOString(),
          author: user?.name || 'Anonymous',
          type: 'comment'
        });
        
        return updatedReport;
      }
      return report;
    }));
    
    toast.success('Comment added successfully');
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedReport(null);
    
    if (tab === 'reports' && user?.role === 'admin') {
      setHasNotifications(false);
    }
  };

  // Get user's reports for citizens
  const userReports = user?.role === 'citizen' 
    ? reports.filter(report => report.userId === user.id)
    : reports;

  // Show auth screen if no user
  if (!user) {
    return (
      <>
        <AuthScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  // Show report detail if selected
  if (selectedReport) {
    return (
      <>
        <ReportDetail
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
          userRole={user.role}
          onAddUpdate={handleAddUpdate}
        />
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={user.role}
          hasNotifications={hasNotifications}
        />
        <Toaster />
      </>
    );
  }

  // Show report submission
  if (activeTab === 'report') {
    return (
      <>
        <ReportSubmission
          onSubmit={handleSubmitReport}
          onBack={() => setActiveTab('home')}
        />
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={user.role}
        />
        <Toaster />
      </>
    );
  }

  // Citizen Home Screen
  const CitizenHome = () => (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1>CivicReport</h1>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>

        {/* Quick Report Button */}
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="mb-2">Report an Issue</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Help improve your community by reporting civic issues
            </p>
            <Button onClick={() => setActiveTab('report')} className="w-full">
              Start Report
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-3 text-center">
            <div className="text-lg font-medium">{userReports.length}</div>
            <div className="text-xs text-muted-foreground">My Reports</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-medium text-orange-600">
              {userReports.filter(r => r.status === 'in-progress').length}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-medium text-green-600">
              {userReports.filter(r => r.status === 'resolved').length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Updates on your submitted reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userReports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
                  onClick={() => handleReportClick(report)}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{report.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.status.replace('-', ' ')} • {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {report.priority}
                  </Badge>
                </div>
              ))}
              
              {userReports.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No reports yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Emergency?</h4>
                <p className="text-sm text-muted-foreground">For urgent issues, call directly</p>
              </div>
              <Button variant="destructive" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call 911
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Admin Home (Dashboard)
  const AdminHome = () => (
    <AdminDashboard
      reports={reports}
      onAssignReport={handleAssignReport}
      onUpdateStatus={handleUpdateStatus}
    />
  );

  // Render main content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return user.role === 'admin' ? <AdminHome /> : <CitizenHome />;
      case 'dashboard':
        return <AdminDashboard reports={reports} onAssignReport={handleAssignReport} onUpdateStatus={handleUpdateStatus} />;
      case 'map':
        return <MapView reports={user.role === 'admin' ? reports : userReports} onReportClick={handleReportClick} />;
      case 'my-reports':
        return <MyReports reports={userReports} onReportClick={handleReportClick} />;
      case 'reports':
        return <AdminDashboard reports={reports} onAssignReport={handleAssignReport} onUpdateStatus={handleUpdateStatus} />;
      case 'profile':
        return (
          <div className="min-h-screen bg-background p-4 pb-24">
            <div className="max-w-md mx-auto">
              <h1 className="mb-6">Profile</h1>
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="mb-1">{user.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                  <Badge variant="outline" className="mb-4">
                    {user.role === 'admin' ? 'Administrator' : 'Citizen'}
                  </Badge>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Preferences
                </Button>
                <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return user.role === 'admin' ? <AdminHome /> : <CitizenHome />;
    }
  };

  return (
    <>
      {renderContent()}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={user.role}
        hasNotifications={hasNotifications}
      />
      <Toaster />
    </>
  );
}

export default App;