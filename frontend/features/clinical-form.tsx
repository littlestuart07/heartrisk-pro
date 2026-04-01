import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Spinner } from '../components/ui/spinner';
import { Activity, Thermometer, User, Clock, Heart, FlaskConical } from 'lucide-react';
import { cn } from '../lib/utils';
import { rpcCall } from '../api';

interface FeatureInfo {
  name: string;
  label: string;
  min?: number;
  max?: number;
  type: 'number' | 'select';
  description: string;
  options?: { label: string; value: number }[];
}

interface ClinicalFormProps {
  onResult: (result: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ClinicalForm: React.FC<ClinicalFormProps> = ({ onResult, isLoading, setIsLoading }) => {
  const [features, setFeatures] = useState<FeatureInfo[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        console.log('[FETCH_START] get_feature_info');
        let data: any;
        try {
          data = await rpcCall({ func: 'get_feature_info' });
        } catch (rpcErr) {
          console.error('[RPC_ERROR] Falling back to hardcoded features', rpcErr);
          data = [
            {"name": "age", "label": "Age", "min": 0, "max": 120, "type": "number", "description": "Patient age in years"},
            {"name": "anaemia", "label": "Anaemia", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Decrease of red blood cells or hemoglobin"},
            {"name": "creatinine_phosphokinase", "label": "Creatinine Phosphokinase", "min": 0, "max": 10000, "type": "number", "description": "Level of CPK enzyme in the blood (mcg/L)"},
            {"name": "diabetes", "label": "Diabetes", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Whether the patient has diabetes"},
            {"name": "ejection_fraction", "label": "Ejection Fraction", "min": 0, "max": 100, "type": "number", "description": "Percentage of blood leaving the heart at each contraction (%)"},
            {"name": "high_blood_pressure", "label": "High Blood Pressure", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Whether the patient has hypertension"},
            {"name": "platelets", "label": "Platelets", "min": 0, "max": 1000000, "type": "number", "description": "Platelets in the blood (kiloplatelets/mL)"},
            {"name": "serum_creatinine", "label": "Serum Creatinine", "min": 0, "max": 20, "type": "number", "description": "Level of serum creatinine in the blood (mg/dL)"},
            {"name": "serum_sodium", "label": "Serum Sodium", "min": 100, "max": 150, "type": "number", "description": "Level of serum sodium in the blood (mEq/L)"},
            {"name": "sex", "label": "Sex", "options": [{"label": "Female", "value": 0}, {"label": "Male", "value": 1}], "type": "select", "description": "Patient biological sex"},
            {"name": "smoking", "label": "Smoking", "options": [{"label": "No", "value": 0}, {"label": "Yes", "value": 1}], "type": "select", "description": "Whether the patient smokes"},
            {"name": "time", "label": "Follow-up Period", "min": 0, "max": 300, "type": "number", "description": "Follow-up period (days)"}
          ];
        }
        
        if (!Array.isArray(data)) {
          console.error('[PARSE_ERROR] get_feature_info returned non-array data:', data);
          setError('Failed to load clinical parameters: invalid data format.');
          return;
        }

        console.log('[FETCH_SUCCESS] get_feature_info data shape:', data);
        console.log('[SET_STATE] Updating features state');
        setFeatures(data);
        console.log('[SET_STATE] features state updated');
        
        // Initialize form data with defaults
        const initialData: Record<string, any> = {};
        data.forEach((f: FeatureInfo) => {
          if (f.type === 'number') {
            initialData[f.name] = f.min !== undefined ? f.min : 0;
          } else if (f.type === 'select') {
            if (f.options && f.options.length > 0) {
              initialData[f.name] = f.options[0].value;
            } else {
              console.warn(`[DATA_WARNING] Select feature "${f.name}" has no options. Defaulting to 0.`);
              initialData[f.name] = 0;
            }
          }
        });
        
        console.log('[INIT_DATA] Final initial form data:', initialData);
        setFormData(initialData);
      } catch (err: any) {
        console.error('[PARSE_ERROR] Failed to fetch feature info', err);
        setError(err.message || 'Failed to load clinical parameters. Please refresh.');
      }
    };
    fetchFeatures();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log('[ACTION_START] predict_risk', formData);
    
    try {
      console.log('[FETCH_START] predict_risk');
      const result = await rpcCall({ func: 'predict_risk', args: formData });
      console.log('[FETCH_RESPONSE] predict_risk success', result);
      onResult(result);
    } catch (err: any) {
      console.error('[PARSE_ERROR] predict_risk failed', err);
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Group features for better UI organization
  const groups = [
    { title: 'Demographics & History', icon: User, fields: ['age', 'sex', 'smoking', 'diabetes'] },
    { title: 'Vital Indicators', icon: Heart, fields: ['high_blood_pressure', 'ejection_fraction', 'anaemia'] },
    { title: 'Clinical Chemistry', icon: FlaskConical, fields: ['serum_creatinine', 'serum_sodium', 'creatinine_phosphokinase', 'platelets'] },
    { title: 'Follow-up Info', icon: Clock, fields: ['time'] }
  ];

  const renderField = (field: FeatureInfo) => {
    if (field.type === 'select') {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-sm font-medium">{field.label}</Label>
          <Select 
            value={formData[field.name]?.toString()} 
            onValueChange={(val) => updateField(field.name, parseInt(val))}
          >
            <SelectTrigger id={field.name} className="w-full">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt, i) => (
                <SelectItem key={`${field.name}-opt-${i}`} value={opt.value.toString()}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{field.description}</p>
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium">{field.label}</Label>
        <Input
          id={field.name}
          type="number"
          min={field.min}
          max={field.max}
          step="any"
          value={formData[field.name] !== undefined ? formData[field.name] : ''}
          onChange={(e) => updateField(field.name, parseFloat(e.target.value))}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">{field.description}</p>
      </div>
    );
  };

  if (features.length === 0 && !error) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/10">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground font-medium">Initializing Clinical Parameters...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-primary/5 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading">Patient Clinical Metrics</CardTitle>
        </div>
        <CardDescription className="text-base">
          Complete all fields accurately to ensure the highest prediction precision.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 md:p-8 space-y-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {groups.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <group.icon className="h-5 w-5 text-primary" />
                <h3 className="font-heading font-semibold text-lg">{group.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.fields.map(fieldName => {
                  const field = features.find(f => f.name === fieldName);
                  return field ? renderField(field) : null;
                })}
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="bg-muted/30 p-6 md:p-8 border-t border-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground max-w-md text-center sm:text-left">
            All data processed locally using the XGBoost/Scikit-learn model weights.
          </div>
          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[200px] shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Analyzing Clinical Data...
              </>
            ) : (
              'Generate Risk Profile'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
