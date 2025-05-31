import { db } from "@/lib/db";
import { UsersTable } from "./users-table";

export default async function UsersPage(
    props: {
        searchParams: Promise<{ q: string; offset: string }>;
    }
) {
    const searchParams = await props.searchParams;
    const search = searchParams.q ?? '';
    const offset = searchParams.offset ?? 0;
    const { users, newOffset, totalUsers } = await db.getUsers(
        search,
        Number(offset)
    );

    return (
        <UsersTable
            users={users}
            search={search}
            offset={newOffset ?? 0}
            totalUsers={totalUsers}
        />
    );
}