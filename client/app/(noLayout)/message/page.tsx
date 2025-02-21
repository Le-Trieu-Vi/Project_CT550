"use client";

import React from "react";
import { IconButton } from "@/ui/components/IconButton";
import { TextField } from "@/ui/components/TextField";
import { ChatList } from "@/ui/components/ChatList";
import { ChatHeader } from "@/ui/components/ChatHeader";
import { ChatReceived } from "@/ui/components/ChatReceived";
import { ChatSent } from "@/ui/components/ChatSent";

function MessengerChatInbox() {
    return (
        <div className="flex h-full w-full items-start bg-default-background mobile:flex-col mobile:flex-nowrap mobile:gap-0">
            <div className="flex max-w-[384px] grow shrink-0 basis-0 flex-col items-start self-stretch border-r border-solid border-neutral-border mobile:h-auto mobile:w-full mobile:flex-none">
                <div className="flex w-full flex-col items-center gap-1 px-4 pt-4 pb-2">
                    <div className="flex w-full items-center gap-4">
                        <div className="flex grow shrink-0 basis-0 items-center gap-4 px-2 py-2">
                            <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
                                Messages
                            </span>
                        </div>
                        <IconButton
                            variant="brand-tertiary"
                            icon="FeatherPenSquare"
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => { }}
                        />
                    </div>
                    <div className="flex w-full flex-col items-center gap-4 px-2 py-2">
                        <TextField
                            className="h-auto w-full flex-none"
                            variant="filled"
                            label=""
                            helpText=""
                            icon="FeatherSearch"
                        >
                            <TextField.Input
                                placeholder="Search"
                                value=""
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => { }}
                            />
                        </TextField>
                    </div>
                </div>
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 px-4 py-4 overflow-auto">
                    <ChatList>
                        <ChatList.ChatListItem
                            avatar="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
                            name="Warren Daniels"
                            message="Just sent the reports, take a look"
                            timestamp="Just now"
                            unread={true}
                        />
                        <ChatList.ChatListItem
                            avatar="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
                            name="Ivan Smith"
                            message="See you there"
                            timestamp="1 hour ago"
                            selected={true}
                        />
                        <ChatList.ChatListItem
                            avatar="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
                            name="Amy Bowen"
                            message="Let's get working on it tomorrow"
                            timestamp="3 hours ago"
                            replied={true}
                        />
                        <ChatList.ChatListItem
                            avatar="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
                            name="Barry Jackson"
                            message="Let me know what you think"
                            timestamp="Yesterday"
                            unread={true}
                        />
                        <ChatList.ChatListItem
                            avatar="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/m0kfajqpwkfief00it4v.jpg"
                            name="Lisa McKinley"
                            message="awesome, can't wait!"
                            timestamp="3 days ago"
                        />
                    </ChatList>
                </div>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start self-stretch mobile:h-auto mobile:w-full mobile:flex-none mobile:border-t mobile:border-solid mobile:border-neutral-border">
                <div className="flex w-full items-center border-b border-solid border-neutral-border px-6 py-6">
                    <ChatHeader
                        name="Ivan Smith"
                        subtitle="ivan@subframe.com"
                        buttons={
                            <>
                                <IconButton
                                    variant="brand-tertiary"
                                    icon="FeatherVideo"
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => { }}
                                />
                                <IconButton
                                    variant="brand-tertiary"
                                    icon="FeatherPhone"
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => { }}
                                />
                            </>
                        }
                    />
                </div>
                <div className="flex w-full grow shrink-0 basis-0 flex-col items-center justify-end overflow-auto">
                    <div className="container max-w-none flex w-full grow shrink-0 basis-0 flex-col items-center gap-4 py-12 overflow-auto">
                        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-2" />
                        <div className="flex w-full flex-col items-center justify-end gap-8">
                            <ChatReceived
                                avatar="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
                                initials="IS"
                                name="Ivan Smith"
                                message="👋 Hey! What are you thinking for lunch today? I was hoping to get something quick so I can get back to work."
                                time="11:11am"
                            />
                            <ChatSent
                                name="You"
                                message="How does Thai sound? I know a pretty good place."
                                timestamp="11:21am"
                            />
                            <ChatReceived
                                avatar="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
                                initials="IS"
                                name="Ivan Smith"
                                message="I'd be open to it! Is it walkable from the office?"
                                time="11:24am"
                            />
                            <ChatSent
                                name="You"
                                message="Totally is. Let me wrap up this report real fast and I'll meet you at your desk in 15min."
                                timestamp="11:25am"
                            />
                            <ChatReceived
                                avatar="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
                                initials="IS"
                                name="Ivan Smith"
                                message="See you there "
                                time="11:26am"
                            />
                        </div>
                    </div>
                    <div className="container max-w-none flex w-full items-end gap-2 pt-1 pb-8">
                        <div className="flex items-end">
                            <IconButton
                                variant="brand-tertiary"
                                icon="FeatherPlusCircle"
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => { }}
                            />
                            <IconButton
                                variant="brand-tertiary"
                                icon="FeatherImage"
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => { }}
                            />
                            <IconButton
                                variant="brand-tertiary"
                                icon="FeatherSmile"
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => { }}
                            />
                        </div>
                        <TextField
                            className="h-auto grow shrink-0 basis-0"
                            variant="filled"
                            label=""
                            helpText=""
                        >
                            <TextField.Input
                                placeholder="Type your message..."
                                value=""
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => { }}
                            />
                        </TextField>
                        <IconButton
                            variant="brand-primary"
                            icon="FeatherSend"
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => { }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessengerChatInbox;