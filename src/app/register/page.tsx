"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft, User, Mail, Phone, Lock } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api-client";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  agreedToTerms: false,
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9+\s-]{7,15}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid mobile number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        role: "owner",
      });
      router.push("/questionaree");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#5b4ef9] to-[#4a3ee0]">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4a3ee0]/40 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white mb-6 hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-[#5b4ef9] p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-white">KarobarOne</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/70">Sign up to start building your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              icon={<User className="w-5 h-5 text-white/60" />}
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(v) => updateField("name", v)}
              error={errors.name}
            />
            <Field
              icon={<Mail className="w-5 h-5 text-white/60" />}
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(v) => updateField("email", v)}
              error={errors.email}
            />
            <Field
              icon={<Phone className="w-5 h-5 text-white/60" />}
              label="Mobile Number"
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={(v) => updateField("mobile", v)}
              error={errors.mobile}
            />
            <Field
              icon={<Lock className="w-5 h-5 text-white/60" />}
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(v) => updateField("password", v)}
              error={errors.password}
            />
            <Field
              icon={<Lock className="w-5 h-5 text-white/60" />}
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(v) => updateField("confirmPassword", v)}
              error={errors.confirmPassword}
            />

            <label className="flex items-start gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="underline hover:text-white">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-white">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreedToTerms && <p className="text-red-200 text-xs">{errors.agreedToTerms}</p>}

            {submitError && (
              <p className="bg-red-500/20 border border-red-300/40 text-red-100 text-sm rounded-lg px-4 py-2">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-[#5b4ef9] py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
}: {
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-white/80 mb-2 text-sm">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${
            icon ? "pl-12" : "pl-4"
          } pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50`}
        />
      </div>
      {error && <p className="text-red-200 text-xs mt-1">{error}</p>}
    </div>
  );
}
