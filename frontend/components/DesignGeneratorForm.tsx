"use client";

import { useState, useRef, useEffect } from "react";
import Design3D from "@/components/Design3D";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  design?: {
    width: number;
    height: number;
    depth: number;
    complexity: number;
    material: string;
    description: string;
    price: number;
  };
}

export default function DesignGeneratorForm() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente de diseño de Herrería Estudio. Cuéntame sobre la pieza que deseas diseñar: dimensiones aproximadas, material, estilo, función... Y juntos crearemos el diseño perfecto para tu espacio.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const calculatePrice = (width: number, height: number, depth: number, complexity: number): number => {
    const basePrice = 50000;
    const area = (width * height + height * depth + width * depth) / 1000;
    const complexityMultiplier = 1 + (complexity * 0.3);
    return Math.round(basePrice + area * 10000 * complexityMultiplier);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = input.trim();
    if (!messageText || loading) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Construir historial sin fechas (serializable)
      const conversationHistory = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log("Sending to API:", {
        message: messageText,
        historyLength: conversationHistory.length,
      });

      const response = await fetch("/api/design-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      if (!data.response) {
        throw new Error("No response from API");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        design: data.design || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Disculpa, hubo un error procesando tu mensaje. Intenta nuevamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-light tracking-tighter text-foreground mb-2">
          Asistente de Diseño Personalizado
        </h2>
        <p className="text-sm font-light text-slate-600">
          Chatea con Gemini para diseñar tu pieza personalizada
        </p>
      </div>

      {/* Chat Container */}
      <div className="border border-border bg-white rounded h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded text-sm font-light leading-relaxed ${
                message.role === "user"
                  ? "bg-foreground text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* Design Display */}
        {messages
          .filter((m) => m.design)
          .map((message) =>
            message.design ? (
              <div key={`design-${message.id}`} className="mt-6 pt-4 border-t border-slate-200">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-4">
                    Diseño 3D - Visualización
                  </h3>
                  <Design3D design={message.design} />

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-600 mb-2">
                        Especificaciones
                      </p>
                      <div className="text-xs font-light space-y-1 text-slate-700">
                        <p>📏 {message.design.width}×{message.design.height}×{message.design.depth}cm</p>
                        <p>🔧 {message.design.material}</p>
                        <p>
                          ⚙️{" "}
                          {["Baja", "Media", "Alta", "Muy Alta"][message.design.complexity - 1]}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-600 mb-2">
                        Precio Estimado
                      </p>
                      <p className="text-2xl font-light text-foreground">
                        ${message.design.price.toLocaleString("es-AR")}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">ARS (sujeto a confirmación)</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 px-4 py-3 rounded text-sm text-slate-600">
              Gemini está pensando...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe tu diseño, pregunta sobre materiales, precios..."
          disabled={loading}
          className="flex-1 px-4 py-3 border border-border rounded text-sm font-light focus:outline-none focus:border-foreground disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-foreground text-white px-6 py-3 rounded font-light uppercase tracking-[0.1em] text-xs hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </form>

      <p className="text-xs text-slate-500 text-center">
        Puedes hacer múltiples preguntas, pedir ajustes, consultar sobre materiales, etc.
      </p>
    </div>
  );
}
