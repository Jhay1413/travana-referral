import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authClient } from "./auth-client";

export const PrivateRouteWrapper = () => {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();
  
  console.log(isPending);
  // Show loading while session is being fetched (isPending handles the initial null state)
  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if no session (session is undefined means not authenticated)
  if (!session) {
    // Store the attempted location in URL as redirect parameter
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/?redirect=${redirectPath}`} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
