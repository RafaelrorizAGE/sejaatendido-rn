
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Bell, Plus, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
const logo = "/placeholder.svg";

const Dashboard = () => {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologia",
      date: "2024-01-15",
      time: "10:00",
      status: "confirmado"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologia",
      date: "2024-01-18",
      time: "14:30",
      status: "pendente"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Seja Atendido" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-900">Seja Atendido</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta, João!</h1>
          <p className="text-gray-600">Aqui está o que está acontecendo com sua saúde hoje.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link to="/book-appointment">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Plus className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle>Agendar consulta</CardTitle>
                <CardDescription>Agende com seu médico preferido</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <User className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Meu perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Chat com médicos</CardTitle>
                <CardDescription>Converse com seus médicos</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/medical-records">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-2 text-primary" />
                <CardTitle>Histórico médico</CardTitle>
                <CardDescription>Veja seu histórico de saúde</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Próximas consultas</span>
            </CardTitle>
            <CardDescription>Suas consultas agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Nenhuma consulta agendada</p>
                <Link to="/book-appointment">
                  <Button>Agende sua primeira consulta</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={appointment.status === "confirmado" ? "default" : "secondary"}
                      >
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
