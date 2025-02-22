import { createClient } from "@/utils/supabase/client";
import { log } from "console";
import { v4 as uuidv4 } from "uuid";

export async function createGroupWithTwoMembers(params: {
  userId: string;
  friendId: string;
}) {
  const supabase = createClient();
  const currentTime = new Date().toISOString();

  // Bước 1: Lấy danh sách group_id mà userId tham gia
  const { data: groupsUser, error: errorUser } = await supabase
    .from("group_member")
    .select("group_id")
    .eq("user_id", params.userId);
  if (errorUser) {
    throw new Error(errorUser.message);
  }

  // Bước 2: Lấy danh sách group_id mà friendId tham gia
  const { data: groupsFriend, error: errorFriend } = await supabase
    .from("group_member")
    .select("group_id")
    .eq("user_id", params.friendId);
  if (errorFriend) {
    throw new Error(errorFriend.message);
  }

  // Chuyển dữ liệu về mảng group_id
  const groupsUserIds = groupsUser?.map((item: { group_id: string }) => item.group_id) || [];
  const groupsFriendIds = groupsFriend?.map((item: { group_id: string }) => item.group_id) || [];
  
  // Tìm giao nhau của các group_id
  const commonGroupIds = groupsUserIds.filter((id) => groupsFriendIds.includes(id));

  // Kiểm tra xem có nhóm nào chỉ gồm 2 thành viên không
  for (const groupId of commonGroupIds) {
    // Chỉ lấy các thành viên của group hiện tại
    const { data: members, error: memberError } = await supabase
      .from("group_member")
      .select("*")
      .eq("group_id", groupId);
    if (memberError) {
      throw new Error(memberError.message);
    }
    if (members && members.length === 2) {
      // Nhóm này đã tồn tại với đúng 2 thành viên
      return { message: "Group already exists", group_id: groupId };
    }
  }

  // Nếu không tồn tại nhóm, tạo nhóm mới
  const groupId = uuidv4();
  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .insert({
      group_id: groupId,
      group_name: null,
      is_directed: true,
      created_at: currentTime,
    })
    .single();
  if (groupError) {
    throw new Error(groupError.message);
  }

  const members = [
    {
      group_id: groupId,
      user_id: params.userId,
      role: 'owner',
      joined_at: currentTime,
    },
    {
      group_id: groupId,
      user_id: params.friendId,
      joined_at: currentTime,
      role: 'member',
    },
  ];

  // Sử dụng upsert để tránh lỗi duplicate
  const { error: memberInsertError } = await supabase
    .from("group_member")
    .upsert(members, { onConflict: "group_id,user_id" });
  if (memberInsertError) {
    throw new Error(memberInsertError.message);
  }

  return groupData;
}




export async function fetchGroups(currentUserId: string) {
  const supabase = createClient();

  // Bước 1: Lấy danh sách group_id mà currentUser tham gia
  const { data: groupMemberships, error: membershipError } = await supabase
    .from("group_member")
    .select("group_id")
    .eq("user_id", currentUserId);

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  const groupIds = groupMemberships.map(
    (membership: { group_id: string }) => membership.group_id
  );

  if (groupIds.length === 0) {
    return [];
  }

  // Bước 2: Truy vấn view group_overview cùng với thông tin thành viên từ bảng group_member
  const { data: groups, error: groupsError } = await supabase
    .from("group_overview")
    .select(`
      *,
      group_members:group_member (
        user_id,
        role,
        joined_at,
        profiles:profiles (*)
      )
    `)
    .in("group_id", groupIds);

  if (groupsError) {
    throw new Error(groupsError.message);
  }

  return groups;
}


  export async function fetchGroupMessages(groupId: string) {
    const supabase = createClient();
  
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("receiver_id", groupId)
      .order("created_at", { ascending: true });
  
    if (messagesError) {
      throw new Error(messagesError.message);
    }

    console.log(messages);
    
  
    return messages;
  }

  export async function sendMessageToGroup(params: {
    groupId: string;
    senderId: string;
    content: string;
  }) {
    const supabase = createClient();
    const currentTime = new Date().toISOString();
  
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .eq("group_id", params.groupId)
      .single();
  
    if (groupError) {
      throw new Error(groupError.message);
    }
  
    const { data: members, error: memberError } = await supabase
      .from("group_member")
      .select("*")
      .eq("group_id", params.groupId);
  
    if (memberError) {
      throw new Error(memberError.message);
    }
  
    const memberIds = members.map((m: { user_id: string }) => m.user_id);
  
    const { error: messageError } = await supabase
      .from("messages")
      .insert([
        {
          message_id: uuidv4(),
          sender_id: params.senderId,
          receiver_id: params.groupId,
          content: params.content,
          // Các trường khác nếu cần (ví dụ: is_deleted, ...)
        },
      ]);
  
    if (messageError) {
      throw new Error(messageError.message);
    }
  
    return { memberIds, message: "Message sent successfully" };
  }