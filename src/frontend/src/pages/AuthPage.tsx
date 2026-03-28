import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ParticleBackground from "../components/ParticleBackground";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const { login, register } = useAuth();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

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
      {/* Particle background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Glass Card */}
          <div className="glass-card gradient-border rounded-2xl p-8 shadow-2xl">
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
                <img
                  src="/assets/uploads/Hexagonal-Neural-Hub-Icon-with-Vibrant-Colors_20260307_184744_0000-2-1.png"
                  alt="IntelliHub Vista Logo"
                  className="w-24 h-24 object-contain logo-pulse"
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
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
                <TabsTrigger
                  value="login"
                  data-ocid="auth.login_tab"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-foreground"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  data-ocid="auth.register_tab"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-foreground"
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
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus-visible:ring-primary/30"
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
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus-visible:ring-primary/30"
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
                    className="w-full mt-2 font-semibold btn-gradient active:scale-95 transition-transform"
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
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus-visible:ring-primary/30"
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
                      data-ocid="auth.reg_username.input"
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus-visible:ring-primary/30"
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
                      data-ocid="auth.reg_password.input"
                      className="bg-white/5 border-white/10 focus:border-primary/50 focus-visible:ring-primary/30"
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
                    className="w-full mt-2 font-semibold btn-gradient active:scale-95 transition-transform"
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

          {/* Created by */}
          <div className="mt-5 rounded-xl glass-card px-5 py-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-semibold">
              Created by
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {[
                "Vishruth Raj. S",
                "Vasanth. S",
                "Vigneshwaran. C",
                "Venkatesan. K",
              ].map((name, i) => (
                <span key={name} className="text-sm font-medium gradient-text">
                  {i + 1}. {name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
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
    </div>
  );
}
