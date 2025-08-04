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
        const token = Cookies.get("__accessToken_");
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

        const token = Cookies.get("__accessToken_");
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
      Cookies.remove("__accessToken_");
      Cookies.remove("__refreshToken_");
      navigate("/");
    },
    [navigate, toast]
  );

  const refreshAuthToken = useCallback(async (): Promise<string> => {
  const refreshToken = Cookies.get("__refreshToken_");
  if (!refreshToken) {
    await logout();
    throw new Error("No refresh token found");
  }

  try {
    await api.get("/auth/rotateToken", {
      withCredentials: true,
    });

    const accessToken = Cookies.get("__accessToken_");

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

        const token = Cookies.get("__accessToken_");

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
      console.log('=== LOGIN RESEARCHER DEBUG ===');
      console.log('1. Starting login with data:', login);
      
      const { data } = await api.post(endpoints.auth.loginResearcher, login, {
        withCredentials: true,
      });
      
      console.log('2. Login API response:', data);
      console.log('3. Response headers:', data.headers);
      
      // Check cookies immediately
      console.log('4. Cookies before delay:', {
        accessToken: Cookies.get("__accessToken_"),
        refreshToken: Cookies.get("__refreshToken_"),
        refreshExpiry: Cookies.get("__refreshExpiry_")
      });
      
      // Wait a bit for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const token = Cookies.get("__accessToken_");
      console.log('5. Access token after delay:', token);
      
      if (!token) {
        console.error('6. NO TOKEN FOUND! Check backend cookie settings');
        console.log('7. All cookies:', document.cookie);
      }
      
      console.log('8. Setting user data:', data.user);
      setUser(data.user);
      
      if (token) {
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
        console.log('9. Authorization header set');
      }
      
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      console.log('10. User stored in localStorage:', localStorage.getItem("currentUser"));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "default",
      });

      console.log('11. Navigating to /researcher/dashboard');
      navigate('/researcher/dashboard');
      
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: "Login failed",
        description: error?.response?.data?.message || error?.message || "An unknown error occurred",
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

        const token = Cookies.get("__accessToken_");

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

        const accessToken = Cookies.get("__accessToken_");
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

        const accessToken = Cookies.get("__accessToken_");
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
