
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";

export type UserType = "normal" | "instructor" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Toaster />
      {!currentUser ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
