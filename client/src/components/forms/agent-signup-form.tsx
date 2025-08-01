import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const agentProfileSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  licenseUploadUrl: z.string().optional(),
  areasCovered: z.array(z.string()).min(1, "Please select at least one area"),
  propertyTypes: z.array(z.string()).min(1, "Please select at least one property type"),
  languagesSpoken: z.array(z.string()).min(1, "Please select at least one language"),
  specializations: z.array(z.string()).optional(),
});

type AgentProfileForm = z.infer<typeof agentProfileSchema>;

interface AgentSignupFormProps {
  onSubmit: (data: AgentProfileForm) => void;
  onBack: () => void;
}

export function AgentSignupForm({ onSubmit, onBack }: AgentSignupFormProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [uploadedLicenseUrl, setUploadedLicenseUrl] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<AgentProfileForm>({
    resolver: zodResolver(agentProfileSchema),
    defaultValues: {
      areasCovered: [],
      propertyTypes: [],
      languagesSpoken: [],
      specializations: [],
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('license', file);
      const response = await apiRequest('POST', '/api/upload/license', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedLicenseUrl(data.url);
      toast({
        title: "License Uploaded",
        description: "Your license document has been uploaded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload license. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFile(file);
      uploadMutation.mutate(file);
    }
  };

  const handleSubmit = (data: AgentProfileForm) => {
    onSubmit({
      ...data,
      areasCovered: selectedAreas,
      propertyTypes: selectedPropertyTypes,
      languagesSpoken: selectedLanguages,
      specializations: selectedSpecializations,
      licenseUploadUrl: uploadedLicenseUrl,
    });
  };

  const commonAreas = [
    "Shibuya", "Shinjuku", "Harajuku", "Roppongi", "Ginza", "Akihabara",
    "Ikebukuro", "Ueno", "Asakusa", "Tsukiji", "Odaiba", "Ebisu"
  ];

  const propertyTypes = ['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K+'];
  
  const languages = [
    "Japanese", "English", "Chinese", "Korean", "Spanish", "French", "German", "Portuguese"
  ];

  const specializations = [
    "First-time renters", "International clients", "Luxury properties", "Budget-friendly options",
    "Pet-friendly properties", "Family housing", "Student housing", "Corporate housing"
  ];

  return (
    <div className="min-h-screen pt-safe-top pb-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Agent Registration</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center space-x-2 text-sm text-neutral-600">
          <span>Agent Profile Setup</span>
          <Progress value={75} className="flex-1" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-6 space-y-6">
        {/* License Information */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">License Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="Enter your real estate license number"
                {...form.register("licenseNumber")}
              />
            </div>
            
            <div>
              <Label>License Document Upload</Label>
              <Card className="border-dashed border-2 border-neutral-300 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="text-center">
                    {uploadedLicenseUrl ? (
                      <div className="flex items-center justify-center space-x-2 text-secondary">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">License uploaded successfully</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm text-neutral-600 mb-2">
                          Upload your real estate license (PDF or image)
                        </p>
                        <input
                          type="file"
                          id="license-upload"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('license-upload')?.click()}
                          disabled={uploadMutation.isPending}
                        >
                          {uploadMutation.isPending ? 'Uploading...' : 'Choose File'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Areas Covered */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Areas You Cover</h3>
          <div className="grid grid-cols-2 gap-2">
            {commonAreas.map((area) => (
              <label
                key={area}
                className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                  selectedAreas.includes(area)
                    ? 'border-secondary bg-secondary/5'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Checkbox
                  checked={selectedAreas.includes(area)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAreas([...selectedAreas, area]);
                    } else {
                      setSelectedAreas(selectedAreas.filter(a => a !== area));
                    }
                  }}
                />
                <span className="text-sm text-neutral-700">{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Property Types</h3>
          <div className="grid grid-cols-3 gap-2">
            {propertyTypes.map((type) => (
              <label
                key={type}
                className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                  selectedPropertyTypes.includes(type)
                    ? 'border-secondary bg-secondary/5'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Checkbox
                  checked={selectedPropertyTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
                    } else {
                      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
                    }
                  }}
                />
                <span className="text-sm text-neutral-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Languages Spoken</h3>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((language) => (
              <label
                key={language}
                className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                  selectedLanguages.includes(language)
                    ? 'border-secondary bg-secondary/5'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Checkbox
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedLanguages([...selectedLanguages, language]);
                    } else {
                      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                    }
                  }}
                />
                <span className="text-sm text-neutral-700">{language}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Specializations (Optional)</h3>
          <div className="grid grid-cols-1 gap-2">
            {specializations.map((spec) => (
              <label
                key={spec}
                className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                  selectedSpecializations.includes(spec)
                    ? 'border-accent bg-accent/5'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Checkbox
                  checked={selectedSpecializations.includes(spec)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSpecializations([...selectedSpecializations, spec]);
                    } else {
                      setSelectedSpecializations(selectedSpecializations.filter(s => s !== spec));
                    }
                  }}
                />
                <span className="text-sm text-neutral-700">{spec}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Agreement */}
        <Card className="bg-neutral-50">
          <CardContent className="p-4">
            <label className="flex items-start space-x-3">
              <Checkbox className="mt-0.5" />
              <span className="text-sm text-neutral-600">
                I agree to the <a href="#" className="text-secondary underline">Agent Terms of Service</a> and 
                confirm that all information provided is accurate. I understand that my license will be verified.
              </span>
            </label>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-secondary text-white py-4 rounded-xl font-semibold"
          disabled={!uploadedLicenseUrl}
        >
          Complete Registration
        </Button>
      </form>
    </div>
  );
}
