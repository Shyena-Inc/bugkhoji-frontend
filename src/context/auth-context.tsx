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
import { AdminLoginFormData,ResearcherLoginFormData, OrganizationLoginFormData, ResearcherRegisterFormData,OrganizationRegisterFormData } from "@/types/auth";
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
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser  && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const userFromURL = searchParams.get("currentUser");

    if (userFromURL) {
      try {
        const parsedUser = JSON.parse(userFromURL);
        setUser(parsedUser);
        localStorage.setItem("currentUser", JSON.stringify(parsedUser));
        toast({
          title: "Login Successful",
          variant: "success",
        });
        navigate("/problems", { replace: true });
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast({
          title: "Invalid user data",
          variant: "destructive",
        });
        navigate("/login");
      }
    }
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

  const refreshAuthToken = useCallback(async () => {
    const refreshToken = Cookies.get("__refreshToken_");
    if (!refreshToken) return logout();

    try {
      await api.get("/auth/rotateToken", {
        withCredentials: true,
      });

      const accessToken = Cookies.get("__accessToken_");

      if (!accessToken) {
        throw new Error("Failed to fetch new access token.");
      }

      // localStorage.setItem("authToken", data.accessToken);
      api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      return accessToken;
    } catch (err) {
      console.error("Failed to refresh token", err);
      logout();
    }
  }, [logout]);

  

    const loginAdmin = useCallback(
      async (login: AdminLoginFormData) => {
        try {
          const { data } = await api.post(endpoints.auth.loginAdmin, login, {
            withCredentials: true,
          });

          const token = Cookies.get("__accessToken_");

          setUser(data.data);
          api.defaults.headers["Authorization"] = `Bearer ${token}`;
          localStorage.setItem("currentUser", JSON.stringify(data.data));

          // navigate('/dashboard');
        } catch (error) {
          // Handle error, e.g., show toast
          toast({
            title: "Login failed",
            description: error instanceof Error ? error.message : "An unknown error occurred",
            variant: "destructive",
          });
        }
      },
      [toast]
    );

    const loginResearcher = useCallback(
      async (login: AdminLoginFormData) => {
        try {
          const { data } = await api.post(endpoints.auth.loginResearcher, login, {
            withCredentials: true,
          });

          const token = Cookies.get("__accessToken_");

          setUser(data.data);
          api.defaults.headers["Authorization"] = `Bearer ${token}`;
          localStorage.setItem("currentUser", JSON.stringify(data.data));

          // navigate('/dashboard');
        } catch (error) {
          // Handle error, e.g., show toast
          toast({
            title: "Login failed",
            description: error instanceof Error ? error.message : "An unknown error occurred",
            variant: "destructive",
          });
        }
      },
      [toast]
    );
    const loginOrganization = useCallback(
      async (login: AdminLoginFormData) => {
        try {
          const { data } = await api.post(endpoints.auth.loginOrganization, login, {
            withCredentials: true,
          });

          const token = Cookies.get("__accessToken_");

          setUser(data.data);
          api.defaults.headers["Authorization"] = `Bearer ${token}`;
          localStorage.setItem("currentUser", JSON.stringify(data.data));

          // navigate('/dashboard');
        } catch (error) {
          // Handle error, e.g., show toast
          toast({
            title: "Login failed",
            description: error instanceof Error ? error.message : "An unknown error occurred",
            variant: "destructive",
          });
        }
      },
      [toast]
    );

 const registerResearcher = useCallback(
  async (formData: ResearcherRegisterFormData) => {
    try {
      const { data } = await api.post(endpoints.auth.registerResearcher, formData, {
        withCredentials: true,
      });

      const accessToken = Cookies.get("__accessToken_");
      setUser(data.data);
      api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      localStorage.setItem("currentUser", JSON.stringify(data.data));
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
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
      setUser(data.data);
      api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      localStorage.setItem("currentUser", JSON.stringify(data.data));
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
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
