  import {
    useState,
    useEffect,
    useCallback,
    useMemo,
    createContext,
  } from "react";
  import { UserI } from "@/types/user";
  import { useToast } from "@/hooks/use-toast";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { AuthContextType } from "@/types/context";
  import LoadingScreen from "@/components/Loading";
  import api, { endpoints } from "@/utils/api";
  import { AdminLoginFormData, ResearcherLoginFormData, OrganizationLoginFormData, ResearcherRegisterFormData, OrganizationRegisterFormData } from "@/types/auth";
  import Cookies from "js-cookie";
  import { ErrorHandler } from "@/utils/errorHandler";

  type Props = {
    children: React.ReactNode;
  };

  // eslint-disable-next-line react-refresh/only-export-components
  export const AuthContext = createContext<AuthContextType | null>(null);

  export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<UserI | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const navigate = useNavigate();


    useEffect(() => {

      // Check for user data from URL parameters first
      const userFromURL = searchParams.get("currentUser");

      if (userFromURL) {
        try {
          const parsedUser = JSON.parse(userFromURL);
          setUser(parsedUser);
          localStorage.setItem("currentUser", JSON.stringify(parsedUser));

          // Set authorization header if token exists
          const token = Cookies.get("accessToken");
          if (token) {
            api.defaults.headers["Authorization"] = `Bearer ${token}`;
          }

          toast({
            title: "Login Successful",
            variant: "success",
          });
          navigate("/problems", { replace: true });
          setLoading(false);
          return;
        } catch (error) {
          ErrorHandler.logError(error, "Parse user data from URL");
          ErrorHandler.handleApiError(error, "Invalid user data received");
          navigate("/login");
          setLoading(false);
          return;
        }
      }

      // If no URL user data, check localStorage
      const storedUser = localStorage.getItem("currentUser");

      if (storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          const token = Cookies.get("accessToken");
          if (token) {
            api.defaults.headers["Authorization"] = `Bearer ${token}`;
          }
        } catch (error) {
          ErrorHandler.logError(error, "Parse stored user");
        }
      } else {
        console.error('No valid user found in localStorage');
      }

      setLoading(false);
    }, [navigate, searchParams, toast]);

    const logout = useCallback(
      async (req: boolean = true) => {
        try {
          if (req) {
            try {
              const res = await api.post(endpoints.auth.logout, {}, { withCredentials: true });
              toast({
                title: "Logged out successfully",
                description: res.data.message || "You have been logged out",
                variant: "default",
              });
            } catch (err: any) {
              ErrorHandler.logError(err, "Logout API");
              // Continue with client-side cleanup even if API call fails
              ErrorHandler.showInfo("Logged out", "Session ended");
            }
          }
        } finally {
          // Always perform client-side cleanup
          setUser(null);
          localStorage.clear(); // Clear all localStorage
          sessionStorage.clear(); // Clear all sessionStorage
          Cookies.remove("accessToken", { path: '/' });
          Cookies.remove("refreshToken", { path: '/' });
          Cookies.remove("__refreshExpiry_", { path: '/' });
          
          // Clear authorization header
          delete api.defaults.headers.common["Authorization"];
          delete api.defaults.headers["Authorization"];
          
          // Navigate to home page
          navigate("/", { replace: true });
        }
      },
      [navigate, toast]
    );

    const refreshAuthToken = useCallback(async (): Promise<string> => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      await logout();
      throw new Error("No refresh token found");
    }

    try {
      await api.get("/auth/rotateToken", {
        withCredentials: true,
      });

      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        throw new Error("Failed to fetch new access token.");
      }

      api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      return accessToken;
    } catch (err) {
      ErrorHandler.logError(err, "Token refresh");
      await logout();
      throw new Error("Token refresh failed");
    }
  }, [logout]);
    


    const loginAdmin = useCallback(
      async (login: AdminLoginFormData) => {
        try {
          const { data } = await api.post(endpoints.auth.loginAdmin, login, {
            withCredentials: true,
          });

          // Wait for cookies to be set
          await new Promise(resolve => setTimeout(resolve, 100));

          const token = Cookies.get("accessToken");

          setUser(data.user);
          if (token) {
            api.defaults.headers["Authorization"] = `Bearer ${token}`;
          }
          localStorage.setItem("currentUser", JSON.stringify(data.user));

          toast({
            title: "Login successful",
            description: "Welcome back!",
            variant: "default",
          });

          navigate('/admin/dashboard'); 
        } catch (error) {
          ErrorHandler.handleApiError(error, "Admin login failed");
        }
      },
      [toast, navigate]
    );

const loginResearcher = useCallback(
  async (login: ResearcherLoginFormData) => {
    try {      
      // Clear any existing tokens first
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      
      const response = await api.post(endpoints.auth.loginResearcher, login, {
        withCredentials: true,
      });

      
      // Extract tokens from response body (if not in cookies)
      const { token, refreshToken, user } = response.data;
      
      // Store tokens in cookies
      if (token) {
        Cookies.set("accessToken", token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: 1 // 1 day
        });
      }
      
      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: 7 // 7 days
        });
      }

      // Set user and authorization header
      setUser(user);
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("currentUser", JSON.stringify(user));

      toast({
        title: "Login successful",
        variant: "default",
      });

      navigate('/researcher/dashboard');
      
    } catch (error) {
      ErrorHandler.handleApiError(error, "Researcher login failed");
    }
  },
  [toast, navigate]
);

    const loginOrganization = useCallback(
      async (login: OrganizationLoginFormData) => {
        try {
          const { data } = await api.post(endpoints.auth.loginOrganization, login, {
            withCredentials: true,
          });

          // Wait for cookies to be set
          await new Promise(resolve => setTimeout(resolve, 100));

          const token = Cookies.get("accessToken");

          setUser(data.user);
          if (token) {
            api.defaults.headers["Authorization"] = `Bearer ${token}`;
          }
          localStorage.setItem("currentUser", JSON.stringify(data.user));

          toast({
            title: "Login successful",
            description: "Welcome back!",
            variant: "default",
          });

          // Check verification status
          const isPending = data.user?.verificationStatus === 'pending' || !data.user?.verified;
          
          if (isPending) {
            // Allow access to dashboard but show verification banner
            toast({
              title: "Verification Pending",
              description: "Your organization is pending verification. You can use all features, but programs won't be public until verified.",
              variant: "default",
            });
          }
          
          // Always redirect to dashboard - banner will show if pending
          navigate('/organization/dashboard');
        } catch (error) {
          ErrorHandler.handleApiError(error, "Organization login failed");
        }
      },
      [toast, navigate]
    );

    const registerResearcher = useCallback(
      async (formData: ResearcherRegisterFormData) => {
        try {
          const { data } = await api.post(endpoints.auth.registerResearcher, formData, {
            withCredentials: true,
          });

          const accessToken = Cookies.get("accessToken");
          setUser(data.user);
          api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
          localStorage.setItem("currentUser", JSON.stringify(data.user));
        } catch (error) {
          ErrorHandler.logError(error, "Researcher registration");
          ErrorHandler.handleApiError(error, "Registration failed");
          throw error; // Re-throw so the form component can handle it
        }
      },
      [toast]
    );

    const registerOrganization = useCallback(
      async (formData: OrganizationRegisterFormData) => {
        try {
          const { data } = await api.post(endpoints.auth.registerOrganization, formData, {
            withCredentials: true,
          });

          const accessToken = Cookies.get("accessToken");
          setUser(data.user);
          api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
          localStorage.setItem("currentUser", JSON.stringify(data.user));
        } catch (error) {
          ErrorHandler.logError(error, "Organization registration");
          ErrorHandler.handleApiError(error, "Registration failed");
          throw error; // Re-throw so the form component can handle it
        }
      },
      [toast]
    );

    const editProfile = useCallback(async (data: UserI) => {
      setUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    }, []);

    const memoizedValue = useMemo(
      () => ({
        user,
        loading,
        authenticated: !!user,
        unauthenticated: !user,
        loginAdmin,
        loginResearcher,
        loginOrganization,
        refreshAuthToken,
        editProfile,
        registerResearcher,
        registerOrganization,
        logout,
      }),
      [
        user,
        loading,
        loginAdmin,
        loginResearcher,
        loginOrganization,
        registerResearcher,
        registerOrganization,
        editProfile,
        refreshAuthToken,
        logout,
      ]
    );

    useEffect(() => {
      const refreshTokenExpiry = Cookies.get("__refreshExpiry_");
      if (refreshTokenExpiry) {
        const expiryTime = new Date(refreshTokenExpiry).getTime();
        const currentTime = Date.now();

        const timeout = setTimeout(() => {
          logout();
        }, expiryTime - currentTime);

        return () => clearTimeout(timeout);
      }
    }, [logout]);

    if (loading) {
      return <LoadingScreen />;
    }

    return (
      <AuthContext.Provider value={memoizedValue}>
        {children}
      </AuthContext.Provider>
    );
  }
