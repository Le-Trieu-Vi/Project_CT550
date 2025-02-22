'use client';
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

import { useUser } from "@/app/user-context";


export default function Header() {
    const { user: currentUser } = useUser();
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-12 fixed top-0 left-0 shadow z-50 bg-white">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Social Media App</Link>
                </div>
                <div className="flex gap-5 items-center relative w-full max-w-md">
                    <span className="absolute inset-y-0 left-3 flex items-center">
                        <Search className="h-5 w-5 text-gray-500" />
                    </span>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 w-full"
                    />
                </div>
                <div className="flex gap-3 items-center">
                    <h4 className="scroll-m-20 text-base tracking-tight">
                        {currentUser?.full_name}
                    </h4>
                    <Avatar>
                        <AvatarImage src={currentUser?.avatar_url ?? "/assets/images/avatar-default.png"} />
                        <AvatarFallback>
                            {currentUser?.full_name[0]}
                        </AvatarFallback>
                    </Avatar>
                    {/* {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />} */}
                    {/* <ThemeSwitcher />  Đổi giao diện */}
                    {/* <div className="flex items-center gap-2">
                        <DeployButton />
                    </div> */}
                </div>
            </div>
        </nav>
    );
}
