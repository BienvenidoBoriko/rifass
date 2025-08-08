"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import CountdownTimer from "@/components/CountdownTimer";
import TicketSelector from "@/components/TicketSelector";
import PaymentInstructions from "@/components/PaymentInstructions";
import LoginModal from "@/components/LoginModal";
import { useRaffle, useAvailableTickets } from "@/hooks/use-raffles";
import { usePurchaseTickets } from "@/hooks/usePurchaseTickets";
import { useSession } from "next-auth/react";

export default function RaffleDetails() {
  const params = useParams();

  const { data: session } = useSession();

  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const id = params?.id as string;
  if (!id) {
    return <div>Raffle not found</div>;
  }

  const raffleId = parseInt(id);
  const { raffle, loading: raffleLoading } = useRaffle(raffleId);
  const { tickets: availableTickets, loading: ticketsLoading } =
    useAvailableTickets(raffleId);
  const { purchaseTickets, loading: purchaseLoading } = usePurchaseTickets();

  const handlePurchase = async () => {
    if (!session?.user) {
      setShowLoginModal(true);
      return;
    }

    if (selectedTickets.length === 0) {
      toast.error("Debes seleccionar al menos un boleto para continuar.");
      return;
    }

    if (!paymentMethod) {
      toast.error("Debes seleccionar un método de pago.");
      return;
    }

    const result = await purchaseTickets({
      raffleId,
      ticketNumbers: selectedTickets,
      paymentMethod,
    });

    if (result) {
      toast.success(
        "Tus boletos han sido reservados. Completa el pago para confirmarlos."
      );
      setShowPayment(true);
      setSelectedTickets([]);
    }
  };

  const handlePaymentComplete = (reference: string) => {
    toast.success("Tu pago ha sido confirmado. Tus boletos están activos.");
    setShowPayment(false);
  };

  if (raffleLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="bg-slate-200 h-8 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-200 h-96 rounded"></div>
            <div className="space-y-4">
              <div className="bg-slate-200 h-4 rounded w-3/4"></div>
              <div className="bg-slate-200 h-4 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Rifa no encontrada
          </h1>
          <p className="text-slate-600">
            La rifa que buscas no existe o ha sido eliminada.
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = (raffle.soldTickets / raffle.totalTickets) * 100;
  const timeLeft = new Date(raffle.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {raffle.title}
          </h1>
          <p className="text-xl text-slate-600">{raffle.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={raffle.imageUrl || "/placeholder-car.jpg"}
                alt={raffle.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ${raffle.pricePerTicket}/boleto
              </div>
            </div>

            {/* Gallery */}
            {raffle.galleryImages && raffle.galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {raffle.galleryImages.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${raffle.title} ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details and Purchase */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Información de la Rifa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      {daysLeft > 0
                        ? `${daysLeft} días restantes`
                        : "Último día"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      {raffle.soldTickets}/{raffle.totalTickets} vendidos
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Progreso de venta</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Sorteo: {new Date(raffle.drawDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Countdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span>Tiempo Restante</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CountdownTimer endDate={new Date(raffle.endDate)} />
              </CardContent>
            </Card>

            {/* Purchase Section */}
            {!showPayment ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span>Comprar Boletos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Método de Pago
                    </label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona método de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zelle">Zelle</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="zinli">Zinli</SelectItem>
                        <SelectItem value="pago-movil">Pago Móvil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TicketSelector
                    availableTickets={availableTickets}
                    loading={ticketsLoading}
                    selectedTickets={selectedTickets}
                    onSelectionChange={setSelectedTickets}
                    pricePerTicket={raffle.pricePerTicket}
                  />

                  <Button
                    onClick={handlePurchase}
                    disabled={purchaseLoading || selectedTickets.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {purchaseLoading ? "Procesando..." : "Comprar Boletos"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <PaymentInstructions
                onComplete={handlePaymentComplete}
                totalAmount={selectedTickets.length * raffle.pricePerTicket}
                paymentMethod={paymentMethod}
              />
            )}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
