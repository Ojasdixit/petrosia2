import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { UserRole } from "@shared/schema";

export function ProtectedRoute({
  path,
  component: Component,
  role,
}: {
  path: string;
  component: () => React.JSX.Element;
  role?: UserRole;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth?mode=login" />
      </Route>
    );
  }

  // Check if role-specific access is required
  if (role && user.role !== role && user.role !== "admin") {
    // Admin can access all routes, but other roles are restricted
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}
