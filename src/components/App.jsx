import React from "react"
import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Shield, Lock, Mail, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import "./Auth.css"

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Confirm password for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Handle authentication logic here
    }, 1500)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: "", width: "0%" }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 1) return { strength: "weak", width: "33%" }
    if (strength <= 2) return { strength: "medium", width: "66%" }
    return { strength: "strong", width: "100%" }
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="auth-logo">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SecureAuth</h1>
              <p className="text-xs text-slate-500">Enterprise Authentication</p>
            </div>
          </div>
          <div className="secure-indicator">
            <Lock size={14} />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="auth-container fade-in">
          {/* Logo */}
          <div className="auth-header">
            <div className="auth-logo mx-auto">
              <Shield size={32} />
            </div>
            <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="auth-subtitle">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to get started with SecureAuth"}
            </p>
          </div>

          {/* Security Notice */}
          <div className="alert alert-info mb-6">
            <Shield size={18} className="flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong>Protected by enterprise-grade security.</strong> Your data is encrypted
              and never shared with third parties.
            </div>
          </div>

          {/* Auth Form */}
          <Form onSubmit={handleSubmit}>
            {/* Email Field */}
            <Form.Group className="input-group">
              <Form.Label className="input-label">
                Email Address <span className="text-auth-error">*</span>
              </Form.Label>
              <div className="relative">
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                  isValid={!errors.email && formData.email}
                  placeholder="you@company.com"
                  className={`auth-input ${errors.email ? "error" : ""} ${!errors.email && formData.email ? "success" : ""}`}
                />
                {!errors.email && formData.email && (
                  <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-auth-success" />
                )}
              </div>
              {errors.email && (
                <div className="validation-message error flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.email}
                </div>
              )}
              {!isLogin && (
                <Form.Text className="input-hint">
                  We'll send a verification email to confirm your account.
                </Form.Text>
              )}
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="input-group">
              <Form.Label className="input-label">
                Password <span className="text-auth-error">*</span>
              </Form.Label>
              <div className="relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  isInvalid={!!errors.password}
                  placeholder="••••••••"
                  className={`auth-input pr-12 ${errors.password ? "error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="validation-message error flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {errors.password}
                </div>
              )}

              {/* Password Strength Meter */}
              {!isLogin && formData.password && (
                <>
                  <div className="strength-meter">
                    <div
                      className={`strength-meter-fill ${getPasswordStrength(formData.password).strength}`}
                      style={{ width: getPasswordStrength(formData.password).width }}
                    />
                  </div>
                  <Form.Text className="input-hint">
                    Password strength:{" "}
                    <span className={`font-semibold ${
                      getPasswordStrength(formData.password).strength === "weak"
                        ? "text-auth-error"
                        : getPasswordStrength(formData.password).strength === "medium"
                        ? "text-auth-warning"
                        : "text-auth-success"
                    }`}>
                      {getPasswordStrength(formData.password).strength}
                    </span>
                  </Form.Text>
                </>
              )}
            </Form.Group>

            {/* Confirm Password (Signup only) */}
            {!isLogin && (
              <Form.Group className="input-group">
                <Form.Label className="input-label">
                  Confirm Password <span className="text-auth-error">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  isInvalid={!!errors.confirmPassword}
                  placeholder="••••••••"
                  className={`auth-input ${errors.confirmPassword ? "error" : ""}`}
                />
                {errors.confirmPassword && (
                  <div className="validation-message error flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {errors.confirmPassword}
                  </div>
                )}
              </Form.Group>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Form.Check
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                label="Remember me for 30 days"
                className="auth-checkbox"
              />
              {isLogin && (
                <Button variant="link" className="btn-link p-0">
                  Forgot password?
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="btn-auth-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner mr-2"></span>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </Form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-content">Or continue with</span>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Toggle Form */}
          <div className="auth-footer">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin)
                setErrors({})
              }}
              className="btn-link p-0 ml-1"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div>

          {/* Privacy Notice */}
          <p className="privacy-notice">
            By continuing, you agree to our{" "}
            <a href="#" className="text-auth-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-auth-primary hover:underline">Privacy Policy</a>.
            {" "}We'll occasionally send you account-related emails.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-500">
        <p className="text-blue-400 font-bold uppercase tracking-[0.3em] mb-2">Made by MK — Musharraf Kazi</p>
        <p>© 2026 SecureAuth. All rights reserved.</p>
        <p className="mt-1">Enterprise-grade authentication powered by Firebase</p>
      </footer>
    </div>
  )
}

export default App
