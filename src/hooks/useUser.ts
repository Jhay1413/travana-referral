import {
  authClient,
  type ExtendedSession,
  type ExtendedUser,
} from "@/lib/auth-client";

export function useUser() {
  const { data: session, isPending } = authClient.useSession();

  // Type the session as ExtendedSession
  const typedSession = session as ExtendedSession | undefined;
  const user = typedSession?.user as ExtendedUser | undefined;

  // Extract user information from session
  const userId = user?.id;
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "";
  const lastName =
    user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "";
  const email = user?.email || "";
  const role = user?.role || "";
  const phoneNumber = user?.phoneNumber || "";
  const image = user?.image || "";
  const roles = user?.role || [];

  // Helper function to get full name
  const getFullName = () => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return user?.name || firstName || "User";
  };

  // Helper function to get initials
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (user?.name) {
      const nameParts = user.name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(
          0
        )}`.toUpperCase();
      }
      return nameParts[0].charAt(0).toUpperCase();
    }
    return "U";
  };

  // Check if user is admin

  return {
    // Session state
    isPending,
    isAuthenticated: !!typedSession,

    // User data
    user,
    userId,
    firstName,
    lastName,
    email,
    role,
    phoneNumber,
    image,
    roles,

    // Helper functions
    getFullName,
    getInitials,
  };
}
