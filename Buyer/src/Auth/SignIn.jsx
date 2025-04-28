import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useBuyerContext } from "../Context/BuyerContext";
import { FcGoogle } from "react-icons/fc";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../Context/ThemeContext";

export default function AuthTabs() {
  const {
    registerWithEmail,
    loginWithEmail,
    registerWithGoogle,
  } = useBuyerContext();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const resp = await registerWithEmail(name, email, password, phoneNumber);
      if (resp) {
        alert("Registration successful! Please login now.");
        setName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
        setActiveTab("login"); // Switch to login tab
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      
      const resp = await loginWithEmail(email, password);
      if (resp) {
        navigate("/");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await registerWithGoogle();
      if (user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-navy-900" : "bg-gray-100"
      }`}
    >
      {/* Main Content */}
      <div
        className={`flex-grow flex flex-col items-center justify-center p-4 ${
          theme === "dark" ? "bg-navy-900" : "bg-white"
        }`}
      >
        {/* Centered Heading */}
        <div className="text-center sm:mt-12 mb-2">
          <ShoppingBag
            className={`h-12 w-12 mx-auto ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          />
          <h2
            className={`text-2xl font-bold mt-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Sign In to Your Account
          </h2>
        </div>

        <Card
          className={`w-full p-3 max-w-md shadow-xl ${
            theme === "dark" ? "bg-navy-800 border-navy-700" : ""
          }`}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className={`grid w-full grid-cols-2 ${
                theme === "dark" ? "bg-navy-700" : "bg-gray-100"
              }`}
            >
              <TabsTrigger
                value="register"
                className={`cursor-pointer ${
                  theme === "dark"
                    ? "data-[state=active]:bg-navy-600 data-[state=active]:text-white"
                    : ""
                }`}
              >
                Register
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className={`cursor-pointer ${
                  theme === "dark"
                    ? "data-[state=active]:bg-navy-600 data-[state=active]:text-white"
                    : ""
                }`}
              >
                Login
              </TabsTrigger>
            </TabsList>

            {/* Register Tab */}
            <TabsContent value="register" className="w-full">
              <CardContent className="space-y-4 py-6 w-full">
                <h2
                  className={`text-xl font-semibold text-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Create an account
                </h2>
                <form onSubmit={handleSignUp} className="space-y-4 w-full">
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="name"
                      className={theme === "dark" ? "text-gray-300" : ""}
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      inputClassName={`w-full  ${
                        theme === "dark"
                          ? "bg-navy-700 border-navy-600 text-white"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className={theme === "dark" ? "text-gray-300" : ""}
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="123-456-7890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      inputClassName={`w-full  ${
                        theme === "dark"
                          ? "bg-navy-700 border-navy-600 text-white"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className={theme === "dark" ? "text-gray-300" : ""}
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      inputClassName={`w-full  ${
                        theme === "dark"
                          ? "bg-navy-700 border-navy-600 text-white"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label
                      htmlFor="password"
                      className={theme === "dark" ? "text-gray-300" : ""}
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      inputClassName={`w-full  ${
                        theme === "dark"
                          ? "bg-navy-700 border-navy-600 text-white"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-7 ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-amber-400"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    Sign Up
                  </Button>
                </form>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={handleGoogleSignIn}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow ${
                      theme === "dark"
                        ? "bg-navy-700 hover:bg-navy-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
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
                <h2
                  className={`text-xl font-semibold text-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Welcome back
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className={theme === "dark" ? "text-gray-300" : ""}
                    >
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      inputClassName={`w-full  ${
                        theme === "dark"
                          ? "bg-navy-700 border-navy-600 text-white"
                          : ""
                      }`}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label
                      htmlFor="login-password"
                      className={theme === "dark" ? "text-gray-300" : ""}
                    >
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      inputClassName={`w-full  ${
                        theme === "dark"
                          ? "bg-navy-700 border-navy-600 text-white"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-6 ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-amber-400"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow ${
                      theme === "dark"
                        ? "bg-navy-700 hover:bg-navy-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
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
    </div>
  );
}