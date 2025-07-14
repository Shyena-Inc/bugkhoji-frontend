import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Moon, Sun, Menu, X, ChevronDown, LogOut, Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context";
import { useParams } from "react-router-dom";
import { UserRole } from "@/types/user";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authenticated, user, logout } = useAuth();
  const onHandleSubmit = () => {
    logout();
  };
  const { id } = useParams();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="h-10 w-10 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              BugKhoji🔍
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/about"
              className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* Role-based Navigation Links */}
            {authenticated && user?.role === "RESEARCHER" && (
              <>
                <Link
                  to="/bugs"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
                >
                  Bug Reports
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
                >
                  Leaderboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
            
            {authenticated && user?.role === "ORGANIZATION" && (
              <>
                <Link
                  to="/manage-bounties"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
                >
                  Manage Bounties
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/analytics"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
                >
                  Analytics
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
            
            {!authenticated && (
              <>
                <Link
                  to="/careers"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
                >
                  Careers
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/support"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
                >
                  Support
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/contact"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium group"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}

            {/* Authentication Section */}
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2">
                    {/* Avatar or initials */}
                    <div className="px-3 py-2 bg-gray-200 rounded-full text-xs flex items-center gap-1">
                      {user?.role === "ORGANIZATION" ? (
                        <Building className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {/* Display initials or username */}
                      {user?.role === "RESEARCHER"
                        ? user.firstName[0]
                        : user?.role === "ORGANIZATION"
                        ? user.organizationName[0]
                        : user?.role === "ADMIN"
                        ? user.name[0]
                        : ""}
                    </div>
                    {/* Display name */}
                    <span>
                      {user?.role === "RESEARCHER"
                        ? user.firstName
                        : user?.role === "ORGANIZATION"
                        ? user.organizationName
                        : user?.role === "ADMIN"
                        ? user.name
                        : ""}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      ({user?.role.toLowerCase()})
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-3 min-w-44">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      {user?.role === "ORGANIZATION" ? (
                        <Building className="w-4 h-4 text-purple-600" />
                      ) : (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                      My Account
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={`/getUserProfile/${id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={user?.role === "ORGANIZATION" ? "/org-dashboard" : "/dashboard"}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "RESEARCHER" && (
                    <DropdownMenuItem>
                      <Link to="/my-submissions">My Submissions</Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === "ORGANIZATION" && (
                    <>
                      <DropdownMenuItem>
                        <Link to="/create-bounty">Create Bounty</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/manage-researchers">Manage Researchers</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button onClick={onHandleSubmit} className="text-red-500 flex items-center gap-2">
                      <LogOut /> <p>Log out</p>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800/50 backdrop-blur-sm rounded-xl font-medium"
                  >
                    Login / Register
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-white/20 dark:border-slate-700/50 rounded-xl shadow-2xl">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/login/researcher"
                      className="w-full flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg"
                    >
                      <User className="mr-3 h-4 w-4 text-blue-600 dark:text-cyan-400" />
                      Researcher Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/login/organization"
                      className="w-full flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg"
                    >
                      <Building className="mr-3 h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Organization Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/terms"
                      className="w-full flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg text-sm"
                    >
                      Terms of Service
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/privacy"
                      className="w-full flex items-center px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg text-sm"
                    >
                      Privacy Policy
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-3 rounded-xl hover:bg-blue-50/80 dark:hover:bg-slate-800/50 backdrop-blur-sm"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-3 rounded-xl"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-xl"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-slate-700/50 py-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Role-based Mobile Navigation */}
              {authenticated && user?.role === "RESEARCHER" && (
                <>
                  <Link
                    to="/bugs"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bug Reports
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Leaderboard
                  </Link>
                </>
              )}
              
              {authenticated && user?.role === "ORGANIZATION" && (
                <>
                  <Link
                    to="/manage-bounties"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Bounties
                  </Link>
                  <Link
                    to="/analytics"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                </>
              )}
              
              {!authenticated && (
                <>
                  <Link
                    to="/careers"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Careers
                  </Link>
                  <Link
                    to="/support"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <Link
                    to="/contact"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}

              {authenticated ? (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium flex items-center gap-2">
                    {user?.role === "ORGANIZATION" ? (
                      <Building className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    Account ({user?.role}):
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to={`/getUserProfile/${id}`}
                      className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to={user?.role === "ORGANIZATION" ? "/org-dashboard" : "/dashboard"}
                      className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user?.role === "RESEARCHER" && (
                      <Link
                        to="/my-submissions"
                        className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Submissions
                      </Link>
                    )}
                    {user?.role === "ORGANIZATION" && (
                      <>
                        <Link
                          to="/create-bounty"
                          className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Create Bounty
                        </Link>
                        <Link
                          to="/manage-researchers"
                          className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Manage Researchers
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        onHandleSubmit();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-red-500 text-left hover:text-red-600 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                    Login as:
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login/researcher"
                      className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Researcher
                    </Link>
                    <Link
                      to="/login/organization"
                      className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Organization
                    </Link>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                  Legal:
                </div>
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/terms"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;