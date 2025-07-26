import { Button } from "@/components/ui/button";
import { Home, Settings, Users, SidebarOpen, PanelLeft, SidebarClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { UserProfile } from "@/app/(dashboard)/user";

const navItems = [
    { name: "Início", icon: Home, path: "/" },
    { name: "Clientes", icon: Users, path: "/customers" },
    { name: "Configuração", icon: Settings, path: "/settings" },
];

type SidebarProps = {
    handleSignOut: () => void;
    isCollapsed: boolean;
    onIsCollapsedChange: (value: boolean) => void;
};

export const DesktopNav = ({ isCollapsed, onIsCollapsedChange }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <aside className={clsx(
            "fixed left-0 top-0 shadow-lg bg-white dark:bg-gray-900 shadow-xl h-screen flex flex-col justify-between border-r border-gray-200 dark:border-gray-800 transition-all duration-300 inset-y-0 z-10 hidden bg-background sm:flex",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <nav>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4">
                    {!isCollapsed &&
                        <div className="flex items-center gap-2">
                            {/* Logo */}
                            {/* <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                <img src="/vercel.svg" alt="Logo" className="w-8 h-8" />
                            </div> */}
                            {/* Sidebar Name (Hidden when isCollapsed) */}
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Next Dash</h1>
                        </div>}
                    {/* Collapse Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onIsCollapsedChange(!isCollapsed)}
                    >
                        {isCollapsed ? <SidebarOpen className="w-5 h-5" /> : <SidebarClose className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Navigation */}
                <div className="flex flex-col flex-grow p-3 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={clsx(
                                "flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200",
                                {
                                    "bg-black text-white font-semibold dark:bg-gray-800 hover:text-black hover:bg-gray-200": pathname === item.path,
                                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800": pathname !== item.path,
                                }
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {!isCollapsed && <span className="ml-3">{item.name}</span>}
                        </Link>
                    ))}
                </div>
            </nav>
            {/* User Profile & Logout */}
            <div className="border-t p-4 flex flex-col transition-all duration-300">
                <UserProfile avatarOny={isCollapsed} />
            </div>

        </aside>
    );
};

export const MobileNav = () => {
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav>
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                            {/* Logo */}
                            {/* <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                <img src="/vercel.svg" alt="Logo" className="w-8 h-8" />
                            </div> */}
                            {/* Sidebar Name (Hidden when isCollapsed) */}
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Portaria Digital</h1>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col flex-grow p-3 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={clsx(
                                    "flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200",
                                    {
                                        "bg-black text-white font-semibold dark:bg-gray-800 hover:text-black hover:bg-gray-200": pathname === item.path,
                                        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800": pathname !== item.path,
                                    }
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}