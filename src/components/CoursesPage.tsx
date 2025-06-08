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
import { Search, Book, Calendar, User as UserIcon } from "lucide-react";
import { UserProfile } from "@/pages/Index";
import PaymentDialog from "./PaymentDialog";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  level: string;
  duration: string;
  enrolled: number;
  rating: number;
}

interface CoursesPageProps {
  user: UserProfile;
  onBack: () => void;
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Traditional Ethiopian Cooking",
    description: "Learn to prepare authentic Ethiopian dishes including injera, doro wat, and vegetarian specialties.",
    instructor: "Chef Almaz Tadesse",
    price: 750,
    category: "Culinary Arts",
    level: "Beginner",
    duration: "4 weeks",
    enrolled: 234,
    rating: 4.8
  },
  {
    id: "2",
    title: "Digital Marketing for Small Business",
    description: "Complete guide to promoting your business online using social media, SEO, and content marketing.",
    instructor: "Dawit Mekonnen",
    price: 1200,
    category: "Business",
    level: "Intermediate",
    duration: "6 weeks",
    enrolled: 156,
    rating: 4.6
  },
  {
    id: "3",
    title: "Ethiopian Traditional Weaving",
    description: "Master the art of traditional Ethiopian textile weaving and create beautiful handmade fabrics.",
    instructor: "Tigist Haile",
    price: 950,
    category: "Arts & Crafts",
    level: "Beginner",
    duration: "8 weeks",
    enrolled: 89,
    rating: 4.9
  },
  {
    id: "4",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications for iOS and Android using React Native.",
    instructor: "Samuel Bekele",
    price: 2500,
    category: "Technology",
    level: "Advanced",
    duration: "12 weeks",
    enrolled: 67,
    rating: 4.7
  },
  {
    id: "5",
    title: "Coffee Farming and Processing",
    description: "Learn sustainable coffee farming techniques and processing methods from Ethiopian experts.",
    instructor: "Berhanu Girma",
    price: 1100,
    category: "Agriculture",
    level: "Intermediate",
    duration: "6 weeks",
    enrolled: 123,
    rating: 4.5
  },
  {
    id: "6",
    title: "Financial Planning for Entrepreneurs",
    description: "Essential financial skills for starting and managing a successful business in Ethiopia.",
    instructor: "Meron Assefa",
    price: 890,
    category: "Finance",
    level: "Beginner",
    duration: "5 weeks",
    enrolled: 178,
    rating: 4.4
  }
];

const CoursesPage = ({ user, onBack }: CoursesPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [activeTab, setActiveTab] = useState<"browse" | "my-courses" | "add-course">("browse");
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const { toast } = useToast();

  const categories = ["all", "Technology", "Business", "Arts & Crafts", "Culinary Arts", "Agriculture", "Finance"];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Course submitted for review",
      description: "Your course will be published after admin approval.",
    });
    setIsAddCourseOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Courses</h2>
          <p className="text-muted-foreground">Discover and learn new skills</p>
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
          Browse Courses
        </Button>
        <Button
          variant={activeTab === "my-courses" ? "default" : "ghost"}
          onClick={() => setActiveTab("my-courses")}
        >
          My Courses
        </Button>
        {user.role === "instructor" && (
          <Button
            variant={activeTab === "add-course" ? "default" : "ghost"}
            onClick={() => setActiveTab("add-course")}
          >
            Add Course
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
                      placeholder="Search courses..."
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
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} user={user} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "my-courses" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Courses</CardTitle>
              <CardDescription>Track your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No courses enrolled yet. Browse courses to get started!
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "add-course" && user.role === "instructor" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Course</CardTitle>
              <CardDescription>Share your knowledge with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input id="title" placeholder="Enter course title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETB)</Label>
                    <Input id="price" type="number" placeholder="0" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.slice(1).map(level => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materials">Course Materials (PDF)</Label>
                  <Input id="materials" type="file" accept=".pdf" required />
                  <p className="text-sm text-muted-foreground">Upload course materials as PDF file</p>
                </div>
                <Button type="submit" className="w-full">
                  Submit Course for Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

interface CourseCardProps {
  course: Course;
  user: UserProfile;
}

const CourseCard = ({ course, user }: CourseCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <span>{course.instructor}</span>
            </div>
          </div>
          <Badge variant="secondary">{course.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Book className="h-4 w-4" />
            <span>{course.enrolled} enrolled</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">
            {course.price} ETB
          </div>
          <div className="text-yellow-500">
            ⭐ {course.rating}
          </div>
        </div>

        <PaymentDialog course={course} user={user} />
      </CardContent>
    </Card>
  );
};

export default CoursesPage;
