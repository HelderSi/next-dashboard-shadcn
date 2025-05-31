import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

type UserProfileProps = {
    avatarOny?: boolean;
};
export function UserProfile({ avatarOny }: UserProfileProps) {
    const { logoutUser, user } = useAuthStore();

    const handleSignOut = async () => {
        await logoutUser();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        <Image
                            src={user?.image ?? '/placeholder-user.jpg'}
                            width={36}
                            height={36}
                            alt="Avatar"
                            className="overflow-hidden rounded-full"
                        />
                    </Button>
                    {(user && !avatarOny) && (
                        <div className="hidden md:flex flex-col items-start">
                            {/* <span className="text-sm font-medium">
                                {user?.displayName || "User Name"}
                            </span> */}
                            <span className="text-xs text-muted-foreground">
                                {user?.email || "User loggetout"}
                            </span>
                        </div>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='ml-2'>
                <div className="flex flex-col items-start p-2">
                    {/* {<span className="text-sm font-medium">
                        {user?.displayName || "User Name"}
                    </span>} */}
                    <span className="text-xs text-muted-foreground">
                        {user?.email || "User loggetout"}
                    </span>
                </div>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                {user ? (
                    <DropdownMenuItem>
                        <form
                            action={handleSignOut}
                        >
                            <button type="submit">Sair</button>
                        </form>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem>
                        <Link href="/login">Logar</Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
