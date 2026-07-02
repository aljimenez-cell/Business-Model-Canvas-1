/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BusinessModelCanvas, CanvasBlockId, BMCItem } from './types';
import { EMPTY_CANVAS, CANVAS_BLOCKS_CONFIG } from './data/examples';
import AIConsultant from './components/AIConsultant';
import CanvasGrid from './components/CanvasGrid';
import HealthReportModal from './components/HealthReportModal';
import ExportModal from './components/ExportModal';
import { Sparkles, BarChart2, Download, Trash2, Code, Lightbulb, HelpCircle } from 'lucide-react';

export default function App() {
  const [canvas, setCanvas] = useState<BusinessModelCanvas>(() => {
    // Initial load from local storage if available, otherwise empty canvas
    const saved = localStorage.getItem('bmc_canvas_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error al cargar canvas guardado:", e);
      }
    }
    return EMPTY_CANVAS();
  });

  const [showReport, setShowReport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isLoadingEnrich, setIsLoadingEnrich] = useState<CanvasBlockId | null>(null);
  const [enrichAlert, setEnrichAlert] = useState<string | null>(null);

  // Auto-save to local storage on changes
  useEffect(() => {
    localStorage.setItem('bmc_canvas_data', JSON.stringify(canvas));
  }, [canvas]);

  const handleUpdateCanvas = (updatedCanvas: BusinessModelCanvas) => {
    setCanvas(updatedCanvas);
  };

  const handleLoadExample = (exampleCanvas: BusinessModelCanvas) => {
    setCanvas({
      ...exampleCanvas,
      id: `canvas-${Date.now()}`
    });
  };

  const handleResetCanvas = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el lienzo? Perderás las ideas guardadas.')) {
      setCanvas(EMPTY_CANVAS());
    }
  };

  // Automated AI enrichment for a single targeted block
  const handleEnrichBlock = async (blockId: CanvasBlockId) => {
    setIsLoadingEnrich(blockId);
    setEnrichAlert(null);

    const blockConfig = CANVAS_BLOCKS_CONFIG[blockId];
    const prompt = `Hola. Deseo que como consultor experto me ayudes a enriquecer el bloque de "${blockConfig.title}" para mi proyecto "${canvas.projectName || 'un nuevo negocio'}". 
Por favor, analiza la descripción general de mi proyecto ("${canvas.description || 'sin descripción aún'}") y lo que ya tengo estructurado, y sugiere de 3 a 4 ideas de alta calidad, sumamente específicas y disruptivas para agregar en este bloque. 
Retorna el resultado en español, y asegúrate de incluir las nuevas sugerencias en la propiedad 'updatedBlocks.${blockId}' de la respuesta JSON para que se sincronicen directamente en mi canvas. Cuéntame brevemente por qué estas ideas añaden valor estratégico en tu respuesta conversacional.`;

    try {
      const res = await fetch('/api/consultant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvas,
          messages: [],
          prompt: prompt
        })
      });

      if (!res.ok) throw new Error('No se pudo comunicar con el consultor AI.');

      const data = await res.json();

      // Check if specific block updates came back
      if (data.updatedBlocks && Array.isArray(data.updatedBlocks[blockId])) {
        const strings = data.updatedBlocks[blockId] as string[];
        const currentItems = canvas[blockId] as BMCItem[];
        
        // Convert to BMC Items
        const enrichedItems = strings.map((str, idx) => ({
          id: `enrich-${blockId}-${Date.now()}-${idx}`,
          text: str,
          isAiEnriched: true
        }));

        // Merge old and new items
        setCanvas(prev => ({
          ...prev,
          [blockId]: [...currentItems, ...enrichedItems]
        }));

        setEnrichAlert(`¡Bloque de ${blockConfig.title} enriquecido con éxito por la IA!`);
        setTimeout(() => setEnrichAlert(null), 4000);
      } else {
        throw new Error('La respuesta de la IA no contuvo elementos estructurados compatibles.');
      }

    } catch (err: any) {
      console.error(err);
      alert(`No pudimos enriquecer el bloque: ${err.message}. Verifica que tu clave secreta de Gemini esté configurada correctamente.`);
    } finally {
      setIsLoadingEnrich(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800" id="app-root">
      
      {/* Top Main Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0" id="main-header">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
              Lienzo de Modelos de Negocio Inteligente <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2.5 py-0.5 rounded-full border border-indigo-100/60 uppercase tracking-wider">Pro Elite</span>
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide text-[10px]">Co-crea, visualiza y valida tu Business Model Canvas con un Consultor de Negocios de Élite</p>
          </div>
        </div>

        {/* Global actions row */}
        <div className="flex flex-wrap items-center gap-2" id="global-actions">
          <button
            onClick={() => setShowReport(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-wide text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
            title="Generar Diagnóstico de Salud del Negocio"
            id="btn-trigger-health-analysis"
          >
            <BarChart2 className="w-4 h-4" /> Diagnóstico de Viabilidad ✨
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
            title="Exportar en HTML o JSON"
            id="btn-trigger-export"
          >
            <Code className="w-4 h-4" /> Exportar / Copiar HTML 📤
          </button>
          <button
            onClick={handleResetCanvas}
            className="px-3 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-rose-600 rounded-xl font-medium text-xs transition-all active:scale-95"
            title="Limpiar Lienzo"
            id="btn-trigger-reset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-73px)] overflow-hidden" id="main-workspace">
        
        {/* Left pane: AI Consultant */}
        <div className="w-full lg:w-[35%] xl:w-[30%] h-1/2 lg:h-full p-4 shrink-0 lg:border-r lg:border-slate-200 flex flex-col" id="consultant-pane">
          <AIConsultant
            canvas={canvas}
            onUpdateCanvas={handleUpdateCanvas}
            onLoadExample={handleLoadExample}
            onResetCanvas={handleResetCanvas}
            onOpenReport={() => setShowReport(true)}
            onOpenExport={() => setShowExport(true)}
          />
        </div>

        {/* Right pane: Active Interactive Canvas */}
        <div className="w-full lg:w-[65%] xl:w-[70%] h-1/2 lg:h-full overflow-y-auto p-4 lg:p-6 space-y-4 bg-slate-100" id="canvas-pane">
          {/* Toast style notifications for AI triggers */}
          {enrichAlert && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl shadow-md flex items-center gap-2 animate-fade-in" id="toast-alert">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              {enrichAlert}
            </div>
          )}

          <CanvasGrid
            canvas={canvas}
            onChange={handleUpdateCanvas}
            onEnrichBlock={handleEnrichBlock}
            isLoadingEnrich={isLoadingEnrich}
          />
        </div>
      </main>

      {/* Modals */}
      {showReport && (
        <HealthReportModal
          canvas={canvas}
          onClose={() => setShowReport(false)}
        />
      )}

      {showExport && (
        <ExportModal
          canvas={canvas}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
