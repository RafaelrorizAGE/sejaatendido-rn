
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, TrendingUp, Shield, Settings, BarChart3, UserCheck, AlertCircle } from "lucide-react";
const logo = "/placeholder.svg";

const AdminDashboard = () => {
  const systemStats = {
    totalUsers: 1247,
    activeDoctors: 23,
    totalPatients: 1224,
    todayAppointments: 67,
    systemUptime: "99.9%",
    pendingApprovals: 5
  };

  const recentActivity = [
    {
      id: 1,
      type: "new_doctor",
      message: "Dr. Ana Martins se registrou no sistema",
      time: "2 horas atrás",
      status: "pending"
    },
    {
      id: 2,
      type: "system",
      message: "Backup automático concluído com sucesso",
      time: "4 horas atrás",
      status: "success"
    },
    {
      id: 3,
      type: "alert",
      message: "Alta demanda de consultas detectada",
      time: "6 horas atrás",
      status: "warning"
    },
    {
      id: 4,
      type: "user",
      message: "150 novos pacientes registrados esta semana",
      time: "1 dia atrás",
      status: "info"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_doctor":
        return <UserCheck className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      case "alert":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-orange-600";
      case "pending":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
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
              <Shield className="h-3 w-3 mr-1" />
              Administrador
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Visão geral do sistema e estatísticas em tempo real.</p>
        </div>

        {/* System Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Médicos</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.activeDoctors}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalPatients}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultas hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.todayAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.systemUptime}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendências</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.pendingApprovals}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Atividade recente</span>
              </CardTitle>
              <CardDescription>Últimas atividades do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`mt-1 ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge 
                      variant={activity.status === "pending" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas administrativas</CardTitle>
              <CardDescription>Gerenciamento do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar usuários
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Aprovar médicos
                {systemStats.pendingApprovals > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {systemStats.pendingApprovals}
                  </Badge>
                )}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios do sistema
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Monitorar consultas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
