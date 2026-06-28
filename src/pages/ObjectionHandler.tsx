import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PageTransition } from '../layout';
import { GlassCard, GlassTextarea, GlassButton, Badge } from '../components/ui/Glass';
import { callWebhook } from '../services/api';
import { parseWebhookResponse } from '../utils';

export default function ObjectionHandler() {
  const [formData, setFormData] = useState({
    scenario: '',
    objection: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const isFormValid = Object.values(formData).every(val => val.trim().length > 0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await callWebhook(
        import.meta.env.VITE_OBJECTION_HANDLER_WEBHOOK,
        formData
      );
      setResult(parseWebhookResponse(response));
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <div className="flex flex-col md:flex-row gap-6 h-full min-h-[calc(100vh-8rem)]">
        
        {/* Input Panel */}
        <div className="w-full md:w-[45%] flex flex-col gap-4 md:sticky md:top-6 md:h-fit">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Objection Handler</h2>
              <Badge>New</Badge>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-primary-text/70 dark:text-secondary-text mb-1.5 ml-1">EXPLAIN THE WHOLE CASE SCENARIO</label>
                <GlassTextarea 
                  required
                  placeholder="Describe the situation, context, and any relevant details..."
                  value={formData.scenario}
                  onChange={e => setFormData({ ...formData, scenario: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-primary-text/70 dark:text-secondary-text mb-1.5 ml-1">WHAT OBJECTION DID YOU GET FROM THE CLIENT?</label>
                <GlassTextarea 
                  required
                  placeholder="e.g. &quot;Your price is too high&quot;, &quot;I don't have time&quot;, &quot;I need to think about it&quot;..."
                  value={formData.objection}
                  onChange={e => setFormData({ ...formData, objection: e.target.value })}
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                  {error}
                </div>
              )}

              <GlassButton 
                type="submit" 
                className="w-full mt-2" 
                disabled={loading || !isFormValid}
              >
                {loading ? 'Generating...' : 'Handle Objection'}
              </GlassButton>
            </form>
          </GlassCard>
        </div>

        {/* Output Panel */}
        <div className="w-full md:w-[55%] flex flex-col h-full">
          <GlassCard surface className="flex-1 flex flex-col p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Generated Output</h3>
              <button 
                onClick={handleCopy}
                disabled={!result}
                className="p-2 rounded-xl text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
              </button>
            </div>
            
            <div className="flex-1 bg-black/5 dark:bg-white/5 border border-border rounded-xl p-4 overflow-y-auto">
              {loading ? (
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-1/2"></div>
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6"></div>
                </div>
              ) : result ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
              ) : (
                <div className="h-full flex items-center justify-center text-secondary-text text-sm">
                  Your generated objection handling strategy will appear here.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </PageTransition>
  );
}
