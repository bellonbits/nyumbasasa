"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Loader2, ArrowLeft } from "lucide-react";
import { useProperty, useUpdateProperty } from "@/hooks/useProperties";
import { KENYA_COUNTIES, HOUSE_TYPES } from "@/lib/utils";
import Link from "next/link";

const schema = z.object({
  title:       z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  rent:        z.coerce.number().min(500, "Minimum rent is KES 500"),
  deposit:     z.coerce.number().min(0),
  houseType:   z.string().min(1, "Select a house type"),
  county:      z.string().min(1, "Select a county"),
  town:        z.string().min(1, "Town is required"),
  estate:      z.string().optional(),
  address:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditListingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);
  const updateProperty = useUpdateProperty(id);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Pre-fill form when property loads
  useEffect(() => {
    if (property) {
      reset({
        title:       property.title,
        description: property.description,
        rent:        property.rent,
        deposit:     property.deposit,
        houseType:   property.houseType,
        county:      property.county.name,
        town:        property.town.name,
        estate:      property.estate?.name ?? "",
        address:     property.address ?? "",
      });
    }
  }, [property, reset]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - newImages.length);
    setNewImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeNewImage = (i: number) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (data: FormData) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, String(v)); });
    newImages.forEach((img) => fd.append("images", img));
    try {
      await updateProperty.mutateAsync(fd);
      toast.success("Listing updated successfully!");
      router.push("/dashboard/listings");
    } catch {
      toast.error("Failed to update listing. Please try again.");
    }
  };

  const inputClass = (err?: boolean) =>
    `w-full border ${err ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-3 text-sm bg-white
     focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder:text-gray-400`;

  const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Listing not found.</p>
        <Link href="/dashboard/listings" className="btn-primary text-sm">Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/listings"
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="font-bold text-gray-900 text-xl">Edit Listing</h2>
          <p className="text-gray-400 text-sm mt-0.5">Update your property details</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Basic Info */}
          <section>
            <h3 className="font-semibold text-gray-900 text-sm mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Title *</label>
                <input {...register("title")} placeholder="e.g. Cozy Bedsitter near Westgate Mall" className={inputClass(!!errors.title)} />
                <ErrorMsg msg={errors.title?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea {...register("description")} rows={4}
                  placeholder="Describe the property, nearby amenities..."
                  className={inputClass(!!errors.description)} />
                <ErrorMsg msg={errors.description?.message} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Rent (KES) *</label>
                  <input type="number" {...register("rent")} className={inputClass(!!errors.rent)} />
                  <ErrorMsg msg={errors.rent?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deposit (KES)</label>
                  <input type="number" {...register("deposit")} className={inputClass()} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">House Type *</label>
                <select {...register("houseType")} className={inputClass(!!errors.houseType)}>
                  <option value="">Select type...</option>
                  {HOUSE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ErrorMsg msg={errors.houseType?.message} />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h3 className="font-semibold text-gray-900 text-sm mb-4 pb-2 border-b border-gray-100">Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">County *</label>
                <select {...register("county")} className={inputClass(!!errors.county)}>
                  <option value="">Select county...</option>
                  {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ErrorMsg msg={errors.county?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Town *</label>
                <input {...register("town")} className={inputClass(!!errors.town)} />
                <ErrorMsg msg={errors.town?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estate</label>
                <input {...register("estate")} className={inputClass()} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street / Address</label>
                <input {...register("address")} className={inputClass()} />
              </div>
            </div>
          </section>

          {/* Existing photos */}
          {property.images.length > 0 && (
            <section>
              <h3 className="font-semibold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">Current Photos</h3>
              <div className="grid grid-cols-4 gap-3">
                {property.images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {img.isPrimary && (
                      <div className="absolute bottom-1 left-1 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Add new photos */}
          <section>
            <h3 className="font-semibold text-gray-900 text-sm mb-3 pb-2 border-b border-gray-100">
              Add New Photos
            </h3>
            <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer
                              hover:border-brand-400 hover:bg-brand-50/30 transition-all mb-3">
              <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to add more photos</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — Max 5MB each</p>
              <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="flex-1 btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={updateProperty.isPending}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
              {updateProperty.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {updateProperty.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
