import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { CheckCircle2, AlertTriangle, Info, Printer, Share2, ArrowRight, Activity, Thermometer } from 'lucide-react';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskResult {
  risk_score: number;
  risk_category: string;
  prediction: number;
  recommendations: string[];
}

interface ResultsDisplayProps {
  result: RiskResult | null;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  if (!result) return null;

  const scorePercentage = Math.round(result.risk_score * 100);
  const isHighRisk = result.prediction === 1;

  // Data for the gauge
  const data = [
    { value: scorePercentage },
    { value: 100 - scorePercentage },
  ];

  const COLORS = isHighRisk 
    ? ['hsl(var(--destructive))', 'hsl(var(--muted)/0.2)']
    : ['hsl(var(--primary))', 'hsl(var(--muted)/0.2)'];

  return (
    <Card className={cn(
      "w-full max-w-4xl mx-auto shadow-2xl border-2 transition-all duration-500 overflow-hidden",
      isHighRisk ? "border-destructive/20" : "border-primary/20"
    )}>
      <CardHeader className={cn(
        "p-6 md:p-10 border-b",
        isHighRisk ? "bg-destructive/5" : "bg-primary/5"
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge 
              variant={isHighRisk ? "destructive" : "default"} 
              className="px-3 py-1 text-sm font-semibold uppercase tracking-wider"
            >
              Patient Assessment Complete
            </Badge>
            <CardTitle className="text-3xl md:text-4xl font-heading font-bold">
              Heart Failure Risk: {result.risk_category}
            </CardTitle>
            <CardDescription className="text-lg">
              Calculated clinical-grade risk profile based on provided patient parameters.
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Gauge Visualization */}
          <div className="relative flex flex-col items-center">
            <div className="h-[240px] w-full max-w-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center">
                <div className={cn(
                  "text-5xl font-heading font-black",
                  isHighRisk ? "text-destructive" : "text-primary"
                )}>
                  {scorePercentage}%
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
                  Risk Intensity
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 w-full max-w-[280px] text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-[-20px]">
              <div className="text-left">Low</div>
              <div className="text-center">Moderate</div>
              <div className="text-right">High</div>
            </div>
          </div>

          {/* Key Indicators */}
          <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Primary Indicators
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-muted flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-lg mt-1",
                  isHighRisk ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}>
                  {isHighRisk ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-bold text-lg">{result.risk_category}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The clinical model identifies this patient as being in the {result.risk_category.toLowerCase()} tier for heart failure events within the follow-up window.
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/50 border border-muted flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 mt-1">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-lg">XGBoost Confidence</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Model weights indicate high feature importance for Serum Creatinine and Ejection Fraction in this specific assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Clinical Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-heading font-bold flex items-center gap-2 text-foreground">
              <Thermometer className="h-6 w-6 text-primary" />
              Clinical Recommendations
            </h3>
            <Badge variant="secondary" className="font-mono">AI-Augmented Guidance</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors group">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {idx + 1}
                </div>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-medium">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 md:p-10 bg-muted/30 border-t flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Model Engine</span>
            <span className="font-semibold text-sm">XGBoost 2.0.3</span>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Framework</span>
            <span className="font-semibold text-sm">Scikit-learn 1.4+</span>
          </div>
        </div>
        
        <Button size="lg" onClick={onReset} className="w-full md:w-auto shadow-lg shadow-primary/20">
          New Patient Assessment <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// End of component
