import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Mic } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import type { Urgency, TaskType } from '@/data/mockData';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function getSpeechRecognition(): (new () => any) | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as unknown as Record<string, unknown>).SpeechRecognition ??
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition ??
    null
  ) as (new () => any) | null;
}

const TASK_TYPES: TaskType[] = ['Request', 'Maintenance', 'Complaint'];
const URGENCIES: Urgency[] = ['Low', 'Standard', 'High', 'Urgent'];

const urgencyColors: Record<Urgency, { solid: string; outline: string }> = {
  Low: {
    solid: 'bg-[#64748b] text-white border border-[#64748b]',
    outline: 'text-[#94a3b8] border border-[#64748b]/40',
  },
  Standard: {
    solid: 'bg-[#3b82f6] text-white border border-[#3b82f6]',
    outline: 'text-[#94a3b8] border border-[#3b82f6]/30',
  },
  High: {
    solid: 'bg-[#f59e0b] text-white border border-[#f59e0b]',
    outline: 'text-[#94a3b8] border border-[#f59e0b]/30',
  },
  Urgent: {
    solid: 'bg-[#ef4444] text-white border border-[#ef4444]',
    outline: 'text-[#94a3b8] border border-[#ef4444]/30',
  },
};

type SheetState = 'input' | 'success';

interface ReportIssueSheetProps {
  roomNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportIssueSheet({
  roomNumber,
  open,
  onOpenChange,
}: ReportIssueSheetProps) {
  const [step, setStep] = useState<SheetState>('input');
  const [inputText, setInputText] = useState('');
  const [selectedType, setSelectedType] = useState<TaskType | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<Urgency>('Standard');
  const [listening, setListening] = useState(false);
  const [speechSupported] = useState(() => getSpeechRecognition() !== null);
  const inputRef = useRef<HTMLInputElement>(null);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const recognitionRef = useRef<any>(null);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  function toggleVoice() {
    if (listening) {
      stopRecognition();
      return;
    }

    const SpeechRec = getSpeechRecognition();
    if (!SpeechRec) return;

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        setListening(false);
      };

      recognition.onerror = () => {
        recognitionRef.current = null;
        setListening(false);
      };

      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  // Reset state when sheet opens
  useEffect(() => {
    if (open) {
      setStep('input');
      setInputText('');
      setSelectedType(null);
      setSelectedUrgency('Standard');
      stopRecognition();
    }
  }, [open, stopRecognition]);

  // Auto-focus input when in input state
  useEffect(() => {
    if (open && step === 'input') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, step]);

  const canSubmit = selectedType !== null && inputText.trim() !== '' && selectedUrgency !== null;

  function handleFileIssue() {
    if (!canSubmit) return;
    setStep('success');
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-[#141824] border-[#242938] rounded-t-2xl max-w-md mx-auto">
        {step === 'input' && (
          <>
            <SheetHeader>
              <SheetTitle className="text-[#f8fafc]">
                Report issue — Room {roomNumber}
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 flex flex-col gap-4">
              {/* Type selector */}
              <div className="flex rounded-xl border border-[#242938] overflow-hidden">
                {TASK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`flex-1 h-10 text-[13px] font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-[#10b981] text-white'
                        : 'bg-transparent text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#242938]/40'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Description input */}
              <div className="flex flex-col gap-2">
                <p className="text-[#94a3b8] text-sm">What's wrong?</p>
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      stopRecognition();
                      setInputText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canSubmit) handleFileIssue();
                    }}
                    placeholder="e.g., bulb out in bathroom"
                    className="flex-1 h-11 px-3 rounded-xl bg-[#0a0e1a] border border-[#242938] text-[#f8fafc] text-[15px] placeholder:text-[#475569] outline-none focus:border-[#10b981] transition-colors"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        listening
                          ? 'bg-[#ef4444] text-white animate-pulse'
                          : 'bg-[#10b981] text-white hover:bg-[#0d9668] active:bg-[#0a7d56]'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-[#475569] text-[13px]">
                  Try: "bulb out" · "low soap" · "leaky faucet"
                </p>
              </div>

              {/* Urgency chips */}
              <div className="flex flex-col gap-2">
                <p className="text-[#94a3b8] text-sm">Urgency</p>
                <div className="flex gap-2">
                  {URGENCIES.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setSelectedUrgency(u)}
                      className={`flex-1 h-9 rounded-full text-[13px] font-medium transition-all ${
                        selectedUrgency === u
                          ? urgencyColors[u].solid
                          : urgencyColors[u].outline
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter>
              <button
                disabled={!canSubmit}
                onClick={handleFileIssue}
                className="w-full h-11 rounded-xl bg-[#10b981] text-white font-medium text-[15px] transition-colors hover:bg-[#0d9668] active:bg-[#0a7d56] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                File issue
              </button>
            </SheetFooter>
          </>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full bg-[#10b981]/15 flex items-center justify-center">
              <Check className="w-7 h-7 text-[#10b981]" />
            </div>
            <p className="text-[#f8fafc] text-[16px] font-medium">Issue filed</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
