"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, Search } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, setUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      console.log("All cookies:", document.cookie);
      const userId = Cookies.get("userId");
      const username = Cookies.get("username");

      console.log(userId, "NAVBAR")
      console.log(username, "NAVBAR")
      setIsLoading(false);
    };

    restoreUser();
  }, [user, setUser, logout]);

  const routes = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/apiKeyManager", label: "API Keys", active: pathname === "/apiKeyManager" },
  ];

  if (isLoading) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center mx-auto">
            <span className="font-bold">RestCountries</span>
          </div>
        </header>
    );
  }

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center mx-auto">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">RestCountries</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {routes.map((route) => (
                  <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                          "transition-colors hover:text-foreground/80",
                          route.active ? "text-foreground" : "text-foreground/60"
                      )}
                  >
                    {route.label}
                  </Link>
              ))}
            </nav>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                <span className="font-bold">RestCountries</span>
              </Link>
              <nav className="mt-6 flex flex-col space-y-4">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-foreground/70 transition-colors hover:text-foreground",
                            route.active && "text-foreground"
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                ))}
                {!user ? (
                    <>
                      <Link
                          href="/login"
                          className="text-foreground/70 transition-colors hover:text-foreground"
                          onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                          href="/register"
                          className="text-foreground/70 transition-colors hover:text-foreground"
                          onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                ) : (
                    <>
                      <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="text-left text-foreground/70 transition-colors hover:text-foreground"
                      >
                        Logout
                      </button>
                    </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
            <span className="font-bold">RestCountries</span>
          </Link>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              {user ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.username ? user.username.substring(0, 2).toUpperCase() : "UN"}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
              ) : (
                  <div className="hidden md:flex md:items-center md:gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Register</Button>
                    </Link>
                  </div>
              )}
            </nav>
          </div>
        </div>
      </header>
  );
}