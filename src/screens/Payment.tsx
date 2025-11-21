import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, QrCode } from "lucide-react";

const logo = "/lovable-uploads/750f7a6e-ce06-477e-b176-38d2fe18e906.png";

const Payment = () => {
  const [method, setMethod] = useState<string>("pix");

  useEffect(() => {
    document.title = "Pagamento | Seja Atendido";
  }, []);

  const params = new URLSearchParams(window.location.search);
  const amount = useMemo(() => {
    const val = Number(params.get("amount") ?? 0);
    return Number.isFinite(val) && val > 0 ? val : 150; // valor padrão
  }, [params]);

  const handlePay = (e?: React.FormEvent) => {
    e?.preventDefault();
    toast.success(`Pagamento (${method.toUpperCase()}) simulado com sucesso.`);
  };

  const copyPixCode = async () => {
    try {
      const code = "00020126BR.GOV.BCB.PIX...EXEMPLO";
      await navigator.clipboard.writeText(code);
      toast.success("Código PIX copiado");
    } catch (err) {
      toast.error("Não foi possível copiar o código PIX");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="shrink-0">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Seja Atendido" className="h-7 w-7" />
            <span className="text-xl font-bold">Pagamento</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Métodos de pagamento */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Escolha o método</CardTitle>
                <CardDescription>Selecione como deseja pagar sua consulta</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pix" onValueChange={setMethod} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="pix">PIX</TabsTrigger>
                    <TabsTrigger value="debito">Débito</TabsTrigger>
                    <TabsTrigger value="credito">Crédito</TabsTrigger>
                  </TabsList>

                  {/* PIX */}
                  <TabsContent value="pix" className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-48 h-48 rounded-md bg-muted grid place-items-center">
                        <QrCode className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Escaneie o QR Code acima no app do seu banco ou copie o código PIX.
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={copyPixCode}>Copiar código PIX</Button>
                        <Button onClick={handlePay}>Confirmar pagamento</Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Débito */}
                  <TabsContent value="debito">
                    <form onSubmit={handlePay} className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="numero-debito">Número do cartão</Label>
                        <Input id="numero-debito" inputMode="numeric" placeholder="0000 0000 0000 0000" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nome-debito">Nome impresso no cartão</Label>
                        <Input id="nome-debito" placeholder="Nome completo" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="validade-debito">Validade (MM/AA)</Label>
                          <Input id="validade-debito" placeholder="12/29" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvv-debito">CVV</Label>
                          <Input id="cvv-debito" placeholder="123" inputMode="numeric" required />
                        </div>
                      </div>
                      <Button type="submit" className="justify-center">
                        <CreditCard className="h-4 w-4 mr-2" /> Pagar com débito
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Crédito */}
                  <TabsContent value="credito">
                    <form onSubmit={handlePay} className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="numero-credito">Número do cartão</Label>
                        <Input id="numero-credito" inputMode="numeric" placeholder="0000 0000 0000 0000" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nome-credito">Nome impresso no cartão</Label>
                        <Input id="nome-credito" placeholder="Nome completo" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="validade-credito">Validade (MM/AA)</Label>
                          <Input id="validade-credito" placeholder="12/29" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvv-credito">CVV</Label>
                          <Input id="cvv-credito" placeholder="123" inputMode="numeric" required />
                        </div>
                      </div>
                      <Button type="submit" className="justify-center">
                        <CreditCard className="h-4 w-4 mr-2" /> Pagar com crédito
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <aside>
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
                <CardDescription>Revise os detalhes antes de pagar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Seja Atendido" className="h-8 w-8" />
                  <div>
                    <p className="font-medium">Consulta médica</p>
                    <p className="text-sm text-muted-foreground">Pagamento seguro</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-lg font-semibold">R$ {amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Payment;
