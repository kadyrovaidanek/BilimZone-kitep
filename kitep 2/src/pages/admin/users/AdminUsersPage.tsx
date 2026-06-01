import { useEffect, useMemo, useState } from "react";

import { getAdminUsers, type PublicUser } from "@/shared/api/users";
import { filterAdminUsers } from "./lib/adminUsersFilters";
import { AdminUsersHeader } from "./ui/components/AdminUsersHeader";
import { AdminUsersToolbar } from "./ui/components/AdminUsersToolbar";
import { AdminUsersList } from "./ui/components/AdminUsersList";

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const response = await getAdminUsers({
                search: search.trim(),
                role,
            });

            setUsers(response.data || []);
        } catch (error) {
            console.log("ADMIN USERS LOAD ERROR:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return filterAdminUsers(users, search, role);
    }, [users, search, role]);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <AdminUsersHeader total={users.length} />

                <AdminUsersToolbar
                    search={search}
                    role={role}
                    onSearchChange={setSearch}
                    onRoleChange={setRole}
                    onApply={loadUsers}
                />

                <AdminUsersList users={filteredUsers} loading={loading} />
            </div>
        </main>
    );
};

export default AdminUsersPage;