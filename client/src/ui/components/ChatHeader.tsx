"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "./Avatar";

interface ChatHeaderRootProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: React.ReactNode;
    subtitle?: React.ReactNode;
    buttons?: React.ReactNode;
    className?: string;
}

const ChatHeaderRoot = React.forwardRef<HTMLElement, ChatHeaderRootProps>(
    function ChatHeaderRoot(
        { name, subtitle, buttons, className, ...otherProps }: ChatHeaderRootProps,
        ref
    ) {
        return (
            <div
                className={SubframeCore.twClassNames(
                    "flex w-full items-center gap-4",
                    className
                )}
                ref={ref as any}
                {...otherProps}
            >
                <Avatar
                    size="large"
                    image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
                >
                    A
                </Avatar>
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                    {name ? (
                        <span className="w-full text-heading-3 font-heading-3 text-default-font">
                            {name}
                        </span>
                    ) : null}
                    {subtitle ? (
                        <span className="text-sm font-body text-subtext-color">
                            {subtitle}
                        </span>
                    ) : null}
                </div>
                {buttons ? (
                    <div className="flex items-start gap-2">{buttons}</div>
                ) : null}
            </div>
        );
    }
);

export const ChatHeader = ChatHeaderRoot;