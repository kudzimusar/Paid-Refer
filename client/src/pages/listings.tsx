import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Building, MapPin, JapaneseYen, DollarSign, Brain, Trash2, Edit2, Loader2, Camera, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PremiumCard } from "@/components/ui/premium-card";
import { BottomNav } from "@/components/layout/BottomNav";
import { SectionTitle } from "@/components/ui/primitives";
import { NavLogo } from "@/components/ui/Logo";

interface Property {
  id: string;
  title: string;
  propertyType: string;
  city: string;
  district?: string;
  price: string | number;
  currency: string;
  status: string;
  photoUrls: string[];
  aiQualityScore?: number;
  bedrooms?: number;
  sizeSqm?: string | number;
}

export default function ListingsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/agent/properties"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/agent/properties/${id}`),
    onSuccess: () => {
      toast({ title: "Property deleted" });
      qc.invalidateQueries({ queryKey: ["/api/agent/properties"] });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete property", variant: "destructive" }),
  });

  return (
    <div className="page-container bg-gray-50/50 pb-24">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-5 py-4 max-w-4xl mx-auto flex items-center justify-between">
          <NavLogo />
          <button 
            onClick={() => setIsAdding(true)}
            className="btn-premium px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            Add Listing
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-6">
          <SectionTitle 
            title="My Listings" 
            subtitle="Manage your property inventory" 
            count={properties.length} 
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="premium-card h-80 animate-pulse bg-neutral-100" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onDelete={() => {
                    if (confirm("Are you sure you want to delete this listing?")) {
                      deleteMutation.mutate(property.id);
                    }
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="premium-card border-dashed border-2 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
              <Building className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">No properties yet</h3>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto mt-1">
                Start sharing your properties with customers by adding your first listing.
              </p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-premium px-6 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Listing
            </button>
          </div>
        )}
      </div>

      <BottomNav />

      {/* Add Listing Modal */}
      {isAdding && (
        <AddListingModal 
          onClose={() => setIsAdding(false)} 
          onSuccess={() => {
            setIsAdding(false);
            qc.invalidateQueries({ queryKey: ["/api/agent/properties"] });
          }}
        />
      )}
    </div>
  );
}

function PropertyCard({ property, onDelete }: { property: Property; onDelete: () => void }) {
  const score = property.aiQualityScore || 0;
  const scoreColor = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="premium-card group overflow-hidden"
    >
      {/* Photo area */}
      <div className="relative aspect-[4/3] bg-neutral-100">
        {property.photoUrls[0] ? (
          <img 
            src={property.photoUrls[0]} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building className="w-10 h-10 text-neutral-300" />
          </div>
        )}

        {/* AI Score Badge */}
        {score > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <div className="h-2 w-8 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className={`h-full ${scoreColor}`}
              />
            </div>
            <span className="text-[10px] font-bold text-white uppercase">{score}pt</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider
            ${property.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-white'}`}>
            {property.status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="min-w-0">
          <h4 className="font-bold text-neutral-900 truncate leading-tight">{property.title}</h4>
          <div className="flex items-center gap-1 text-neutral-400 mt-1">
            <MapPin className="w-3 h-3" />
            <span className="text-xs truncate">{property.city}{property.district ? `, ${property.district}` : ""}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-1 text-primary">
            {property.currency === 'JPY' ? <JapaneseYen className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
            <span className="text-lg font-extrabold">{Number(property.price).toLocaleString()}</span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase ml-1">/ mo</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-500 text-xs font-bold">
            <span className="flex items-center gap-1">
              <span className="text-neutral-900">{property.bedrooms || 0}</span> Bed
            </span>
            <span className="flex items-center gap-1">
              <span className="text-neutral-900">{Math.round(Number(property.sizeSqm || 0))}</span>㎡
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-neutral-100">
          <button className="flex-1 h-9 flex items-center justify-center gap-2 rounded-xl text-neutral-600 font-bold text-xs hover:bg-neutral-50 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="flex-1 h-9 flex items-center justify-center gap-2 rounded-xl text-red-500 font-bold text-xs hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AddListingModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "1LDK",
    city: "Tokyo",
    district: "",
    price: "",
    currency: "JPY",
    bedrooms: 1,
    sizeSqm: "",
    photoUrls: [] as string[],
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiRequest("POST", "/api/agent/properties", {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        sizeSqm: Number(formData.sizeSqm),
        country: "JP", // Default for now
        priceType: "monthly",
      });
      toast({ title: "Property listed! ✓", description: "AI is analyzing your photos now." });
      onSuccess();
    } catch (err) {
      toast({ title: "Failed", description: "Could not save listing", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-8 pt-10 pb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Add Listing</h2>
            <div className="flex gap-1 mt-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary' : 'bg-neutral-100'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="bg-neutral-100 p-3 rounded-2xl hover:bg-neutral-200 transition-colors">
            <JapaneseYen className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Title</label>
                <input 
                  autoFocus
                  className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" 
                  placeholder="e.g. Modern Loft in Shibuya"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Property Type</label>
                  <select 
                    className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                    value={formData.propertyType}
                    onChange={e => setFormData({...formData, propertyType: e.target.value})}
                  >
                    <option>1K</option>
                    <option>1LDK</option>
                    <option>2LDK</option>
                    <option>Studio</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">City</label>
                  <input 
                    className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">District</label>
                <input 
                  className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Ebisu"
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                />
              </div>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Price (Monthly)</label>
                  <input 
                    className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" 
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Size (㎡)</label>
                  <input 
                    className="w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" 
                    type="number"
                    value={formData.sizeSqm}
                    onChange={e => setFormData({...formData, sizeSqm: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Bedrooms</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map(num => (
                    <button 
                      key={num}
                      onClick={() => setFormData({...formData, bedrooms: num})}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.bedrooms === num ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'}`}
                    >
                      {num === 0 ? 'Stu' : `${num}BR`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-purple-50 rounded-[2rem] p-6 border border-purple-100 relative">
                <Brain className="absolute -right-2 -top-2 w-16 h-16 text-purple-200" />
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <p className="font-black text-purple-900 text-sm tracking-tight">AI Photo Insights</p>
                </div>
                <p className="text-xs text-purple-700 leading-relaxed max-w-xs">
                  Upload photos and our AI will automatically tag amenities and score photo quality for better lead matching.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-neutral-100 transition-colors">
                  <div className="bg-white p-2.5 rounded-2xl shadow-sm">
                    <Camera className="w-5 h-5 text-neutral-400" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Upload Main</span>
                </button>
                <button className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-neutral-100 transition-colors">
                  <div className="bg-white p-2.5 rounded-2xl shadow-sm">
                    <Plus className="w-5 h-5 text-neutral-400" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Add More</span>
                </button>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-4 flex gap-3 items-start">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
                  Best photos show clear lighting, wide angles, and clean spaces. We recommend at least 1 photo per room.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-white border-t border-neutral-50 flex gap-3">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="h-14 px-8 bg-neutral-100 text-neutral-500 font-bold rounded-2xl hover:bg-neutral-200 transition-colors"
            >
              Back
            </button>
          )}
          <button 
            disabled={loading}
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            className="flex-1 h-14 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-neutral-900/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {step === 3 ? "Complete Listing" : "Next Step"}
                <Plus className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
