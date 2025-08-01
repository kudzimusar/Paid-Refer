import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";

const customerRequestSchema = z.object({
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  preferredAreas: z.array(z.string()).min(1, "Please select at least one area"),
  propertyType: z.enum(['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K+']),
  moveInDate: z.string().optional(),
  occupants: z.number().min(1).max(10),
  mustHaveFeatures: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
});

type CustomerRequestForm = z.infer<typeof customerRequestSchema>;

interface CustomerRequestFormProps {
  onSubmit: (data: CustomerRequestForm) => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

export function CustomerRequestForm({ onSubmit, onBack, step, totalSteps }: CustomerRequestFormProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const { latitude, longitude } = useGeolocation();

  const form = useForm<CustomerRequestForm>({
    resolver: zodResolver(customerRequestSchema),
    defaultValues: {
      budgetMin: 50000,
      budgetMax: 150000,
      preferredAreas: [],
      occupants: 1,
      mustHaveFeatures: [],
    },
  });

  const handleSubmit = (data: CustomerRequestForm) => {
    onSubmit({
      ...data,
      preferredAreas: selectedAreas,
      mustHaveFeatures: selectedFeatures,
    });
  };

  const commonAreas = [
    "Shibuya", "Shinjuku", "Harajuku", "Roppongi", "Ginza", "Akihabara",
    "Ikebukuro", "Ueno", "Asakusa", "Tsukiji", "Odaiba", "Ebisu"
  ];

  const features = [
    "Pet-friendly", "Balcony", "Parking", "Near station",
    "Furnished", "Internet included", "Washing machine", "Air conditioning",
    "Security system", "Elevator", "Storage space", "Gym access"
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
          <h1 className="text-lg font-semibold text-neutral-900">Find Your Apartment</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center space-x-2 text-sm text-neutral-600">
          <span>Step {step} of {totalSteps}</span>
          <Progress value={(step / totalSteps) * 100} className="flex-1" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-6 space-y-6">
        {/* Budget Section */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Budget Range (¥/month)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetMin">Minimum</Label>
              <Input
                id="budgetMin"
                type="number"
                placeholder="50,000"
                {...form.register("budgetMin", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="budgetMax">Maximum</Label>
              <Input
                id="budgetMax"
                type="number"
                placeholder="150,000"
                {...form.register("budgetMax", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        {/* Areas Section */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Preferred Areas</h3>
          <div className="relative mb-4">
            <Input
              placeholder="Search areas (e.g., Shibuya, Shinjuku)"
              className="pr-12"
            />
            <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {commonAreas.map((area) => (
              <label
                key={area}
                className={`flex items-center space-x-2 p-3 border rounded-xl cursor-pointer transition-colors ${
                  selectedAreas.includes(area)
                    ? 'border-primary bg-primary/5'
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

        {/* Property Type */}
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <Select onValueChange={(value) => form.setValue("propertyType", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1K">1K</SelectItem>
              <SelectItem value="1DK">1DK</SelectItem>
              <SelectItem value="1LDK">1LDK</SelectItem>
              <SelectItem value="2K">2K</SelectItem>
              <SelectItem value="2DK">2DK</SelectItem>
              <SelectItem value="2LDK">2LDK</SelectItem>
              <SelectItem value="3K+">3K+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Move-in Date and Occupants */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="moveInDate">Move-in Date</Label>
            <Input
              id="moveInDate"
              type="date"
              {...form.register("moveInDate")}
            />
          </div>
          <div>
            <Label htmlFor="occupants">Occupants</Label>
            <Select onValueChange={(value) => form.setValue("occupants", parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="1 person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 person</SelectItem>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3">3+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Must-have Features */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Must-have Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <label
                key={feature}
                className={`flex items-center space-x-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                  selectedFeatures.includes(feature)
                    ? 'border-primary bg-primary/5'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFeatures([...selectedFeatures, feature]);
                    } else {
                      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                    }
                  }}
                />
                <span className="text-sm text-neutral-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any specific requirements or preferences..."
            rows={3}
            {...form.register("additionalNotes")}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-semibold">
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}
