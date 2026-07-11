// components/forms/SigninForm.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

const formContainer = "flex w-xs flex-col justify-start gap-2"
const formLabel = "min-w-1/3 text-center py-1 px-2 shadow shadow-stone-500 rounded-2xl"
const inputWrapper = "shadow shadow-stone-500 rounded-2xl w-10/12 px-2 py-1.5 items-center flex"
const formInput = "mx-auto w-full shadow-inner shadow-stone-500 rounded-2xl px-2 outline-none"
const formButton = "min-w-1/3 text-center py-1 shadow px-2 shadow-stone-500 rounded-2xl font-bold transition-all duration-150 ease-in hover:scale-105 active:scale-95"

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/profile",
        rememberMe: true,
      });

      if (error) {
        toast.dismiss(loadingToast);
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Signed in successfully!");

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (

    <form onSubmit={handleSubmit}
      className="text-shadow-sm text-shadow-stone-500 text-sm flex flex-col gap-5 border-b pb-4"
    >

      <div className={`${formContainer} items-start`}>
        <label htmlFor="email" className={formLabel}>Email</label>
        <div className={inputWrapper}>
          <input required type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' className={formInput} />
        </div>
      </div>


      {/* Password */}
      <div className={`${formContainer} items-end`}>
        <label htmlFor="password" className={formLabel}>Password</label>
        <div className={inputWrapper}>
          <input required type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' className={formInput} />
        </div>

      </div>

      {/* Submit */}
      <div className="flex w-xs justify-center items-center">
        <button type="submit" disabled={loading} className={`${loading ? "opacity-50 cursor-not-allowed" : ""} ${formButton}`}
        >
          {loading ? "Signing In..." : "Signin"}
        </button>
      </div>
    </form>
  )
}

export default SigninForm