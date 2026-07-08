// tattoomi/components/forms/SigninForm.tsx
"use client";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

const styles = {
  formContainer: "relative w-10/12 text-shadow-sm text-shadow-stone-500 flex sm:flex-row flex-col justify-start sm:items-start gap-2 p-2",
  shortLabel: "relative px-5 py-0.5 shadow rounded-2xl shadow-stone-500 sm:text-end text-start",
  input: "relative outline-none shadow-inner shadow-stone-500 rounded-2xl px-2 w-full text-shadow-2xs text-shadow-stone-500",
  inputWrapper: "relative px-5 py-1 shadow rounded-2xl shadow-stone-500 flex gap-4",
};

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

  const handleGoogleSignUp = async () => {
    const loadingToast = toast.loading("Redirecting to Google...");
    try {
      setLoading(true);


      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });

      toast.dismiss(loadingToast);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Google Signin Failed");
    } finally {
      setLoading(false);
    }
  };

  const buttonMeta = [
    { Icon: FcGoogle, Action: handleGoogleSignUp, text: "Google" },
  ]

  const buttonStylesClasses = "relative max-w-xs min-w-54 tracking-widest shadow-stone-500 py-2 rounded-2xl flex justify-center items-center gap-1.5 transition-all duration-200 ease-in shadow hover:scale-105 active:scale-95 active:shadow-inner";

  return (
    <div className="relative w-full text-sm flex flex-col justify-center items-center gap-6 my-2">
      <p className='relative text-xl'>Sign into your account</p>
      <form onSubmit={handleSubmit}
        className="relative w-11/12 max-w-2xl mx-auto flex flex-col justify-center items-center border-b">
        {/* Email */}
        <div className={`${styles.formContainer} items-start`}>

          <label
            htmlFor="email"
            className={styles.shortLabel}
          >
            Email
          </label>

          <div className={styles.inputWrapper}>

            <input
              required
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Email'
              className={styles.input}
            />

          </div>

        </div>

        {/* Password */}
        <div className={`${styles.formContainer} items-end`}>

          <label
            htmlFor="password"
            className={`${styles.shortLabel} `}
          >
            Password
          </label>

          <div className={styles.inputWrapper}>

            <input
              required
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter Password'
              className={styles.input}
            />

          </div>

        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`${loading ? "opacity-50 cursor-not-allowed" : ""} relative mb-2 max-w-2xs rounded-2xl shadow shadow-stone-500 text-shadow-sm text-shadow-stone-500 py-1 px-5 transition-all duration-150 ease-in hover:scale-105 active:scale-95`}
        >
          {loading ? "Signing In..." : "Signin"}
        </button>
      </form>

      <p>Forgot Password? <Link href="/resetpassword" className="underline italic">Click here</Link></p>

      <p>or continue with</p>
      {buttonMeta.map(({ Icon, Action, text }, index) => (
        <button
          key={index}
          onClick={Action}
          type="submit"
          aria-label={`Sign in with ${text}`}
          className={buttonStylesClasses}
        >
          {text} <Icon className="text-xl" />
        </button>
      ))}
      <p className='relative w-full px-8'>Are you an Artist? <Link href="/signup" className="underline italic">Click here</Link> to create your Artist Account now.</p>
    </div>
  )
}

export default SigninForm