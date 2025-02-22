"use client";
import React from "react";
import { Avatar } from "./Avatar"; // nếu cần hiển thị avatar

interface ChatSentProps {
    avatar?: string;
    message: string;
    timestamp?: string;
}

export function ChatSent({ avatar, message, timestamp }: ChatSentProps) {
    return (
        <div className="flex w-full items-end justify-end gap-2 px-4 my-2">
            {/* Bubble tin nhắn */}
            <div className="max-w-[70%] rounded-2xl px-4 py-2 shadow-md bg-blue-500 text-white break-words">
                <span className="text-sm leading-relaxed">{message}</span>
            </div>
            {avatar && <Avatar size="medium" image={avatar} />}
        </div>
    );
}

