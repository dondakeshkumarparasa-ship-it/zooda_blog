import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from '@/lib/api';
import api from '@/lib/api';

interface AuthScreenProps {
  isRegister: boolean;
  onAuthSuccess: (type: string, message: string, token?: string, user?: any) => void;
  switchMode: () => void;
}

const AuthScreen = ({ isRegister, onAuthSuccess, switchMode }: AuthScreenProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const handleAuthSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthLoading(true);

  if (isRegister && formData.password !== formData.confirmPassword) {
    onAuthSuccess("error", "Passwords do not match.");
    setAuthLoading(false);
    return;
  }

  try {
    const payload = isRegister
      ? formData
      : { email: formData.email, password: formData.password };

    // ✅ Use the api instance (which has the correct baseURL)
    const res = await api.post(isRegister ? "/register" : "/login", payload);

    // ✅ Store token with key "token"
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    onAuthSuccess(
      "success",
      `Welcome, ${res.data.user.firstName}!`,
      res.data.token,
      res.data.user
    );
  } catch (error: any) {
    onAuthSuccess(
      "error",
      error.response?.data?.message || "Authentication failed"
    );
  } finally {
    setAuthLoading(false);
  }
};
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail || !newPassword || !confirmNewPassword) {
      onAuthSuccess('error', 'Please fill all fields');
      return;
    }

    if (newPassword.length < 6) {
      onAuthSuccess('error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      onAuthSuccess('error', 'Passwords do not match');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await axios.post('https://api.zooda.in/reset-password-direct', {
        email: forgotEmail,
        newPassword: newPassword,
      });

      if (res.data.success) {
        onAuthSuccess('success', 'Password reset successful! You can now login');
        setIsForgotPassword(false);
        setForgotEmail('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      onAuthSuccess('error', 'Failed to reset password');
    } finally {
      setAuthLoading(false);
    }
  };

  // Forgot Password Screen
  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <button
              onClick={() => setIsForgotPassword(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Login</span>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="text-primary" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter your email and create a new password
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="input-field pl-12"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="input-field pl-12"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Reset Password</>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Login/Register Screen
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-white mb-4">Zooda</h1>
            <p className="text-sidebar-muted text-lg max-w-md">
              Manage your business effortlessly with our comprehensive dashboard solution
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto"
          >
            {['Products', 'Analytics', 'Promotions', 'Content'].map((item, i) => (
              <div
                key={item}
                className="p-4 bg-sidebar-accent/50 rounded-xl text-sidebar-foreground text-sm font-medium"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Zooda</h1>
          </div>

          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {isRegister ? (
                  <UserPlus className="text-primary" size={28} />
                ) : (
                  <LogIn className="text-primary" size={28} />
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {isRegister
                  ? 'Start managing your business today'
                  : 'Sign in to access your dashboard'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input-field pl-12"
                      required
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isRegister && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-field pl-12"
                    required
                  />
                </div>
              )}

              {!isRegister && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                    {isRegister ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={switchMode}
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  {isRegister ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthScreen;
