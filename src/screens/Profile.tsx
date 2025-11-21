
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Save, ArrowLeft } from "lucide-react";
const logo = "/placeholder.svg";
import { Link } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    birthDate: "1990-01-15",
    address: "Rua das Flores, 123, São Paulo - SP",
    emergencyContact: "Maria Silva - (11) 88888-8888"
  });

  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: "O+",
    allergies: "Penicilina, Frutos do mar",
    medications: "Losartana 50mg",
    conditions: "Hipertensão",
    insurance: "Unimed",
    insuranceNumber: "123456789"
  });

  const handleSave = () => {
    console.log("Saving profile...", { personalInfo, medicalInfo });
    // Here you would connect to your backend/database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Seja Atendido" className="h-8 w-8" />
              <span className="text-2xl font-bold text-gray-900">Seja Atendido</span>
            </div>
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
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="João Silva" />
                  <AvatarFallback className="text-lg">JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{personalInfo.name}</h1>
                  <p className="text-gray-600">{personalInfo.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">
                      <User className="h-3 w-3 mr-1" />
                      Paciente
                    </Badge>
                    <Badge variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  </div>
                </div>
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  Alterar foto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="medical">Informações Médicas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={personalInfo.cpf}
                        onChange={(e) => setPersonalInfo({...personalInfo, cpf: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de nascimento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={personalInfo.birthDate}
                        onChange={(e) => setPersonalInfo({...personalInfo, birthDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contato de emergência</Label>
                      <Input
                        id="emergencyContact"
                        value={personalInfo.emergencyContact}
                        onChange={(e) => setPersonalInfo({...personalInfo, emergencyContact: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Information Tab */}
            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Médicas</CardTitle>
                  <CardDescription>Mantenha suas informações médicas atualizadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Tipo sanguíneo</Label>
                      <Input
                        id="bloodType"
                        value={medicalInfo.bloodType}
                        onChange={(e) => setMedicalInfo({...medicalInfo, bloodType: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurance">Plano de saúde</Label>
                      <Input
                        id="insurance"
                        value={medicalInfo.insurance}
                        onChange={(e) => setMedicalInfo({...medicalInfo, insurance: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Alergias</Label>
                    <Input
                      id="allergies"
                      value={medicalInfo.allergies}
                      onChange={(e) => setMedicalInfo({...medicalInfo, allergies: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Medicamentos em uso</Label>
                    <Input
                      id="medications"
                      value={medicalInfo.medications}
                      onChange={(e) => setMedicalInfo({...medicalInfo, medications: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditions">Condições médicas</Label>
                    <Input
                      id="conditions"
                      value={medicalInfo.conditions}
                      onChange={(e) => setMedicalInfo({...medicalInfo, conditions: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>Gerencie suas preferências</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificações por email</h3>
                      <p className="text-sm text-gray-600">Receba lembretes de consultas por email</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificações push</h3>
                      <p className="text-sm text-gray-600">Receba notificações no seu dispositivo</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Privacidade</h3>
                      <p className="text-sm text-gray-600">Gerencie suas configurações de privacidade</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Alterar senha</h3>
                      <p className="text-sm text-gray-600">Atualize sua senha de acesso</p>
                    </div>
                    <Button variant="outline">Alterar</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
