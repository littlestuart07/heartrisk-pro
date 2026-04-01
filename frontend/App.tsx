import React, { useState, useEffect, useRef } from 'react';
import { ClinicalForm } from './features/clinical-form';
import { ResultsDisplay } from './features/results-display';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Heart, Activity, ShieldCheck, Microscope, Database, ArrowRight, ChevronDown } from 'lucide-react';
import { SiPython, SiScikitlearn } from 'react-icons/si';
import { cn } from './lib/utils';

export default function App() {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("RENDER_SUCCESS");
  }, []);

  const handleResult = (data: any) => {
    setResult(data);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Background Texture Wash */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5 z-0" 
        style={{ 
          backgroundImage: 'url("./assets/bg-green-gradient-1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Heart className="h-6 w-6 text-primary animate-pulse" fill="currentColor" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight">HeartRisk <span className="text-primary">Pro</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Assessment</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Methodology</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Documentation</a>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="default" size="sm" onClick={scrollToForm} className="shadow-lg shadow-primary/10">Start Screening</Button>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-3 duration-500">
                <ShieldCheck className="h-4 w-4" /> Clinical Decision Support
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                Predictive <br /> Cardiovascular <br /><span className="text-primary italic">Intelligence.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-300">
                Advanced risk assessment platform utilizing gradient boosting algorithms to predict heart failure outcomes based on standardized clinical biomarkers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20" onClick={scrollToForm}>
                  Begin Clinical Input <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl bg-background/50 backdrop-blur-sm">
                  View Whitepaper
                </Button>
              </div>
              
              <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60">
                <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                  <SiPython className="h-6 w-6" />
                  <span className="text-sm font-semibold">Python</span>
                </div>
                <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                  <SiScikitlearn className="h-10 w-10" />
                  <span className="text-sm font-semibold">Scikit-learn</span>
                </div>
                <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                  <Database className="h-6 w-6" />
                  <span className="text-sm font-semibold">XGBoost</span>
                </div>
              </div>
            </div>
            
            <div className="relative group animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition-all duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden border border-primary/20 shadow-2xl aspect-[4/3]">
                <img 
                  src="./assets/hero-nurse-monitor-3.jpg" 
                  alt="Clinical Nurse Monitoring Patient" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-background/90 backdrop-blur-md border border-primary/10 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                      <Microscope className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Real-time Inference</div>
                      <div className="text-xs text-muted-foreground">Processed with XGBoost 2.0.3 Architecture</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <Button variant="ghost" size="icon" onClick={scrollToForm} className="rounded-full">
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </section>

        {/* Form Section */}
        <section ref={formRef} className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-heading font-bold">Clinical Metrics Input</h2>
              <p className="text-muted-foreground text-lg">
                Input patient data accurately for model inference. All fields are required to establish a full risk profile.
              </p>
            </div>
            <ClinicalForm onResult={handleResult} isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
        </section>

        {/* Results Section */}
        <section 
          ref={resultsRef} 
          className={cn(
            "py-20 md:py-32 transition-all duration-700 ease-in-out opacity-0 translate-y-20",
            result && "opacity-100 translate-y-0"
          )}
        >
          <div className="container">
            <ResultsDisplay result={result} onReset={handleReset} />
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-20 md:py-32 border-t bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold">XGBoost Engine</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The application utilizes an extreme gradient boosting model trained on 12 distinct clinical features, providing sub-millisecond inference for point-of-care decisions.
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold">Validation Metrics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The underlying model has been validated with a high ROC-AUC score, specifically optimized to minimize false negatives in high-risk heart failure scenarios.
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold">Clinical Markers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Features such as Serum Creatinine, Sodium, and Ejection Fraction are weighted heavily, reflecting their established importance in clinical cardiology literature.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-muted/20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Heart className="h-5 w-5 text-primary" fill="currentColor" />
              <span className="font-heading font-bold tracking-tight">HeartRisk Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Python & Scikit-learn. <br />
              © 2026 Medical Intelligence Systems Inc.
            </p>
          </div>
          
          <div className="flex items-center gap-6 grayscale opacity-40">
            <SiPython className="h-6 w-6" />
            <SiScikitlearn className="h-10 w-10" />
            <span className="font-bold text-lg tracking-tighter">XGBoost</span>
          </div>
          
          <div className="text-sm text-muted-foreground max-w-xs text-center md:text-right">
            Disclaimer: This is a decision support tool and does not constitute medical advice. Always consult a qualified physician.
          </div>
        </div>
      </footer>
    </div>
  );
}
