"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import md5 from "md5";
import { useRouter } from "next/navigation";

export default function Home() {
  const [branchId, setBranchId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const branch_id = branchId;
    const password_hash = md5(password);
    // fetch(`/api/login?${new URLSearchParams({ branch_id, password_hash })}`)
    fetch(`http://localhost:8000/api/login?${new URLSearchParams({ branch_id, password_hash })}`)
      .then((res) => res.json())
      .then((res) => {  
        if (res.error) {
          alert(res.message);
        } else {
          const { token, data: branch } = res;
          localStorage.setItem("token", token);
          localStorage.setItem("branch", JSON.stringify(branch));
          router.push(`/branch/${branch.branch_id}/${branch.first_name}`);
        }
      })
      .catch((err) => {
        console.log("ERROR", { err });
      })
      .finally(() => {
        setLoading(false);
      });
    console.log({ branch_id, password_hash });
  };
  return (
    <div className="flex flex-col h-[100vh] bg-slate-100 justify-center items-center">
      <form
        className="p-8 m-4 bg-white flex flex-col w-4/5 sm:w-1/2 justify-center items-center rounded-lg"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl sm:text-4xl">Login to your branch</h1>
        <input
          className="px-4 py-2 w-1/2 mt-2 outline-none border border-slate-200 rounded-md"
          placeholder="Branch ID"
          required
          aria-required
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
        />
        <input
          className="px-4 py-2 w-1/2 mt-2 outline-none border border-slate-200 rounded-md"
          placeholder="password"
          type="password"
          required
          aria-required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="px-4 py-2 w-1/2 mt-2 outline-none border border-slate-200 rounded-md hover:bg-blue-500 hover:text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in.." : "Login"}
        </button>
        <Link href="#" className="text-blue-500 hover:underline mt-2">
          Unable to login? Contact support
        </Link>
      </form>
    </div>
  );
}
