import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Eye, EyeOff } from "lucide-react"; // For password toggle icon
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from "@mui/material";

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formState, setFormState] = useState(0); // 0 for login, 1 for register
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { handleRegister, handleLogin } = useContext(AuthContext);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formState === 0) {
        const result = await handleLogin(username, password);
        toast({
          title: "Login Success",
          description: `Welcome ${result.name || username}!`,
        });
        navigate("/home");
      } else {
        const result = await handleRegister(name, username, password);
        toast({
          title: "Registration Success",
          description: result,
          duration: 4000,
        });
        setUsername("");
        setPassword("");
        setName("");
        setFormState(0);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong. Try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-600 p-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <IconButton 
        onClick={() => navigate('/')} 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white'
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl p-8 shadow-2xl rounded-lg bg-white/90 backdrop-blur-sm">
        {/* Logo/Brand */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-wide">Nexcall</h1>
          <p className="text-sm text-gray-500 mt-1">Your Virtual Meeting Place</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={formState === 0 ? "default" : "ghost"}
            onClick={() => setFormState(0)}
            className="w-32 font-semibold text-lg"
          >
            Sign In
          </Button>
          <Button
            variant={formState === 1 ? "default" : "ghost"}
            onClick={() => setFormState(1)}
            className="w-32 font-semibold text-lg"
          >
            Sign Up
          </Button>
        </div>

        <CardContent>
          <form className="space-y-6" onSubmit={handleAuth}>
            {formState === 1 && (
              <div>
                <Label htmlFor="name" className="font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <Label htmlFor="username" className="font-medium">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[2.3rem] right-3 text-gray-400 hover:text-indigo-600 transition"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot password link */}
            {formState === 0 && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => toast({ title: "Feature not implemented yet" })}
                  className="text-indigo-600 hover:underline text-sm font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (formState === 0 ? "Logging In..." : "Registering...") : formState === 0 ? "Log In" : "Register"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nexcall. All rights reserved.
        </CardFooter>
      </Card>

      <Toaster />
    </div>
  );
}
