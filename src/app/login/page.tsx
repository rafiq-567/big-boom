"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  const fillDemo = (type: "user" | "admin") => {
    if (type === "admin") {
      setEmail("admin@example.com");
      setPassword("123456");
    } else {
      setEmail("user@example.com");
      setPassword("123456");
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-yellow-600">
            BigBoom
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-yellow-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {/* Demo Buttons */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider">
              Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemo("user")}
                className="flex flex-col items-center py-3 px-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition"
              >
                <span className="text-lg mb-0.5">👤</span>
                <span className="text-xs font-semibold text-gray-700">
                  User Demo
                </span>
                <span className="text-xs text-gray-400">
                  user@example.com
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex flex-col items-center py-3 px-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition"
              >
                <span className="text-lg mb-0.5">🛡️</span>
                <span className="text-xs font-semibold text-gray-700">
                  Admin Demo
                </span>
                <span className="text-xs text-gray-400">
                  admin@example.com
                </span>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">
              or continue with email
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">
                or
              </div>
            </div>

            <button
              onClick={async () => {
                setGoogleLoading(true);
                await signIn("google", { callbackUrl: "/" });
              }}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border rounded-xl py-3 hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}