import { useState, useEffect } from "react";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

// Mock auth hook for demo
// const useAuth = () => ({
//   signIn: async (email, password) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return { error: null };
//   },
//   signUp: async (email, password, name) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return { error: null };
//   },
//   user: null,
// });

// Enhanced Input Field with focus states and validation feedback
function InputField({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  disabled,
  delay,
  placeholder,
  minLength,
  error,
  showPasswordToggle,
  onTogglePassword,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [actualType, setActualType] = useState(type);

  const handleTogglePassword = () => {
    setActualType(actualType === "password" ? "text" : "password");
    onTogglePassword?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            isFocused
              ? "text-blue-600"
              : error
              ? "text-red-500"
              : "text-slate-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={actualType}
          placeholder={placeholder}
          className={`w-full pl-11 pr-${
            showPasswordToggle ? "12" : "4"
          } py-3 border rounded-lg transition-all duration-200 outline-none bg-white
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : isFocused
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-slate-200 hover:border-slate-300"
            }
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            text-slate-900 placeholder:text-slate-400
          `}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required
          minLength={minLength}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
          >
            {actualType === "password" ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-red-600 flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Redesigned Hero Panel
function HeroPanel({ isSignUp }) {
  const title = isSignUp ? "Start Your Journey" : "Welcome Back";
  const subtitle = isSignUp
    ? "Join our community and access essential barangay services at your fingertips."
    : "Sign in to continue accessing your barangay services and manage your documents.";

  const features = isSignUp
    ? [
        { text: "Quick & Easy Registration", icon: CheckCircle },
        { text: "Instant Email Verification", icon: CheckCircle },
        { text: "Immediate Service Access", icon: CheckCircle },
      ]
    : [
        { text: "24/7 Available Services", icon: CheckCircle },
        { text: "Fast Document Processing", icon: CheckCircle },
        { text: "Secure & Encrypted", icon: CheckCircle },
      ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isSignUp ? "signup" : "signin"}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div>
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
              <span className="text-white text-sm font-semibold">
                {isSignUp ? "🚀 Get Started" : "👋 Hello Again"}
              </span>
            </div>
          </motion.div>

          <h2 className="text-5xl font-bold mb-4 leading-tight text-white">
            {title}
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed font-light">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex items-start gap-3 group"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 group-hover:bg-white/30 transition-colors">
                <feature.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-50 font-medium text-base leading-relaxed">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-8 border-t border-white/20"
        >
          <p className="text-blue-100 text-sm">
            Trusted by thousands of residents for secure and reliable barangay
            services.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Enhanced Form Header
function FormHeader({ isSignUp }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isSignUp ? "signup-header" : "signin-header"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-slate-500 text-sm">
          {isSignUp
            ? "Please fill in your details to get started"
            : "Enter your credentials to access your account"}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

// Alert Component
function Alert({ variant = "default", children }) {
  const variants = {
    default: "bg-slate-50 text-slate-800 border-slate-200",
    error: "bg-red-50 text-red-800 border-red-200",
    success: "bg-green-50 text-green-800 border-green-200",
  };

  const icons = {
    default: CheckCircle,
    error: XCircle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className={`flex items-start gap-3 p-4 rounded-lg border ${variants[variant]}`}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0" />
      <div className="text-sm font-medium leading-relaxed">{children}</div>
    </motion.div>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn, signUp, user } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (isSignUp && !fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      const action = isSignUp
        ? signUp(email, password, fullName)
        : signIn(email, password);
      const { error } = await action;

      if (error) {
        if (error.message.includes("already registered"))
          return setMessage("This email is already registered.");
        if (error.message.includes("Invalid login credentials"))
          return setMessage("Invalid email or password.");
        if (error.message.includes("Email not confirmed"))
          return setMessage("Please verify your email to continue.");
        return setMessage(error.message);
      }

      setMessage(
        isSignUp
          ? "Account created successfully! Please check your email for verification."
          : "Welcome back! Redirecting to dashboard..."
      );
    } catch (err) {
      setMessage(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
    setErrors({});
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const isError =
    message &&
    (message.includes("error") ||
      message.includes("Invalid") ||
      message.includes("already registered"));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/50 flex flex-col md:flex-row"
        >
          {/* LEFT PANEL */}
          <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 p-12 md:w-5/12 relative overflow-hidden flex flex-col justify-center">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative z-10">
              <HeroPanel isSignUp={isSignUp} />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-12 md:w-7/12 bg-white flex flex-col justify-center">
            <FormHeader isSignUp={isSignUp} />

            <div className="space-y-5">
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InputField
                      label="Full Name"
                      icon={User}
                      type="text"
                      value={fullName}
                      placeholder="John Doe"
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName)
                          setErrors({ ...errors, fullName: null });
                      }}
                      disabled={loading}
                      error={errors.fullName}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputField
                label="Email Address"
                icon={Mail}
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                disabled={loading}
                delay={0.1}
                error={errors.email}
              />

              <InputField
                label="Password"
                icon={Lock}
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                disabled={loading}
                minLength={6}
                delay={0.2}
                error={errors.password}
                showPasswordToggle
              />

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                onClick={handleAuth}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 mt-6"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Message Alert */}
              <AnimatePresence>
                {message && (
                  <Alert variant={isError ? "error" : "success"}>
                    {message}
                  </Alert>
                )}
              </AnimatePresence>

              {/* Switch CTA */}
              <motion.div
                className="text-center pt-6 border-t border-slate-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-slate-600 text-sm">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={toggleSignUp}
                    disabled={loading}
                    className="text-blue-600 font-semibold ml-1.5 hover:underline disabled:opacity-50"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-slate-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          © 2024 Barangay Online Services System. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}
