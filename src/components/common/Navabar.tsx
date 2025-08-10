/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/hooks/useAppDisPatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { logout as logoutAction } from "@/redux/fetures/authSlice";
import { setTheme } from "@/redux/fetures/themeSlice"; // adjust path if needed
import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/redux/services/assessmentApi";
import Cookies from "js-cookie";
import {
  BarChart3,
  GraduationCap,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Sun,
  User as UserIcon,
} from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

type Theme = "light" | "dark" | "system";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role, supervisorApproved, isApproved } = useAppSelector(
    (s) => s.auth
  );
  const themeState = useAppSelector((s: any) => s.theme?.theme);
  const { data: me } = useGetMeQuery(undefined, {
    skip: !role, // only when logged in
  });

  const [logoutReq] = useLogoutMutation();

  const approved =
    role === "supervisor" ? supervisorApproved ?? isApproved : true;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logoutReq(undefined).unwrap();
    } catch {
      /* ignore backend logout failure */
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(logoutAction());
      toast.success("Logged out");
      navigate("/login");
    }
  };

  const userName = me?.user?.profile?.name;
  const avatarUrl = me?.user?.profile?.avatarUrl;
  const fallback =
    (userName && userName.charAt(0).toUpperCase()) ||
    me?.user?.email?.charAt(0).toUpperCase() ||
    "U";

  const switchTheme = (val: Theme) => dispatch(setTheme(val));

  const themeIcon = () => {
    if (themeState === "light") return <Sun className="h-4 w-4" />;
    if (themeState === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-smooth"
          >
            <div className="bg-gradient-primary rounded-lg p-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Test_School</h1>
              <p className="text-xs text-muted-foreground">
                Digital Competency Platform
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-smooth ${
                isActive("/")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Home
            </Link>
            <Link
              to="/assessment"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-smooth ${
                isActive("/assessment")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              Assessment
            </Link>
            {role && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium px-3 py-2 rounded-md transition-smooth ${
                  isActive("/dashboard")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                Dashboard
              </Link>
            )}
            {role === "admin" && (
              <Link
                to="/admin"
                className={`text-sm font-medium px-3 py-2 rounded-md flex items-center gap-2 transition-smooth ${
                  isActive("/admin")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  {themeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => switchTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {role ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-2 py-1.5 hover:bg-accent gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      {avatarUrl && (
                        <AvatarImage src={avatarUrl} alt={userName} />
                      )}
                      <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                      {userName || me?.user?.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-2 py-2 text-xs text-muted-foreground">
                    <p className="font-medium">{userName || me?.user?.email}</p>
                    <p>
                      Role: {role}
                      {role === "supervisor" &&
                        ` (${approved ? "Approved" : "Pending"})`}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/assessment">Assessment</Link>
                  </DropdownMenuItem>
                  {role && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  {role && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                  {!role && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/login">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/signup">Sign Up</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
