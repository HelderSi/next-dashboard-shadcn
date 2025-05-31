"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { DesktopNav, MobileNav } from "@/components/sidebar";
import Providers from "./providers";
import clsx from "clsx";
import { UserProfile } from "./user";
import { ProtectedLayout } from "../protected-layout";

export default function DashboardLayout({
  children
}: {
  readonly children: React.ReactNode;
}) {
  const { logoutUser } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    await logoutUser();
  };

  return (
    <ProtectedLayout>
      <Providers>
        <div className="flex min-h-screen bg-gray-100">
          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden sm:block">
            <DesktopNav
              handleSignOut={handleSignOut}
              isCollapsed={isCollapsed}
              onIsCollapsedChange={setIsCollapsed}
            />
          </div>

          {/* Main Content Wrapper (Ensures stacking on mobile) */}
          <div className="flex flex-col flex-1">
            {/* Mobile Header */}
            <header className="sticky top-0 z-30 flex h-14 w-full items-center gap-4 border-b bg-background px-4 sm:hidden">
              <MobileNav />
              <h1 className="text-lg font-semibold">Portaria Digital</h1>
              <div className="ml-auto"> {/* Push User to the right */}
                <UserProfile />
              </div>
            </header>

            {/* Main Content - Adjusts Margin Based on Screen Size */}
            <main
              className={clsx(
                "flex-1 p-6 transition-all",
                isCollapsed ? "sm:ml-16" : "sm:ml-64",
                "ml-0"
              )}
            >
              <div className="bg-white shadow-md rounded-lg p-6">{children}</div>
            </main>
          </div>
        </div>
      </Providers>
    </ProtectedLayout>
  );
}
