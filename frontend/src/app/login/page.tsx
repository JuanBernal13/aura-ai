"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const data = await authService.token(formData);
      localStorage.setItem("aura_token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-xl shadow-blue-500/20 mb-6">
            A
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to Aura</h1>
          <p className="text-slate-500 mt-2 font-medium">Access your precision hiring pipeline</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Work Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium text-slate-900"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium text-slate-900"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs font-bold text-center bg-red-50 border border-red-100 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[13px] text-slate-400 font-medium">
              Don't have an account? <span className="text-blue-600 font-bold hover:underline cursor-pointer">Request access</span>
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-300">
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">Operations</span>
          <span className="hover:text-slate-400 cursor-pointer transition-colors">System</span>
        </div>
      </div>
    </div>
  );
}
