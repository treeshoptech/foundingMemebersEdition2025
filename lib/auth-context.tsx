"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface User {
  userId: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "manager" | "estimator";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { signOut: convexSignOut } = useAuthActions();
  const router = useRouter();

  // Get current user profile
  const currentUser = useQuery(api.users.getCurrentUser);
  const isLoading = currentUser === undefined;

  // Get organization details if user exists
  const organization = useQuery(
    api.organizations.getCurrent,
    currentUser ? {} : "skip"
  );

  const user: User | null = currentUser
    ? {
        userId: currentUser._id,
        organizationId: currentUser.organizationId,
        organizationName: organization?.name || "",
        organizationLogo: organization?.logoUrl,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      }
    : null;

  const signOut = async () => {
    await convexSignOut();
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error: null,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
