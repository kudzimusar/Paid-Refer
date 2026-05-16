import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Building, MapPin, DollarSign, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/ui/primitives";
import { EmptyState, StatusBadge } from "@/components/ui/shared";

interface Property {
  id: string;
  title: string;
  address: string;
  price: string | number;
  currency: string;
  status: string;
}

export default function HouseOwnerPropertiesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", address: "", price: "", currency: "USD" });
  const [formError, setFormError] = useState("");

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/house-owner/properties"],
  });

  const createProperty = useMutation({
    mutationFn: async () => {
      setFormError("");
      const res = await apiRequest("POST", "/api/house-owner/properties", {
        ...form,
        price: Number(form.price || 0),
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Property saved", description: "Your property was created successfully." });
      setForm({ title: "", address: "", price: "", currency: "USD" });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/house-owner/properties"] });
    },
    onError: () => {
      setFormError("Unable to save property. Please check all fields and retry.");
      toast({ title: "Unable to save", description: "Please check the fields and try again.", variant: "destructive" });
    },
  });

  return (
    <div className="page-container bg-gray-50/50 pb-24">
      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle title="Properties" subtitle="Create and manage your listings" count={properties.length} />
          <button
            data-testid="house-owner-new-property-toggle"
            onClick={() => setShowForm((s) => !s)}
            className="btn-premium px-4 py-2 text-xs flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {showForm ? "Close" : "New Property"}
          </button>
        </div>

        {showForm && (
          <div className="premium-card p-4 space-y-3">
            <Input data-testid="property-title-input" placeholder="Property title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input data-testid="property-address-input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input data-testid="property-price-input" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input data-testid="property-currency-input" placeholder="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            {formError && <p className="text-xs text-red-500" data-testid="property-form-error">{formError}</p>}
            <button
              data-testid="save-property-button"
              onClick={() => createProperty.mutate()}
              disabled={createProperty.isPending || !form.title || !form.address || !form.price}
              className="btn-premium w-full"
            >
              {createProperty.isPending ? "Saving..." : "Save Property"}
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading properties...</p>
        ) : properties.length > 0 ? (
          <div className="space-y-3">
            {properties.map((prop) => (
              <div key={prop.id} className="premium-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-neutral-900 truncate">{prop.title}</p>
                  <p className="text-xs text-neutral-500 truncate flex items-center gap-1"><MapPin className="w-3 h-3" />{prop.address}</p>
                  <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1"><DollarSign className="w-3 h-3" />{prop.currency} {prop.price}</p>
                </div>
                <StatusBadge status={prop.status} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building}
            title="No properties yet"
            description="Use New Property to add your first listing."
            action={<button onClick={() => setShowForm(true)} className="btn-premium px-6">List Property</button>}
          />
        )}
      </div>
    </div>
  );
}
