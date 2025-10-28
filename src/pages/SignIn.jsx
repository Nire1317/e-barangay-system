import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user } = useAuth(); // Added 'user' here
  const navigate = useNavigate();

  // Auto-navigate when user logs in
  useEffect(() => {
    if (user && !loading) {
      const redirectTo = user.role === "official" ? "/admin" : "/dashboard";
      navigate(redirectTo);
    }
  }, [user, loading, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password, fullName);

        if (error) {
          // More specific error messages
          if (error.message.includes("already registered")) {
            setMessage("This email is already registered. Please sign in.");
          } else {
            setMessage(`Sign up error: ${error.message}`);
          }
        } else {
          setMessage("Account created! Please check your email to verify.");
        }
      } else {
        const { data, error } = await signIn(email, password);

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setMessage("Invalid email or password. Please try again.");
          } else if (error.message.includes("Email not confirmed")) {
            setMessage("Please verify your email before signing in.");
          } else {
            setMessage(`Sign in error: ${error.message}`);
          }
        } else {
          setMessage("Signed in successfully!");
          // Navigation will happen automatically via useEffect
        }
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleAuth}
        className="bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>

        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-3 p-2 border rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <p className="text-center mt-3 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            onClick={toggleSignUp}
            className="text-blue-600 ml-1"
            disabled={loading}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>

        {message && (
          <p
            className={`mt-3 text-center text-sm ${
              message.includes("error") || message.includes("Invalid")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
