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

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formState, setFormState] = useState(0); // 0 for login, 1 for register
  const navigate = useNavigate();

  const { handleRegister, handleLogin } = useContext(AuthContext);

  const handleAuth = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      if (formState === 0) {
        // Login
        const result = await handleLogin(username, password);
        toast({
          title: "Login Success",
          description: `Welcome ${result.name || username}!`,
        });
        // Redirect after login
        navigate("/home"); 
      } else {
        // Register
        const result = await handleRegister(name, username, password);
        toast({
          title: "Registration Success",
          description: result, // string message from backend
          duration: 4000,
        });

        // Reset form
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
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl p-6 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            {formState === 0 ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {formState === 0
              ? "Login to continue"
              : "Enter your details below to get started"}
          </CardDescription>
        </CardHeader>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={formState === 0 ? "default" : "ghost"}
            onClick={() => setFormState(0)}
            className="w-32"
          >
            Sign In
          </Button>
          <Button
            variant={formState === 1 ? "default" : "ghost"}
            onClick={() => setFormState(1)}
            className="w-32"
          >
            Sign Up
          </Button>
        </div>

        <CardContent>
          <form className="space-y-4" onSubmit={handleAuth}>
            {formState === 1 && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {formState === 0 ? "Log In" : "Register"}
            </Button>
          </form>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>

      <Toaster />
    </div>
  );
}
