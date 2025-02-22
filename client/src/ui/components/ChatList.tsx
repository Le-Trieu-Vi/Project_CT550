"use client";
/*
 * Documentation:
 * Chat List — https://app.subframe.com/b61c5bdb8cf4/library?component=Chat+List_0912e9e6-c7c3-497f-bf60-cb5361d8c378
 */

import React from "react";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "./Avatar";

interface ChatListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: string;
  name?: React.ReactNode;
  message?: React.ReactNode;
  timestamp?: React.ReactNode;
  replied?: boolean;
  unread?: boolean;
  selected?: boolean;
  className?: string;
}

const ChatListItem = React.forwardRef<HTMLElement, ChatListItemProps>(
  function ChatListItem(
    {
      avatar,
      name,
      message,
      timestamp,
      replied = false,
      unread = false,
      selected = false,
      className,
      children,
      ...otherProps
    }: ChatListItemProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "group/f0df7a36 flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-md px-3 py-3 hover:bg-neutral-50 active:bg-neutral-100",
          { "bg-brand-100 hover:bg-brand-100 active:bg-brand-50": selected },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <Avatar size="large" image={avatar} />
        <div className="flex grow shrink-0 basis-0 flex-col">
          {/* Hàng trên: tên và timestamp */}
          <div className="flex w-full items-center justify-between">
            {name && (
              <span className="text-body-bold font-body-bold text-default-font">
                {name}
              </span>
            )}
            {timestamp && (
              <span className="text-caption font-caption text-subtext-color">
                {timestamp}
              </span>
            )}
          </div>
          {/* Hàng dưới: tin nhắn và dấu chấm nếu có tin mới */}
          <div className="flex w-full items-center justify-between">
            {message && (
              <span
                className={SubframeCore.twClassNames(
                  "line-clamp-1",
                  unread
                    ? "font-semibold text-default-font" // in đậm nếu có tin mới
                    : "text-body font-body text-subtext-color"
                )}
              >
                {message}
              </span>
            )}
            {unread && (
              // Dấu chấm với kích thước lớn hơn
              <span className="ml-2 inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }
);




interface ChatListRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const ChatListRoot = React.forwardRef<HTMLElement, ChatListRootProps>(
  function ChatListRoot(
    { children, className, ...otherProps }: ChatListRootProps,
    ref
  ) {
    return children ? (
      <div
        className={SubframeCore.twClassNames(
          "flex w-full flex-col items-start gap-1",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  }
);

export const ChatList = Object.assign(ChatListRoot, {
  ChatListItem,
});
