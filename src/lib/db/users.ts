import 'server-only';

import { UserModel } from '@/models/User';

const initialUsers: UserModel[] = [
    { id: 1, name: "Alice Johnson", role: "Coordinator" },
    { id: 2, name: "Bob Smith", role: "Helper" },
    { id: 3, name: "Charlie Brown", role: "Organizer" },
];

export async function getUsers(
    search: string,
    offset: number
): Promise<{
    users: UserModel[];
    newOffset: number | null;
    totalUsers: number;
}> {
    console.log(search)
    console.log(offset)
    return {
        users: initialUsers,
        newOffset: null,
        totalUsers: initialUsers.length
    };
}