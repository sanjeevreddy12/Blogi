"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, TextField, Paper, Typography, Container, Box, CircularProgress } from "@mui/material";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { toast, Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (result?.error) {
        toast.error("Invalid Credentials")
        if (result.error === "CredentialsSignin") {
          setError("Invalid username or password");
        } else {
          setError("An unexpected error occurred");
        }
      } else if (result?.ok) {
        router.push("/posts");
      } else {
        setError("An unexpected error occurred");
      }
    } catch (err) {
      setIsLoading(false);
      setError("An unexpected error occurred");
    }
  };

  return (
    <Container maxWidth="xs" className="min-h-screen flex items-center justify-center">
      <Paper 
        elevation={6} 
        className="p-8 w-full rounded-xl shadow-lg"
      >
        <Typography 
          variant="h4" 
          className="text-center mb-6 flex items-center justify-center text-blue-800"
        >
          <LogIn className="mr-3" size={32} />
          Login
        </Typography>
        <Toaster/>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            variant="outlined"
            className="mb-4"
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            className="mb-4"
            disabled={isLoading}
          />

          {error && (
            <Typography 
              color="error" 
              className="text-center mb-4"
            >
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LogIn />}
            disabled={isLoading}
            className="py-3 mt-2"
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </Button>
        </form>

        <Box className="text-center mt-6">
          <Link href="/register" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center">
            <UserPlus className="mr-2" size={20} />
            Don't have an account? Register
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}