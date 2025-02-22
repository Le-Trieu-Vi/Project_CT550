"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@/ui/components/IconButton";
import { TextField } from "@/ui/components/TextField";
import { ChatList } from "@/ui/components/ChatList";
import { ChatHeader } from "@/ui/components/ChatHeader";
import { ChatReceived } from "@/ui/components/ChatReceived";
import { ChatSent } from "@/ui/components/ChatSent";
import { Avatar } from "@/ui/components/Avatar";
import removeDiacritics from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import {
    createGroupWithTwoMembers,
    fetchGroups,
    fetchGroupMessages,
    sendMessageToGroup,
} from "@/app/message/actions";
import { useUser } from "@/app/user-context";
import useSWR, { mutate } from "swr";
import { MessagesList } from "@/ui/components/MessagesList";

export default function MessengerChatInbox() {
    interface User {
        id: string;
        full_name: string;
        email: string;
        avatar_url: string;
    }

    const supabase = createClient();
    const [users, setUsers] = useState<User[]>([]);
    const { user: currentUser } = useUser();
    const [keyWord, setKeyWord] = useState("");
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState("");

    const { data: groups, error: groupsError, isLoading: groupsLoading } = useSWR(
        "groups",
        async () => {
            const groups = await fetchGroups(currentUser!.id);
            return groups.sort((a, b) => {
                return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
            });
        }
    );

    const [selectedGroup, setSelectedGroup] = useState<any>(null);

    const { data: messages, error: messagesError } = useSWR(
        selectedGroup ? `messages-${selectedGroup.group_id}` : null,
        () => fetchGroupMessages(selectedGroup.group_id)
    );

    // Lấy danh sách user
    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase.from("profiles").select("*");
            if (error) {
                console.error("Error fetching users:", error.message);
            } else if (data) {
                setUsers(data);
            }
        }
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const fullName = removeDiacritics(user.full_name).toLowerCase();
        const keyword = removeDiacritics(keyWord).toLowerCase();
        return fullName.includes(keyword);
    });

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Khi click vào người dùng từ danh sách tìm kiếm
    const handleUserClick = async (user: User) => {
        try {
            const group = await createGroupWithTwoMembers({
                userId: currentUser!.id,
                friendId: user.id,
            });
            setSelectedGroup(group);

            mutate("groups");
            console.log("Group created:", group);
            setSelectedGroup(group);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };


    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await sendMessageToGroup({
                groupId: selectedGroup.group_id,
                senderId: currentUser!.id,
                content: newMessage,
            });
            setNewMessage("");
            // Refresh tin nhắn sau khi gửi tin nhắn mới
            mutate(`messages-${selectedGroup.group_id}`);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Realtime subscription cho tin nhắn của group đã chọn
    useEffect(() => {
        if (!selectedGroup) return;

        const messageChannel = supabase
            .channel("group-messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `receiver_id=eq.${selectedGroup.group_id}`,
                },
                (payload) => {
                    console.log("Realtime new message:", payload.new);
                    mutate(
                        `messages-${selectedGroup.group_id}`,
                        (currentMessages: any) =>
                            currentMessages ? [...currentMessages, payload.new] : [payload.new],
                        false
                    );
                    // Cập nhật lại view groups khi có tin nhắn mới
                    mutate("groups");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messageChannel);
        };
    }, [selectedGroup]);

    // Realtime subscription cho các thay đổi liên quan đến group, group_member (tác động đến view group_overview)
    useEffect(() => {
        const groupChannel = supabase
            .channel("groups-updates")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "group_member",
                },
                (payload) => {
                    console.log("group_member INSERT:", payload);
                    mutate("groups");
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "groups",
                },
                (payload) => {
                    console.log("groups UPDATE:", payload);
                    mutate("groups");
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "groups",
                },
                (payload) => {
                    console.log("groups DELETE:", payload);
                    mutate("groups");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(groupChannel);
        };
    }, []);

    // Hàm đánh dấu tin nhắn trong group đã đọc khi click vào nhóm
    const markMessagesAsRead = async (group: any) => {
        const { error } = await supabase
            .from("messages")
            .update({ is_read: true })
            .match({ receiver_id: group.group_id, is_read: false })
            .neq("sender_id", currentUser!.id);
        if (error) {
            console.error("Error marking messages as read:", error);
        } else {
            // Refresh lại groups để cập nhật số tin chưa đọc
            mutate("groups");
        }
    };

    console.log("groups", groups);


    return (
        <div className="flex h-full w-full items-start bg-default-background mobile:flex-col mobile:flex-nowrap mobile:gap-0">
            {/* Sidebar: Tìm kiếm người dùng & danh sách nhóm */}
            <div className="flex max-w-[384px] grow shrink-0 basis-0 flex-col items-start self-stretch border-r border-solid border-neutral-border mobile:h-auto mobile:w-full mobile:flex-none">
                <div className="flex w-full flex-col items-center gap-1 px-4 pt-1 pb-2">
                    <div className="flex w-full items-center gap-4">
                        <div className="flex grow shrink-0 basis-0 items-center gap-4 px-2 py-2">
                            <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
                                Messages
                            </span>
                        </div>
                        <IconButton variant="brand-tertiary" icon="FeatherPenSquare" onClick={(e) => { }} />
                    </div>
                    {/* Tìm kiếm người dùng */}
                    <div className="relative w-full px-2 py-2" ref={containerRef}>
                        <TextField className="h-auto w-full flex-none" variant="filled" label="" helpText="" icon="FeatherSearch">
                            <TextField.Input
                                placeholder="Search"
                                value={keyWord}
                                onChange={(e) => {
                                    setKeyWord(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                            />
                        </TextField>
                        {showResults && (
                            <div className="absolute top-full left-0 right-0 mt-1 rounded-md bg-white shadow-md border border-neutral-border z-10">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex w-full items-center gap-4 px-2 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={async () => {
                                                await handleUserClick(user);
                                                setShowResults(false);
                                            }}
                                        >
                                            <Avatar image={user.avatar_url ?? "/assets/images/avatar-default.png"} />
                                            <span className="grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
                                                {user.full_name}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-2 py-2 text-sm text-gray-500">No results found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Danh sách nhóm chat */}
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 px-4 py-4 overflow-auto">
                    <ChatList>
                        {groups?.map((group: any) => {
                            let avatarUrl = "/assets/images/avatar-default.png";
                            if (group.is_directed && Array.isArray(group.group_members)) {
                                const member = group.group_members.find((m: any) => m.role === "member");
                                if (member && member.profiles && member.profiles.avatar_url) {
                                    avatarUrl = member.profiles.avatar_url;
                                }
                            }
                            const isActive = selectedGroup && selectedGroup.group_id === group.group_id;

                            return (
                                <ChatList.ChatListItem
                                    key={group.group_id}
                                    avatar={avatarUrl}
                                    name={group.group_name || group.group_members.find((m: any) => m.role === "member")?.profiles?.full_name || "Unknown"}
                                    message={group.last_message || "No messages yet"}
                                    timestamp={
                                        group.last_message_time
                                            ? new Date(group.last_message_time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : ""
                                    }
                                    unread={group.unread_count > 0}
                                    onClick={() => {
                                        setSelectedGroup(group);
                                        markMessagesAsRead(group);
                                    }}
                                    className={`${isActive ? "bg-blue-100 hover:bg-blue-100" : "hover:bg-gray-100"}`}
                                >
                                </ChatList.ChatListItem>
                            );
                        })}
                    </ChatList>
                </div>
            </div>

            {/* Phần khung chat */}
            <div className="flex grow shrink-0 basis-0 flex-col items-stretch self-stretch mobile:h-auto mobile:w-full mobile:flex-none mobile:border-t mobile:border-solid mobile:border-neutral-border">
                {selectedGroup ? (
                    <>
                        {/* Header chat */}
                        <div className="flex w-full items-center border-b border-solid border-neutral-border p-3">
                            <ChatHeader
                                name={
                                    selectedGroup.group_name ||
                                    (selectedGroup.group_members.find(
                                        (member: any) => member.role === "member"
                                    )?.profiles?.full_name || "Unknown")
                                }
                                subtitle="Vừa mới truy cập"
                                buttons={
                                    <>
                                        <IconButton variant="brand-tertiary" icon="FeatherVideo" onClick={() => { }} />
                                        <IconButton variant="brand-tertiary" icon="FeatherPhone" onClick={() => { }} />
                                    </>
                                }
                            />

                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {selectedGroup ? (
                                <MessagesList
                                    messages={messages ||
                                        selectedGroup.messages.sort(
                                            (a: any, b: any) =>
                                                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                                        )}

                                    currentUserId={currentUser!.id}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">No group selected</p>
                                </div>
                            )}
                        </div>
                        {/* Vùng nhập tin nhắn */}
                        <div className="flex w-full items-center gap-2 border-t border-solid border-neutral-border px-6 py-4">
                            <div className="flex items-center gap-2 flex-grow">
                                <IconButton variant="brand-tertiary" icon="FeatherPlusCircle" onClick={(e) => { }} />
                                <IconButton variant="brand-tertiary" icon="FeatherImage" onClick={(e) => { }} />
                                <IconButton variant="brand-tertiary" icon="FeatherSmile" onClick={(e) => { }} />
                                <TextField className="flex-grow" variant="filled" label="" helpText="">
                                    <TextField.Input
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                </TextField>
                            </div>
                            <IconButton variant="brand-secondary" icon="FeatherSend" onClick={handleSendMessage} />
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500">Please select a group to see messages</p>
                    </div>
                )}
            </div>
        </div>
    );
}
