// components/forms/SignupForm.tsx

"use client";
import React from "react";
import { useSignupFunction } from "@/utils/signupfunctions";

const styles = {
    formContainer: "flex w-xs flex-col justify-start gap-2",
    shortLabel: "min-w-1/3 text-center py-1 px-2 shadow shadow-stone-500 rounded-2xl",
    inputWrapper: "shadow shadow-stone-500 rounded-2xl w-10/12 px-2 py-1.5 items-center flex",
    input: "mx-auto w-full shadow-inner shadow-stone-500 rounded-2xl px-2 outline-none",
};
const formButton = "min-w-1/3 text-center py-1 shadow px-2 shadow-stone-500 rounded-2xl font-bold transition-all duration-150 ease-in hover:scale-105 active:scale-95"



const SignupForm = () => {
    const { loading, formData, handleChange, handleSubmit, handleFileChange } = useSignupFunction();
    return (
        <form onSubmit={handleSubmit}
            className="text-shadow-sm text-shadow-stone-500 text-sm flex flex-col gap-3 border-b pb-4"
        >
            <Field id="name" label="Full Name" value={formData.name} onChange={handleChange} classNameProp="items-start" />
            <Field id="email" label="Email" type="email" value={formData.email} onChange={handleChange} classNameProp="items-end" />
            <Field id="username" label="Username" value={formData.username} onChange={handleChange} classNameProp="items-start" />
            <Field id="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} classNameProp="items-end" />
            <Field id="mobile" label="Mobile" type="tel" value={formData.mobile} onChange={handleChange} classNameProp="items-start" />
            <Field id="password" label="Password" type="password" value={formData.password} onChange={handleChange} classNameProp="items-end" />

            {/* Profile Pic */}
            <div className={`${styles.formContainer} items-start`}>
                <label htmlFor="profilePic" className={`${styles.shortLabel}`}>Profile Pic</label>
                <div className={styles.inputWrapper}>
                    <input type="file"
                        id="profilePic"
                        className={styles.input}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="flex w-xs justify-center items-center">
                <button
                    type="submit"
                    disabled={loading}
                    className={`${loading ? "opacity-50 cursor-not-allowed" : ""} ${formButton}`}
                >
                    {loading ? "Signing Up..." : "Signup"}
                </button>
            </div>
        </form>
    )
};

type FieldProps = { id: string; label: string; value: string; classNameProp: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; };
const Field = ({ id, label, value, classNameProp, onChange, type = "text", }: FieldProps) => {
    return (
        <div className={`${styles.formContainer} ${classNameProp}`}>
            <label htmlFor={id} className={styles.shortLabel}>{label}</label>
            <div className={styles.inputWrapper}>
                <input type={type} id={id} name={id} value={value} onChange={onChange} placeholder={`Enter ${label}`} className={styles.input} />
            </div>
        </div>
    );
};

export default SignupForm
