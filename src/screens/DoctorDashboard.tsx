
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Bell, Plus, Stethoscope, FileText, Users } from "lucide-react";
const logo = "/placeholder.svg";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const todaysAppointments = [
    {
      id: 1,
      patient: "Maria Silva",
      time: "09:00",
      type: "Consulta de rotina",
      status: "confirmado"
    },
    {
      id: 2,
      patient: "João Santos",
      time: "10:30",
      type: "Retorno",
      status: "confirmado"
    },
    {
      id: 3,
      patient: "Ana Costa",
      time: "14:00",
      type: "Primeira consulta",
      status: "pendente"
    },
    {
      id: 4,
      patient: "Carlos Oliveira",
      time: "15:30",
      type: "Exames",
      status: "confirmado"
    }
  ];

  const stats = {
    totalPatients: 156,
    todayAppointments: 8,
    pendingReports: 3,
    nextAppointment: "09:00"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Seja Atendido" className="h-8 w-8" />
            <span className="text-2xl font-bold text-gray-900">Seja Atendido</span>
            <Badge variant="secondary" className="ml-2">
              <Stethoscope className="h-3 w-3 mr-1" />
              Médico
            </Badge>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bom dia, Dr. Ricardo!</h1>
          <p className="text-gray-600">Você tem {stats.todayAppointments} consultas agendadas para hoje.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Relatórios</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Próxima</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.nextAppointment}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Consultas de hoje</span>
              </CardTitle>
              <CardDescription>Sua agenda para {new Date().toLocaleDateString('pt-BR')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={appointment.status === "confirmado" ? "default" : "secondary"}
                      >
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Atender
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações rápidas</CardTitle>
              <CardDescription>Ferramentas do dia a dia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova consulta
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Criar relatório
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar pacientes
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Ver agenda completa
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
