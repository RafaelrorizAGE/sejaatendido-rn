
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Heart, ArrowLeft, Star, MapPin } from "lucide-react";
const logo = "/lovable-uploads/750f7a6e-ce06-477e-b176-38d2fe18e906.png";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologia",
      rating: 4.9,
      reviews: 127,
      location: "Centro Médico Downtown",
      experience: "15 anos",
      price: 150,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatologia",
      rating: 4.8,
      reviews: 98,
      location: "Clínica de Cuidados da Pele",
      experience: "12 anos",
      price: 120,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatria",
      rating: 4.9,
      reviews: 156,
      location: "Centro de Saúde Infantil",
      experience: "18 anos",
      price: 100,
      image: "/placeholder.svg"
    }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30"
  ];

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Por favor, selecione um médico, data e horário");
      return;
    }

    toast.success("Consulta agendada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Seja Atendido" className="h-6 w-6" />
            <span className="text-xl font-bold text-gray-900">Agendar consulta</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Escolha um médico</h2>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`cursor-pointer transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full bg-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{doctor.rating} ({doctor.reviews} avaliações)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{doctor.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="secondary">{doctor.experience} de experiência</Badge>
                          <span className="text-lg font-semibold text-gray-900">R$ {doctor.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Selecionar data</CardTitle>
                <CardDescription>Escolha sua data de preferência para a consulta</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Selection */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecionar horário</CardTitle>
                  <CardDescription>Horários disponíveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="justify-center"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Summary */}
            {selectedDoctor && selectedDate && selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data e horário</p>
                    <p className="font-medium">
                      {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taxa de consulta</p>
                    <p className="font-medium">R$ {selectedDoctor.price}</p>
                  </div>
                  <Button onClick={handleBookAppointment} className="w-full">
                    Agendar consulta
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
