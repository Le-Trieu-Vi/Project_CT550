import { useEffect, useRef } from "react";
import Image from "next/image";

const ChatBox = ({ messages, currentUser }: { messages: any[]; currentUser: any }) => {
    const chatRef = useRef<HTMLDivElement>(null);

    // Auto scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col w-full h-[80vh] max-w-lg mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-blue-600 text-white">
                <Image src="/assets/images/avatar-default.png" alt="Avatar" width={40} height={40} className="rounded-full" />
                <div className="ml-3">
                    <p className="font-semibold">Chat với bạn bè</p>
                    <p className="text-xs opacity-80">Đang hoạt động</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatRef} className="flex flex-col flex-grow overflow-y-auto px-4 py-3 space-y-2 bg-gray-100">
                {messages.map((msg, index) => {
                    const isSentByCurrentUser = msg.sender_id === currentUser.id;
                    return (
                        <div key={index} className={`flex items-end ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}>
                            {!isSentByCurrentUser && (
                                <Image src={msg.sender_avatar || "/assets/images/avatar-default.png"} alt="Avatar" width={36} height={36} className="rounded-full" />
                            )}
                            <div
                                className={`relative px-4 py-2 text-sm max-w-xs rounded-xl shadow-md ${isSentByCurrentUser
                                        ? "bg-blue-500 text-white ml-auto"
                                        : "bg-white text-gray-800"
                                    }`}
                            >
                                {msg.content}
                                <span className="absolute text-[10px] bottom-0 right-2 text-white opacity-70">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t flex items-center">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition">
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
