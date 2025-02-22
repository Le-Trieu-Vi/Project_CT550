import { createClient } from '@/utils/supabase/server';

export default async function Users() {
    const supabase = await createClient();

    // Truy vấn dữ liệu từ bảng `auth.users`
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error.message);
        return <p>Error fetching users</p>;
    }

    return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
