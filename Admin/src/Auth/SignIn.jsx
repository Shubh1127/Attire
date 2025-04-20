import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Footer from "@/Home/Footer";
import { useOwner } from "../Context/OwnerContext"; // Import useOwner
import { FcGoogle } from "react-icons/fc";
import { ShoppingBag } from "lucide-react";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

export default function AuthTabs() {
  const { registerWithEmail, loginWithEmail, registerWithGoogle } = useOwner(); // Use OwnerContext
  const [activeTab, setActiveTab] = useState("register");
  const [name, setName] = useState(""); // Add state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await registerWithEmail(name, email, password); // Send name along with email and password
      navigate("/dashboard"); // Navigate to dashboard after successful registration
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/dashboard"); 
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await registerWithGoogle(); // Await the response from registerWithGoogle
      if (user) {
        navigate("/dashboard"); // Navigate to dashboard only if the user is created
      } else {
        console.log("Google sign-in failed or user already exists.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl flex gap-1 font-bold text-gray-900">
            <ShoppingBag className="h-8 w-8 text-gray-900" />
            ATTIRE
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow bg-white flex flex-col items-center justify-center p-4">
        {/* Centered Heading */}
        <div className="text-center mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-900 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Sign In to Your Account</h2>
        </div>

        <Card className="w-full p-3 max-w-md shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="cursor-pointer" value="register">
                Register
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="login">
                Login
              </TabsTrigger>
            </TabsList>

            {/* Register Tab */}
            <TabsContent value="register">
              <CardContent className="space-y-4 py-6">
                <h2 className="text-xl font-semibold text-center">Create an account</h2>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"} // Toggle input type
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                      className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff  size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    Sign Up
                  </Button>
                </form>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md shadow hover:bg-gray-200"
                  >
                    <FcGoogle size={20} />
                    <span>Sign up with Google</span>
                  </button>
                </div>
              </CardContent>
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardContent className="space-y-4 py-6">
                <h2 className="text-xl font-semibold text-center">Welcome back</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"} // Toggle input type
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    Login
                  </Button>
                </form>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-md shadow hover:bg-gray-200"
                  >
                    <FcGoogle size={20} />
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}