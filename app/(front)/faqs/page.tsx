"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "General",
    question: "¿Cómo funciona  GanaXDar?",
    answer:
      " GanaXDar es una plataforma de rifas de vehículos donde puedes comprar boletos numerados para participar en sorteos. Cada rifa tiene un número limitado de boletos (0000-9999) y un premio específico. El sorteo se realiza en la fecha programada y el ganador se selecciona de forma aleatoria y transparente.",
  },
  {
    category: "General",
    question: "¿Es legal participar en estas rifas?",
    answer:
      "Sí, nuestras rifas son completamente legales y están reguladas según las leyes aplicables. Operamos con todas las licencias necesarias y cumplimos con las regulaciones locales e internacionales.",
  },
  {
    category: "Compra",
    question: "¿Cómo compro boletos?",
    answer:
      "Para comprar boletos: 1) Selecciona la rifa de tu interés, 2) Elige tus números de la suerte o déjanos seleccionar aleatoriamente, 3) Completa tu información personal, 4) Selecciona tu método de pago preferido, 5) Confirma tu compra. Recibirás una confirmación por email.",
  },
  {
    category: "Compra",
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos múltiples métodos de pago: Zelle, PayPal, Binance Pay y Pago Móvil. Todos los pagos son procesados de forma segura y requieren comprobante de pago para su validación.",
  },
  {
    category: "Compra",
    question: "¿Puedo elegir mis números?",
    answer:
      "¡Absolutamente! Puedes elegir tus números específicos (0000-9999) o usar nuestra función de selección aleatoria. También puedes buscar números específicos que tengan significado especial para ti.",
  },
  {
    category: "Sorteos",
    question: "¿Cómo se realizan los sorteos?",
    answer:
      "Todos nuestros sorteos se realizan en vivo y son grabados para garantizar transparencia. Utilizamos sistemas de selección aleatoria auditados por terceros independientes. Los videos de los sorteos están disponibles públicamente.",
  },
  {
    category: "Sorteos",
    question: "¿Qué pasa si no se venden todos los boletos?",
    answer:
      "Cada rifa tiene un número mínimo de boletos que deben venderse para realizar el sorteo. Si no se alcanza este mínimo, la rifa puede posponerse o cancelarse, en cuyo caso se reembolsa el 100% del dinero a los participantes.",
  },
  {
    category: "Premios",
    question: "¿Cómo reclamo mi premio si gano?",
    answer:
      "Si ganas, te contactaremos dentro de 48 horas a través del email y teléfono proporcionados. Tendrás 30 días para reclamar tu premio. Necesitarás verificar tu identidad y completar la documentación necesaria.",
  },
  {
    category: "Premios",
    question: "¿Los premios son reales?",
    answer:
      "¡Sí! Todos nuestros premios son 100% reales. Los vehículos están físicamente disponibles y verificados antes de cada sorteo. Publicamos fotos, videos y documentación de cada premio.",
  },
  {
    category: "Premios",
    question: "¿Debo pagar impuestos sobre el premio?",
    answer:
      "Los ganadores son responsables de todos los impuestos aplicables según las leyes de su país de residencia. Te recomendamos consultar con un asesor fiscal para entender tus obligaciones tributarias.",
  },
  {
    category: "Cuenta",
    question: "¿Cómo veo mis boletos comprados?",
    answer:
      "Puedes ver todos tus boletos en la sección 'Mis Boletos' ingresando el email usado en la compra. Allí verás el estado de tus pagos, números de boletos y rifas en las que participas.",
  },
  {
    category: "Cuenta",
    question: "¿Puedo cancelar mi compra?",
    answer:
      "Las compras confirmadas no pueden cancelarse debido a la naturaleza de las rifas. Sin embargo, si hay un problema técnico o la rifa se cancela, procesaremos el reembolso completo automáticamente.",
  },
  {
    category: "Seguridad",
    question: "¿Es seguro proporcionar mi información personal?",
    answer:
      "Sí, utilizamos encriptación SSL y las mejores prácticas de seguridad para proteger tu información. No compartimos tus datos con terceros y solo los usamos para procesar tu participación y contactarte si ganas.",
  },
  {
    category: "Seguridad",
    question: "¿Cómo sé que los sorteos son justos?",
    answer:
      "Todos nuestros sorteos son auditados por empresas independientes, grabados en video, y utilizan sistemas de selección aleatoria certificados. Publicamos los resultados y videos de cada sorteo para total transparencia.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = [
    "Todos",
    ...Array.from(new Set(faqData.map((item) => item.category))),
  ];

  const filteredFAQ =
    selectedCategory === "Todos"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Preguntas Frecuentes
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Encuentra respuestas a las preguntas más comunes sobre GanaXDar
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : ""
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.map((item, index) => (
          <Card key={index} className="border-slate-200">
            <CardHeader
              className="cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleItem(index)}
            >
              <CardTitle className="flex items-center justify-between text-left">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-900">{item.question}</span>
                </div>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                )}
              </CardTitle>
            </CardHeader>
            {openItems.includes(index) && (
              <CardContent className="pt-0">
                <div className="pl-8">
                  <p className="text-slate-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            ¿No encontraste tu respuesta?
          </h3>
          <p className="text-slate-600 mb-6">
            Nuestro equipo de soporte está aquí para ayudarte con cualquier
            pregunta adicional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Contactar Soporte
            </Button>
            <Button variant="outline">Enviar Email</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
