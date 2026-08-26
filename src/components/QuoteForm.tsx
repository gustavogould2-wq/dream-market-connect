import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";

export function QuoteForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const message = [
      `Olá! Meu nome é ${name || "(não informado)"}.`,
      company ? `Empresa: ${company}.` : null,
      phone ? `Telefone: ${phone}.` : null,
      interest ? `Interesse: ${interest}.` : null,
      "Gostaria de um orçamento personalizado de painel de LED.",
    ]
      .filter(Boolean)
      .join(" ");

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quote-name">Nome</Label>
          <Input
            id="quote-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote-company">Empresa</Label>
          <Input
            id="quote-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nome da empresa"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote-phone">Telefone</Label>
          <Input
            id="quote-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(13) 90000-0000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quote-interest">Interesse</Label>
          <Input
            id="quote-interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Ex.: letreiro outdoor 3x1,5 m"
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
        Enviar pelo WhatsApp
      </Button>
    </form>
  );
}
