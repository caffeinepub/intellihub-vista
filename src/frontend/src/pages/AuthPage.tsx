import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const { login, register } = useAuth();

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await login(loginUsername, loginPassword);
      toast.success("Welcome back!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regName || !regUsername || !regPassword) {
      setRegError("All fields are required");
      return;
    }
    setRegLoading(true);
    try {
      await register(regName, regUsername, regPassword);
      toast.success("Account created! Welcome to IntelliHub Vista.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 330), transparent)",
          animation: "float 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 12), transparent)",
          animation: "float 5s ease-in-out infinite reverse",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="gradient-border rounded-2xl bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo + Title */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.22 330), oklch(0.65 0.22 12))",
                }}
              />
              <img
                src="/assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-1.png"
                alt="IntelliHub Vista"
                className="w-20 h-20 object-contain relative z-10"
              />
            </motion.div>
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold gradient-text">
                IntelliHub Vista
              </h1>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1 justify-center">
                <Sparkles className="w-3 h-3" />
                Your gateway to AI-powered tools
              </p>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
              <TabsTrigger
                value="login"
                data-ocid="auth.login_tab"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                data-ocid="auth.register_tab"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="login-username"
                    className="text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Username
                  </Label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    data-ocid="auth.username.input"
                    className="bg-muted/30 border-border/50 focus:border-primary/50 focus-visible:ring-primary/30"
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className="text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    data-ocid="auth.password.input"
                    className="bg-muted/30 border-border/50 focus:border-primary/50 focus-visible:ring-primary/30"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {loginError && (
                  <p
                    data-ocid="auth.error_state"
                    className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                  >
                    {loginError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loginLoading}
                  data-ocid="auth.login.submit_button"
                  className="w-full mt-2 font-semibold"
                  style={{
                    background: loginLoading
                      ? undefined
                      : "linear-gradient(135deg, oklch(0.62 0.24 330), oklch(0.65 0.22 12))",
                    border: "none",
                  }}
                >
                  {loginLoading ? (
                    <span
                      data-ocid="auth.login.loading_state"
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="reg-name"
                    className="text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Your full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    data-ocid="auth.name.input"
                    className="bg-muted/30 border-border/50 focus:border-primary/50 focus-visible:ring-primary/30"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="reg-username"
                    className="text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Username
                  </Label>
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="Choose a username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    data-ocid="auth.username.input"
                    className="bg-muted/30 border-border/50 focus:border-primary/50 focus-visible:ring-primary/30"
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="reg-password"
                    className="text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Password
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Create a password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    data-ocid="auth.password.input"
                    className="bg-muted/30 border-border/50 focus:border-primary/50 focus-visible:ring-primary/30"
                    autoComplete="new-password"
                    required
                  />
                </div>

                {regError && (
                  <p
                    data-ocid="auth.error_state"
                    className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                  >
                    {regError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={regLoading}
                  data-ocid="auth.register.submit_button"
                  className="w-full mt-2 font-semibold"
                  style={{
                    background: regLoading
                      ? undefined
                      : "linear-gradient(135deg, oklch(0.62 0.24 330), oklch(0.65 0.22 12))",
                    border: "none",
                  }}
                >
                  {regLoading ? (
                    <span
                      data-ocid="auth.register.loading_state"
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
