"use client";
import React from "react";
import { Avatar } from "./Avatar"; // nếu cần

interface ChatReceivedProps {
    avatar?: string;
    message: string;
    timestamp?: string;
}

export function ChatReceived({ avatar, message, timestamp }: ChatReceivedProps) {
    return (
        <div className="flex w-full items-end justify-start gap-2 px-4 my-2">
            {avatar && <Avatar size="medium" image={avatar} />}
            <div className="max-w-[70%] rounded-2xl px-4 py-2 shadow-md bg-gray-200 text-gray-800 break-words">
                <span className="text-sm leading-relaxed">{message}</span>
            </div>
        </div>
    );
}

