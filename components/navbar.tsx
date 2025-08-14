"use client"

import { authVerify } from "@/libs/utils/utils"
import React, { useEffect, useState } from "react"
import { Search, ChevronDown } from "lucide-react"

type User = { username?: string; profile_picture ?: string; };

export function Navbar() {
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [user, setUsr] = useState<User>({});

    useEffect(() => {
      const getUserProfile = async () => {
        const { user }: any = await authVerify();
        setUsr(user);
      }
  
      getUserProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setSearch( e.target.value);
    }
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!search.trim()) return setError("Please enter a keyword to search");
        console.log("Login Search:", search);
    }

  return (
    <header className="fixed top-0 left-20 right-0 z-40 h-20 border-b shadow-sm bg-white-active">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1 max-w-md">
            <div className="relative">
                <div onClick={(event) => handleSubmit(event)} className="absolute inset-y-0 left-0 p-2 flex items-center cursor-pointer">
                    <Search className={`h-4 w-4 ${error ? 'text-red-300' : 'text-gray-500'}`} />
                </div>
                <input id="search" name="search" type="text" placeholder={error ? `${error}` : 'Search...'} value={search} onChange={handleInputChange} className={`block w-full pl-10 pr-3 py-2 text-sm rounded-lg leading-5 border bg-[#e5edf9] placeholder-gray-500 focus:outline-none focus:ring-1 ${ error ? "border-red-500 bg-red-50 placeholder-red-300 focus:border-red-500 focus:ring-red-500/40" : "border-gray-200 text-gray-500 focus:border-gray-200 focus:ring-gray-200" }`} />
            </div>

            
        </div>

        <div className="flex items-center">
          <button className="p-2 text-sm space-x-3 flex items-center hover:bg-primary-micro-active hover:rounded-3xl transition-colors">
            <img src= {user?.profile_picture || "/admin-avatar.png" } alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-primary-active font-medium">{user?.username}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  )
}
