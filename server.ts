/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// API routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
    message: "Servidor del Consultor de Negocios de Élite listo."
  });
});

// Endpoint 1: Conversar con el consultor y actualizar/enriquecer bloques de BMC
app.post("/api/consultant/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY no configurada. Por favor, añádela en la sección de Secretos."
      });
    }

    const { canvas, messages, prompt } = req.body;

    // Build standard system prompt
    const systemInstruction = `
Actúas como un Consultor de Negocios de Élite y Diseñador de Interfaces UX/UI de vanguardia de habla hispana.
Tu objetivo es guiar al usuario en la creación, análisis y optimización de su Business Model Canvas (BMC).

Debes ofrecer una experiencia altamente interactiva, analítica, disruptiva, empática y sumamente visual.

La idea de negocio actual es:
Nombre: "${canvas.projectName || 'Sin nombre aún'}"
Descripción: "${canvas.description || 'Sin descripción aún'}"

Módulos actuales del canvas del usuario:
- Alianzas Clave: ${JSON.stringify(canvas.keyPartnerships.map((i: any) => i.text))}
- Actividades Clave: ${JSON.stringify(canvas.keyActivities.map((i: any) => i.text))}
- Recursos Clave: ${JSON.stringify(canvas.keyResources.map((i: any) => i.text))}
- Propuestas de Valor: ${JSON.stringify(canvas.valuePropositions.map((i: any) => i.text))}
- Relaciones con Clientes: ${JSON.stringify(canvas.customerRelationships.map((i: any) => i.text))}
- Canales: ${JSON.stringify(canvas.channels.map((i: any) => i.text))}
- Segmentos de Clientes: ${JSON.stringify(canvas.customerSegments.map((i: any) => i.text))}
- Estructura de Costos: ${JSON.stringify(canvas.costStructure.map((i: any) => i.text))}
- Fuentes de Ingresos: ${JSON.stringify(canvas.revenueStreams.map((i: any) => i.text))}

Reglas de interacción:
1. Comunícate en español con entusiasmo profesional. Usa emojis apropiados.
2. Si el usuario te da nueva información (por ejemplo, sobre canales, clientes, ingresos, etc.), debes VALIDAR y aplaudir su idea. Luego, ENRIQUECE el canvas sugiriendo de 2 a 3 ideas disruptivas o puntos ciegos.
3. Lo más importante: si hay datos útiles en el mensaje del usuario o en tus sugerencias enriquecidas, puedes sugerir actualizar los bloques correspondientes retornándolos estructuradamente en la propiedad 'updatedBlocks'. Esto mantendrá el canvas sincronizado de forma mágica.
4. Si el usuario está en modo guiado (Paso a Paso), hazle una sola pregunta clara a la vez sobre el módulo siguiente en el que deba enfocarse.
5. Si el usuario te pide ayuda general o suelta información diversa, clasifícala inteligentemente y actualiza los bloques correspondientes.

Retorna un JSON válido con la estructura solicitada. No uses formato markdown de código en la respuesta cruda, solo el JSON puro.
`;

    // Construct history of conversation
    const contents = [];
    
    // Add context messages
    for (const msg of messages) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Add final user prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "La respuesta conversacional del consultor en español. Debe incluir emojis, comentarios motivadores, análisis crítico o explicaciones claras. Usa Markdown de forma elegante para títulos o listas."
            },
            updatedBlocks: {
              type: Type.OBJECT,
              description: "Opcional. Si el mensaje del usuario o tus propuestas implican agregar ideas específicas a algún módulo del canvas, retórnalos aquí con el array completo de viñetas para ese bloque específico. No limpies lo que ya tiene el usuario a menos que esté siendo refinado.",
              properties: {
                keyPartnerships: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyResources: { type: Type.ARRAY, items: { type: Type.STRING } },
                valuePropositions: { type: Type.ARRAY, items: { type: Type.STRING } },
                customerRelationships: { type: Type.ARRAY, items: { type: Type.STRING } },
                channels: { type: Type.ARRAY, items: { type: Type.STRING } },
                customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
                costStructure: { type: Type.ARRAY, items: { type: Type.STRING } },
                revenueStreams: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 o 3 opciones, respuestas rápidas sugeridas o siguientes pasos que el usuario puede pulsar para avanzar la conversación."
            }
          },
          required: ["text"]
        }
      }
    });

    const responseText = response.text || "{}";
    res.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("Error en Chat del Consultor:", error);
    res.status(500).json({ error: error?.message || "Ocurrió un error inesperado al consultar con el IA." });
  }
});

// Endpoint 2: Realizar un Diagnóstico de Viabilidad (Reporte de Salud del Negocio)
app.post("/api/consultant/analyze", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY no configurada."
      });
    }

    const { canvas } = req.body;

    const systemInstruction = `
Eres un Consultor de Negocios de Élite. Analizas el Business Model Canvas proporcionado por el usuario y generas un "Reporte de Salud del Negocio" en español.

Debes analizar detalladamente los 9 módulos y retornar:
1. Sinergias clave: ¿Cómo se conectan e impulsan sus bloques? (por ejemplo, la Propuesta de Valor coincide bien con el Segmento de Clientes, o las Actividades Clave optimizan los Costos). Retorna al menos 3 sinergias sólidas y estratégicas.
2. Alertas Rojas / Riesgos: ¿Qué debilidades o riesgos críticos tiene este modelo? (por ejemplo, canales de distribución muy caros para una propuesta de bajo costo, falta de escalabilidad, dependencia crítica de un socio único). Retorna al menos 3 alertas rojas realistas.
3. Próximos pasos: Una lista concreta de 3 o 4 acciones de validación en el mundo real (experimentos, entrevistas, MVPs rápidos).

Retorna un JSON válido con las propiedades: 'synergies', 'redFlags', 'nextSteps'.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analiza este modelo de negocio:\n\n${JSON.stringify(canvas, null, 2)}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            synergies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Sinergias encontradas en el modelo de negocio."
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Peligros, riesgos o puntos débiles críticos."
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Acciones estratégicas e inmediatas para validar la idea."
            }
          },
          required: ["synergies", "redFlags", "nextSteps"]
        }
      }
    });

    const responseText = response.text || "{}";
    res.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("Error en Diagnóstico:", error);
    res.status(500).json({ error: error?.message || "Error al generar el diagnóstico de viabilidad." });
  }
});

// Setup Vite Dev server or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BMC Server] Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();
