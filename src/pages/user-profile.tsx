import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalInformation } from "@/components/personal-information";
import { AccountSettings } from "@/components/account-settings";
import { useUser } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Calendar,
  Camera,
  LogOut,
  Clock,
} from "lucide-react";

export const UserProfile = () => {
  const {
    firstName,
    lastName,
    email,
    role,
    phoneNumber,
    image
  } = useUser();

  const session = authClient.useSession();

  // Placeholder data for demonstration
  const placeholderData = {
    firstName: firstName || "John",
    lastName: lastName || "Doe",
    email: email || "john.doe@example.com",
    phoneNumber: phoneNumber || "+1 (555) 123-4567",
    role: role || "Agent",
    memberSince: "2023",
    totalReferrals: 24,
    totalCommissions: 1250.50,
    lastLogin: "2 hours ago"
  };

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };


  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'agent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (placeholderData.firstName && placeholderData.lastName) {
      return `${placeholderData.firstName} ${placeholderData.lastName}`;
    }
    return placeholderData.firstName || "User";
  };

  // Helper function to get display initials
  const getDisplayInitials = () => {
    if (placeholderData.firstName && placeholderData.lastName) {
      return `${placeholderData.firstName.charAt(0)}${placeholderData.lastName.charAt(0)}`.toUpperCase();
    }
    if (placeholderData.firstName) {
      return placeholderData.firstName.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      {image ? (
                        <img
                          src={image}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {getDisplayInitials()}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full"
                      onClick={() => toast.info("Photo upload coming soon!")}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {getDisplayName()}
                    </h2>
                    <p className="text-muted-foreground text-sm">{placeholderData.email}</p>
                    <Badge className={getRoleColor(placeholderData.role)}>
                      {placeholderData.role}
                    </Badge>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {session.data?.user?.createdAt ? new Date(session.data.user.createdAt).getFullYear() : placeholderData.memberSince}</span>
                  </div>

                  {/* Statistics */}
                  <div className="w-full space-y-3 mt-6">

                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Last Login</span>
                      </div>
                      <span className="font-semibold text-foreground">{new Date().toDateString()}</span>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full mt-4"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInformation
              placeholderData={placeholderData}
              getRoleColor={getRoleColor}
            />
            <AccountSettings />
          </div>
        </div>
      </div>
    </div>
  );
};
