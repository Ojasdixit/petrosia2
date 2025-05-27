import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@shared/schema";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const signupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
  firstName: z.string().min(2, {
    message: "First name is required",
  }),
  lastName: z.string().min(2, {
    message: "Last name is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  role: z.enum(["buyer", "seller", "admin"] as const),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthForms = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const mode = searchParams.get("mode");
  const role = searchParams.get("role") as UserRole | null;
  
  const { loginMutation, registerMutation, guestLoginMutation, user } = useAuth();

  // Create form instances
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: selectedRole,
      terms: false,
    },
  });

  // The redirect when user is logged in is now handled in the parent AuthPage component

  // Set the active tab based on URL parameters
  useEffect(() => {
    if (mode === "login" || mode === "signup") {
      setActiveTab(mode);
    }
  }, [mode]);

  // Set the selected role based on URL parameters
  useEffect(() => {
    if (role && (role === "buyer" || role === "seller")) {
      setSelectedRole(role);
      signupForm.setValue("role", role);
    }
  }, [role, signupForm]);

  // Handle form submissions
  const handleLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const handleSignupSubmit = (values: SignupFormValues) => {
    // Remove confirmPassword and terms as they are not part of the API schema
    const { confirmPassword, terms, ...signupData } = values;
    registerMutation.mutate(signupData);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    signupForm.setValue("role", role);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-neutral-900">
            Welcome Back
          </h2>
          <p className="text-neutral-600">
            Login to access your account and manage your pet listings or inquiries.
          </p>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">LOGIN WITH YOUR ACCOUNT</span>
            </div>
          </div>

          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-4 mt-6"
            >
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-primary"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          
          {/* Guest Login Button */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => guestLoginMutation.mutate()}
              disabled={guestLoginMutation.isPending}
            >
              {guestLoginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Continuing as Guest
                </>
              ) : (
                "Browse as Guest (No Registration Required)"
              )}
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-neutral-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </Button>
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="signup">
        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-neutral-900">
            Create an Account
          </h2>
          <p className="text-neutral-600">
            Join Petrosia to find your perfect pet or connect with pet lovers.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={selectedRole === "buyer" ? "default" : "outline"}
                className={
                  selectedRole === "buyer"
                    ? "border-2 border-primary bg-primary text-white"
                    : "border-2 border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary"
                }
                onClick={() => handleRoleSelect("buyer")}
              >
                Buyer
              </Button>
              <Button
                type="button"
                variant={selectedRole === "seller" ? "default" : "outline"}
                className={
                  selectedRole === "seller"
                    ? "border-2 border-primary bg-primary text-white"
                    : "border-2 border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary"
                }
                onClick={() => handleRoleSelect("seller")}
              >
                Seller
              </Button>
            </div>
          </div>

          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(handleSignupSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:text-primary-dark"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:text-primary-dark"
                        >
                          Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    Account
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setActiveTab("login")}
              >
                Login
              </Button>
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForms;
