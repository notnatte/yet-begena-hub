
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Book, Briefcase, CreditCard, Shield, Trash2, CheckCircle, XCircle } from "lucide-react";
import { User } from "@/pages/Index";

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
}

interface PaymentVerification {
  id: string;
  userId: string;
  userName: string;
  courseTitle: string;
  amount: number;
  submittedDate: string;
  receiptUrl: string;
  status: "pending" | "approved" | "rejected";
}

const mockUsers = [
  { id: "1", name: "Almaz Tadesse", email: "almaz@example.com", type: "instructor", status: "active", joinDate: "2024-01-15" },
  { id: "2", name: "Dawit Mekonnen", email: "dawit@example.com", type: "normal", status: "active", joinDate: "2024-01-14" },
  { id: "3", name: "Tigist Haile", email: "tigist@example.com", type: "instructor", status: "blocked", joinDate: "2024-01-13" },
  { id: "4", name: "Samuel Bekele", email: "samuel@example.com", type: "employer", status: "active", joinDate: "2024-01-12" },
];

const mockPayments: PaymentVerification[] = [
  {
    id: "1",
    userId: "2",
    userName: "Dawit Mekonnen",
    courseTitle: "Traditional Ethiopian Cooking",
    amount: 750,
    submittedDate: "2024-01-16",
    receiptUrl: "/placeholder-receipt.jpg",
    status: "pending"
  },
  {
    id: "2",
    userId: "4",
    userName: "Samuel Bekele",
    courseTitle: "Digital Marketing for Small Business",
    amount: 1200,
    submittedDate: "2024-01-15",
    receiptUrl: "/placeholder-receipt.jpg",
    status: "pending"
  },
];

const AdminDashboard = ({ user, onBack }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [payments, setPayments] = useState(mockPayments);
  const { toast } = useToast();

  if (user.type !== "admin") {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
        <Button onClick={onBack} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  const handlePaymentVerification = (paymentId: string, status: "approved" | "rejected") => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId ? { ...payment, status } : payment
    ));
    
    toast({
      title: `Payment ${status}`,
      description: `Payment verification has been ${status}.`,
    });
  };

  const handleUserAction = (userId: string, action: "block" | "delete") => {
    toast({
      title: `User ${action}ed`,
      description: `User has been ${action}ed successfully.`,
    });
  };

  const pendingPayments = payments.filter(p => p.status === "pending");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage users, courses, and payments</p>
        </div>
        <Button onClick={onBack} variant="outline">
          ← Back to Dashboard
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">Active Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{pendingPayments.length}</div>
                <div className="text-sm text-muted-foreground">Pending Payments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">New user registered: Meron Assefa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Course uploaded: Financial Planning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Payment verification needed</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage</span>
                    <Badge className="bg-yellow-100 text-yellow-800">85% Used</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage platform users and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{user.type}</Badge>
                        <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, "block")}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(user.id, "delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Verification</CardTitle>
              <CardDescription>Review and approve payment receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{payment.courseTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.userName} • {payment.amount} ETB
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Submitted: {payment.submittedDate}
                      </div>
                      <Badge className={
                        payment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        payment.status === "approved" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                    {payment.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handlePaymentVerification(payment.id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePaymentVerification(payment.id, "rejected")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Published Courses</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Review</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Enrollments</span>
                    <span className="font-semibold">3,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Jobs</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Applications Today</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Applications</span>
                    <span className="font-semibold">1,856</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
