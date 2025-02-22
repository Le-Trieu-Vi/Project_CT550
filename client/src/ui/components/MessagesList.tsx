// MessagesList.tsx
"use client";
import React from "react";
import { ChatSent } from "./ChatSent";
import { ChatReceived } from "./ChatReceived";

interface Message {
    message_id: string;
    content: string;
    sender_id: string;
    created_at: string;
    // ... các trường khác nếu cần
}

interface MessagesListProps {
    messages: Message[];
    currentUserId: string;
}

// utils/formatTimestamp.ts
export function formatTimestamp(ts: string): string {
    const date = new Date(ts);
    const now = new Date();

    // Nếu cùng ngày
    if (date.toDateString() === now.toDateString()) {
        // Hiển thị giờ:phút (vd: 08:30)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Tính chênh lệch ngày
    const diffTime = now.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    // Nếu tin nhắn trong vòng 7 ngày
    if (diffDays < 7) {
        // Hiển thị thứ (Mon, Tue, Wed,...)
        return date.toLocaleDateString([], { weekday: "short" });
    }

    // Còn lại hiển thị ngày/tháng/năm
    return date.toLocaleDateString();
}


export function MessagesList({ messages, currentUserId }: MessagesListProps) {
    // Sắp xếp tin nhắn theo thời gian tăng dần (nếu chưa)
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return (
        <div className="flex flex-col">
            {sortedMessages.map((msg, index) => {
                const prevMsg = sortedMessages[index - 1];
                let showTimeMarker = false;

                if (!prevMsg) {
                    // Tin đầu tiên -> hiển thị time marker
                    showTimeMarker = true;
                } else {
                    // Nếu ngày của msg khác ngày của prevMsg thì hiển thị time marker
                    const d1 = new Date(msg.created_at);
                    const d2 = new Date(prevMsg.created_at);
                    if (d1.toDateString() !== d2.toDateString()) {
                        showTimeMarker = true;
                    }
                }

                return (
                    <React.Fragment key={msg.message_id}>
                        {/* Time marker ở giữa */}
                        {showTimeMarker && (
                            <div className="flex justify-center my-2">
                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                                    {formatTimestamp(msg.created_at)}
                                </span>
                            </div>
                        )}

                        {/* Bubble tin nhắn */}
                        {msg.sender_id === currentUserId ? (
                            <ChatSent
                                message={msg.content}
                                // Muốn hiển thị giờ ở bubble? => formatTimestamp(msg.created_at)
                                timestamp={msg.created_at}
                            />
                        ) : (
                            <ChatReceived
                                message={msg.content}
                                timestamp={msg.created_at}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
