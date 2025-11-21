
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
const logo = "/lovable-uploads/750f7a6e-ce06-477e-b176-38d2fe18e906.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Seja Atendido" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-900">Seja Atendido</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">
              Entrar
            </Link>
            <Link to="/signup">
              <Button>Começar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Saúde Feita de Forma <span className="text-primary">Simples</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Agende consultas com profissionais de saúde confiáveis, gerencie seus registros médicos
            e receba o cuidado que você merece - tudo em uma plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Consulta
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher o Seja Atendido?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experimente a saúde de forma moderna com nossa plataforma abrangente projetada para pacientes e profissionais de saúde.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Agendamento Fácil</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Agende consultas 24/7 com disponibilidade em tempo real e confirmação instantânea.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Seguro e Privado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seus dados de saúde são protegidos com segurança de nível empresarial e conformidade com a LGPD.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Médicos Confiáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Conecte-se com profissionais de saúde verificados em todas as especialidades.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de pacientes que confiam no Seja Atendido para suas necessidades de saúde.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary">
              Criar sua conta
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src={logo} alt="Seja Atendido" className="h-6 w-6" />
            <span className="text-xl font-bold">Seja Atendido</span>
          </div>
          <p className="text-gray-400">
            © 2025 Seja Atendido. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
