
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Stethoscope, User, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
const logo = "/placeholder.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login realizado com sucesso!");
      
      // Redirect based on user type
      switch (userType) {
        case "doctor":
          navigate("/dashboard-medico");
          break;
        case "admin":
          navigate("/dashboard-admin");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    }, 1500);
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="h-5 w-5" />;
      case "admin":
        return <Shield className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "doctor":
        return "Médico";
      case "admin":
        return "Administrador";
      default:
        return "Paciente";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img src={logo} alt="Seja Atendido" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-900">Seja Atendido</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">
              Entre em sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de usuário</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={setUserType}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <RadioGroupItem value="patient" id="patient" className="sr-only" />
                    <Label 
                      htmlFor="patient" 
                      className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        userType === "patient" 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <User className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Paciente</span>
                    </Label>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <RadioGroupItem value="doctor" id="doctor" className="sr-only" />
                    <Label 
                      htmlFor="doctor" 
                      className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        userType === "doctor" 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Stethoscope className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Médico</span>
                    </Label>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <RadioGroupItem value="admin" id="admin" className="sr-only" />
                    <Label 
                      htmlFor="admin" 
                      className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        userType === "admin" 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Shield className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Admin</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {getUserTypeIcon(userType)}
                <span className="ml-2">
                  {isLoading ? "Entrando..." : `Entrar como ${getUserTypeLabel(userType)}`}
                </span>
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
            
            <div className="mt-6 text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
