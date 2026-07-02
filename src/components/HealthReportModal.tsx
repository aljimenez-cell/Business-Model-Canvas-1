/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BusinessModelCanvas, HealthReport } from '../types';
import { Heart, AlertTriangle, Play, X, Sparkles, Loader2, Award } from 'lucide-react';

interface HealthReportModalProps {
  canvas: BusinessModelCanvas;
  onClose: () => void;
}

export default function HealthReportModal({ canvas, onClose }: HealthReportModalProps) {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analizando consistencia interna del lienzo...",
    "Buscando puntos ciegos estratégicos...",
    "Evaluando correspondencia Propuesta de Valor <-> Segmentos...",
    "Calculando viabilidad de canales e ingresos...",
    "Generando recomendaciones de validación inmediata..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/consultant/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvas })
        });

        if (!res.ok) {
          throw new Error('No se pudo generar el diagnóstico. Verifica que tu GEMINI_API_KEY esté configurada en los Secretos.');
        }

        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [canvas]);

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="report-modal-backdrop">
      <div className="bg-white rounded-2xl max-w-3xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden border border-slate-100" id="report-modal">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white flex items-center justify-between shrink-0" id="report-modal-header">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-indigo-100 animate-bounce" />
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Reporte de Salud & Viabilidad del Negocio</h3>
              <p className="text-xs text-indigo-100 font-medium">Análisis estratégico por el Consultor de Élite • {canvas.projectName || 'Sin Nombre'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all"
            id="report-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-grow overflow-y-auto p-6 bg-slate-50/50" id="report-content-box">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 space-y-4 text-center" id="report-loader">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Cocinando sugerencias de negocio...</p>
                <p className="text-xs text-slate-500 animate-pulse font-medium">{loadingMessages[loadingStep]}</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-xl text-center space-y-4" id="report-error">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <p className="font-extrabold text-slate-800 text-sm">No pudimos procesar el análisis</p>
                <p className="text-xs text-slate-600">{error}</p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700"
              >
                Entendido, regresar
              </button>
            </div>
          ) : report ? (
            <div className="space-y-6" id="report-main-results">
              {/* Introduction Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-150 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Resumen del Diagnóstico</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Hemos auditado tu lienzo estratégico. A continuación, te presentamos el mapa de sinergias detectadas, los riesgos potenciales que debes mitigar y los próximos experimentos prioritarios para validar tus premisas antes de escalar.
                  </p>
                </div>
              </div>

              {/* Synergies */}
              <div className="bg-indigo-50/30 border border-indigo-100 rounded-2xl p-5 space-y-3 shadow-sm" id="section-synergies">
                <h4 className="text-sm font-extrabold text-indigo-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-indigo-600" /> Sinergias & Fortalezas del Modelo (❤️)
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {report.synergies.map((syn, idx) => (
                    <div key={idx} className="bg-white border border-indigo-100/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700 shadow-sm">
                      <span className="text-indigo-500 font-bold text-sm shrink-0">✓</span>
                      <p className="leading-relaxed">{syn}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flags / Risks */}
              <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-5 space-y-3 shadow-sm" id="section-redflags">
                <h4 className="text-sm font-extrabold text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" /> Alertas Rojas & Puntos de Riesgo (🚨)
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {report.redFlags.map((flag, idx) => (
                    <div key={idx} className="bg-white border border-rose-100/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700 shadow-sm">
                      <span className="text-rose-500 font-bold text-sm shrink-0">⚠️</span>
                      <p className="leading-relaxed">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next validation Steps */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 space-y-3 shadow-sm" id="section-nextsteps">
                <h4 className="text-sm font-extrabold text-blue-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600" /> Plan de Validación Práctico (👣)
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {report.nextSteps.map((step, idx) => (
                    <div key={idx} className="bg-white border border-blue-100/60 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700 shadow-sm">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed mt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 italic py-12">Lienzo vacío o insuficiente para analizar. Llena algunos campos primero.</div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0" id="report-modal-footer">
          <span className="text-[10px] text-slate-400 font-bold">🎯 Recuerda: Un buen modelo de negocio se valida hablando con clientes, no solo en papel.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
            id="report-dismiss-btn"
          >
            Entendido, volver al lienzo
          </button>
        </div>
      </div>
    </div>
  );
}
