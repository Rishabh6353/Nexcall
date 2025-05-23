import React, { useState } from "react";
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

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState("");

  const [formState, setFormState] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl p-6 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details below to get started
          </CardDescription>
        </CardHeader>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={formState === 0 ? "default" : "ghost"}
            onClick={() => {
              setFormState(0);
            }}
            className="w-32"
          >
            Sign In
          </Button>
          <Button
            variant={formState === 1 ? "default" : "ghost"}
            onClick={() => {
              setFormState(1);
            }}
            className="w-32"
          >
            Sign Up
          </Button>
        </div>

        <CardContent>
          <form className="space-y-4">

            {/* condition to toggle b/w login signup */}
            {formState === 1? 
            <div>

               <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
            </div> : <></>
            }
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              />
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button className="w-full">Sign In</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
