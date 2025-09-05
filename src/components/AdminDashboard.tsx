import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Users, MapPin, Clock, CheckCircle, AlertTriangle, Wrench,
  TrendingUp, Calendar, Filter, Download, Bell
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  category: string;
  status: 'submitted' | 'assigned' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  ward: number;
  assignedTo?: string;
}

interface AdminDashboardProps {
  reports: Report[];
  onAssignReport: (reportId: string, assignee: string) => void;
  onUpdateStatus: (reportId: string, status: string) => void;
}

export function AdminDashboard({ reports, onAssignReport, onUpdateStatus }: AdminDashboardProps) {
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  // Mock analytics data
  const categoryData = [
    { name: 'Infrastructure', value: 35, color: '#3b82f6' },
    { name: 'Sanitation', value: 28, color: '#10b981' },
    { name: 'Safety', value: 20, color: '#f59e0b' },
    { name: 'Traffic', value: 12, color: '#ef4444' },
    { name: 'Environment', value: 5, color: '#8b5cf6' }
  ];

  const weeklyData = [
    { name: 'Mon', submitted: 12, resolved: 8 },
    { name: 'Tue', submitted: 19, resolved: 15 },
    { name: 'Wed', submitted: 15, resolved: 12 },
    { name: 'Thu', submitted: 22, resolved: 18 },
    { name: 'Fri', submitted: 25, resolved: 20 },
    { name: 'Sat', submitted: 18, resolved: 14 },
    { name: 'Sun', submitted: 14, resolved: 11 }
  ];

  const slaData = [
    { category: 'Emergency', target: 2, actual: 1.5, unit: 'hours' },
    { category: 'Infrastructure', target: 7, actual: 5, unit: 'days' },
    { category: 'Sanitation', target: 3, actual: 4, unit: 'days' },
    { category: 'Safety', target: 24, actual: 18, unit: 'hours' }
  ];

  const getStatusCount = (status: string) => {
    return reports.filter(report => report.status === status).length;
  };

  const getPriorityCount = (priority: string) => {
    return reports.filter(report => report.priority === priority).length;
  };

  const getClosureRate = () => {
    const resolved = getStatusCount('resolved');
    const total = reports.length;
    return total > 0 ? Math.round((resolved / total) * 100) : 0;
  };

  const getAverageResolutionTime = () => {
    // Mock calculation - in real app would calculate from actual timestamps
    return '4.2 days';
  };

  const handleQuickAssign = (reportId: string) => {
    const departments = ['Public Works', 'Sanitation Dept', 'Safety Team', 'Traffic Division'];
    const randomDept = departments[Math.floor(Math.random() * departments.length)];
    onAssignReport(reportId, randomDept);
  };

  const handleStatusUpdate = (reportId: string, newStatus: string) => {
    onUpdateStatus(reportId, newStatus);
  };

  const filteredReports = reports.filter(report => {
    const wardMatch = selectedWard === 'all' || report.ward.toString() === selectedWard;
    const categoryMatch = selectedCategory === 'all' || report.category === selectedCategory;
    return wardMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1>Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage civic reports across the city</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-semibold">{reports.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Closure Rate</p>
                  <p className="text-2xl font-semibold">{getClosureRate()}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                  <p className="text-2xl font-semibold">{getAverageResolutionTime()}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-semibold">{getPriorityCount('high')}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="sla">SLA Tracking</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reports by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="submitted" fill="#3b82f6" name="Submitted" />
                        <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-blue-600">{getStatusCount('submitted')}</div>
                    <div className="text-sm text-muted-foreground">Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-yellow-600">{getStatusCount('assigned')}</div>
                    <div className="text-sm text-muted-foreground">Assigned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-orange-600">{getStatusCount('in-progress')}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-green-600">{getStatusCount('resolved')}</div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Management Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <Select value={selectedWard} onValueChange={setSelectedWard}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wards</SelectItem>
                      {[1,2,3,4,5,6,7,8,9,10].map(ward => (
                        <SelectItem key={ward} value={ward.toString()}>Ward {ward}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="safety">Public Safety</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="traffic">Traffic</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Reports ({filteredReports.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{report.title}</h3>
                            <Badge variant="outline" className={
                              report.priority === 'high' ? 'text-red-600 bg-red-50' :
                              report.priority === 'medium' ? 'text-yellow-600 bg-yellow-50' :
                              'text-green-600 bg-green-50'
                            }>
                              {report.priority}
                            </Badge>
                            <Badge variant="outline">
                              {report.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
                            <span>Ward {report.ward}</span>
                            <span>{report.category}</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleQuickAssign(report.id)}>
                            Quick Assign
                          </Button>
                          <Select onValueChange={(value) => handleStatusUpdate(report.id, value)}>
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assigned">Assign</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolve</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Times by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Emergency', 'Infrastructure', 'Sanitation', 'Traffic'].map((category) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category}</span>
                          <span>{Math.random() * 5 + 1 | 0}h avg</span>
                        </div>
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Workload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Public Works', 'Sanitation', 'Traffic Division', 'Parks & Rec'].map((dept) => (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={Math.random() * 100} className="h-2 w-24" />
                          <span className="text-sm text-muted-foreground">{Math.random() * 20 + 5 | 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SLA Tracking Tab */}
          <TabsContent value="sla" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SLA Performance</CardTitle>
                <CardDescription>Service Level Agreement compliance by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {slaData.map((item) => {
                    const performance = (item.target / item.actual) * 100;
                    const isOnTrack = performance >= 90;
                    
                    return (
                      <div key={item.category}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{item.category}</h3>
                          <Badge variant={isOnTrack ? "default" : "destructive"}>
                            {performance.toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Target: {item.target} {item.unit} | Actual: {item.actual} {item.unit}
                        </div>
                        <Progress 
                          value={Math.min(performance, 100)} 
                          className={`h-2 ${isOnTrack ? '' : '[&>div]:bg-destructive'}`} 
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}