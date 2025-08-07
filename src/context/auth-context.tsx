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
      console.log('=== AUTH PROVIDER DEBUG ===');

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
          console.error("Error parsing user data from URL:", error);
          toast({
            title: "Invalid user data",
            variant: "destructive",
          });
          navigate("/login");
          setLoading(false);
          return;
        }
      }

      // If no URL user data, check localStorage
      const storedUser = localStorage.getItem("currentUser");
      console.log('Stored user from localStorage:', storedUser);

      if (storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Parsed user:', parsedUser);
          setUser(parsedUser);

          const token = Cookies.get("accessToken");
          if (token) {
            api.defaults.headers["Authorization"] = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      } else {
        console.log('No valid user found in localStorage');
      }

      console.log('Auth loading set to false');
      setLoading(false);
    }, [navigate, searchParams, toast]);

    const logout = useCallback(
      async (req: boolean = true) => {
        if (req) {
          try {
            const res = await api.get(endpoints.auth.logout);
            toast({
              title: "Success",
              description: res.data.message,
              variant: "default",
            });
          } catch (err) {
            toast({
              title: "Error",
              description: err.message,
              variant: "destructive",
            });
          }
        }
        setUser(null);
        localStorage.removeItem("currentUser");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/");
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
      console.error("Failed to refresh token", err);
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

          navigate('/dashboard'); 
        } catch (error) {
          toast({
            title: "Login failed",
            description: error?.response?.data?.message || error?.message || "An unknown error occurred",
            variant: "destructive",
          });
        }
      },
      [toast, navigate]
    );

const loginResearcher = useCallback(
  async (login: ResearcherLoginFormData) => {
    try {
      console.log('Starting researcher login...');
      
      // Clear any existing tokens first
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      
      const response = await api.post(endpoints.auth.loginResearcher, login, {
        withCredentials: true,
      });

      console.log('Login response:', response);
      
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

      // Verify tokens were stored
      console.log('Stored accessToken:', Cookies.get("accessToken"));
      console.log('Stored refreshToken:', Cookies.get("refreshToken"));
      
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
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
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

          navigate('/organizer/dashboard');
        } catch (error) {
          toast({
            title: "Login failed",
            description: error?.response?.data?.message || error?.message || "An unknown error occurred",
            variant: "destructive",
          });
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
          console.error('=== REGISTRATION ERROR DEBUG ===');
          console.error('Full error object:', error);
          console.error('Error response data:', error?.response?.data);
          console.error('Error response status:', error?.response?.status);
          console.error('Error response headers:', error?.response?.headers);
          console.error('Error message:', error?.message);
          console.error('===================================');
          
          toast({
            title: "Registration failed",
            description: error?.response?.data?.error || error?.response?.data?.message || error?.message || "An unknown error occurred",
            variant: "destructive",
          });
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
          console.error('=== ORGANIZATION REGISTRATION ERROR DEBUG ===');
          console.error('Full error object:', error);
          console.error('Error response data:', error?.response?.data);
          console.error('Error response status:', error?.response?.status);
          console.error('Error response headers:', error?.response?.headers);
          console.error('Error message:', error?.message);
          console.error('===================================');
          
          toast({
            title: "Registration failed",
            description: error?.response?.data?.error || error?.response?.data?.message || error?.message || "An unknown error occurred",
            variant: "destructive",
          });
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
