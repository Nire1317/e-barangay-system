import { useState } from "react";
import { supabase } from "../services/supabaseClient";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    console.log("Attempting auth with:", {
      email,
      passwordLength: password.length,
    });

    try {
      if (isSignUp) {
        console.log("Signing up...");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: "resident",
            },
          },
        });
        console.log("Sign up response:", { data, error });
        if (error) throw error;
        setMessage("Check your email for confirmation link.");
      } else {
        console.log("Signing in...");
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        console.log("Sign in response:", { data, error });
        if (error) throw error;
        setMessage("Logged in successfully!");
      }
    } catch (err) {
      console.error("Full error object:", err);
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  const testConnection = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log("Session:", data);
    console.log("Error:", error);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    isSignUp,
    message,
    loading,
    handleAuth,
    toggleSignUp,
    testConnection,
  };
};
