
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, Clock, Building } from "lucide-react";
import { User } from "@/pages/Index";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  category: string;
  postedDate: string;
  deadline: string;
}

interface JobsPageProps {
  user: User;
  onBack: () => void;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Junior Software Developer",
    company: "Tech Solutions Ethiopia",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "15,000 - 25,000 ETB",
    description: "We are looking for a passionate Junior Software Developer to join our growing team. You will work on exciting projects and gain valuable experience in modern web technologies.",
    requirements: ["Bachelor's degree in Computer Science or related field", "Knowledge of JavaScript, React, or similar frameworks", "Strong problem-solving skills", "Good communication skills"],
    category: "Technology",
    postedDate: "2024-01-15",
    deadline: "2024-02-15"
  },
  {
    id: "2",
    title: "Marketing Coordinator",
    company: "Green Coffee Exports",
    location: "Jimma",
    type: "Full-time",
    salary: "12,000 - 18,000 ETB",
    description: "Join our marketing team to promote Ethiopian coffee internationally. This role involves digital marketing, content creation, and relationship building with international clients.",
    requirements: ["Degree in Marketing, Business, or related field", "Experience with social media marketing", "Excellent English communication skills", "Creative thinking and analytical skills"],
    category: "Marketing",
    postedDate: "2024-01-14",
    deadline: "2024-02-10"
  },
  {
    id: "3",
    title: "Traditional Craft Instructor",
    company: "Cultural Heritage Center",
    location: "Bahir Dar",
    type: "Part-time",
    salary: "8,000 - 12,000 ETB",
    description: "Teach traditional Ethiopian crafts including weaving, pottery, and basketry to local and international students. Share your cultural knowledge and preserve traditional skills.",
    requirements: ["Expertise in traditional Ethiopian crafts", "Teaching or training experience preferred", "Passion for cultural preservation", "Ability to work with diverse groups"],
    category: "Education",
    postedDate: "2024-01-13",
    deadline: "2024-02-05"
  },
  {
    id: "4",
    title: "Agricultural Extension Agent",
    company: "Ministry of Agriculture",
    location: "Hawassa",
    type: "Full-time",
    salary: "10,000 - 15,000 ETB",
    description: "Work directly with farmers to improve agricultural practices, introduce new technologies, and increase crop yields. Help implement sustainable farming methods.",
    requirements: ["Degree in Agriculture or related field", "Experience working with rural communities", "Knowledge of sustainable farming practices", "Valid driver's license"],
    category: "Agriculture",
    postedDate: "2024-01-12",
    deadline: "2024-02-12"
  },
  {
    id: "5",
    title: "Customer Service Representative",
    company: "Ethiopian Airlines",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "8,000 - 13,000 ETB",
    description: "Provide excellent customer service to airline passengers. Handle reservations, check-ins, and resolve customer inquiries with professionalism and efficiency.",
    requirements: ["High school diploma or equivalent", "Excellent communication skills in English and Amharic", "Customer service experience preferred", "Professional appearance and demeanor"],
    category: "Customer Service",
    postedDate: "2024-01-11",
    deadline: "2024-02-08"
  },
  {
    id: "6",
    title: "Financial Analyst",
    company: "Development Bank of Ethiopia",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "20,000 - 30,000 ETB",
    description: "Analyze financial data, prepare reports, and support decision-making processes. Work with various departments to assess project viability and financial performance.",
    requirements: ["Degree in Finance, Economics, or Accounting", "2+ years of financial analysis experience", "Proficiency in Excel and financial software", "Strong analytical and presentation skills"],
    category: "Finance",
    postedDate: "2024-01-10",
    deadline: "2024-02-07"
  }
];

const JobsPage = ({ user, onBack }: JobsPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [activeTab, setActiveTab] = useState<"browse" | "applied" | "post-job">("browse");
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const { toast } = useToast();

  const categories = ["all", "Technology", "Marketing", "Education", "Agriculture", "Customer Service", "Finance"];
  const locations = ["all", "Addis Ababa", "Jimma", "Bahir Dar", "Hawassa", "Dire Dawa", "Mekelle"];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Job posted successfully",
      description: "Your job posting is now live and visible to job seekers.",
    });
    setIsPostJobOpen(false);
  };

  const handleApplyJob = (jobId: string) => {
    toast({
      title: "Application submitted",
      description: "Your job application has been sent to the employer.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Jobs</h2>
          <p className="text-muted-foreground">Find your next opportunity</p>
        </div>
        <Button onClick={onBack} variant="outline">
          ← Back to Dashboard
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === "browse" ? "default" : "ghost"}
          onClick={() => setActiveTab("browse")}
        >
          Browse Jobs
        </Button>
        <Button
          variant={activeTab === "applied" ? "default" : "ghost"}
          onClick={() => setActiveTab("applied")}
        >
          Applied Jobs
        </Button>
        {user.type === "employer" && (
          <Button
            variant={activeTab === "post-job" ? "default" : "ghost"}
            onClick={() => setActiveTab("post-job")}
          >
            Post a Job
          </Button>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onApply={handleApplyJob} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "applied" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Job Applications</CardTitle>
              <CardDescription>Track your application status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No applications yet. Browse jobs to get started!
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "post-job" && user.type === "employer" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post a New Job</CardTitle>
              <CardDescription>Find the right candidates for your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="Enter job title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Your company name" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.slice(1).map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-type">Job Type</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range (ETB)</Label>
                    <Input id="salary" placeholder="e.g., 15,000 - 25,000" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role and responsibilities..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List the qualifications and skills required..."
                    className="min-h-[80px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input id="deadline" type="date" required />
                </div>
                <Button type="submit" className="w-full">
                  Post Job
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const JobCard = ({ job, onApply }: JobCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary">{job.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-3">{job.description}</CardDescription>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Key Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {job.requirements.slice(0, 2).map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-semibold text-primary">
            {job.salary}
          </div>
          <Button onClick={() => onApply(job.id)}>
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsPage;
