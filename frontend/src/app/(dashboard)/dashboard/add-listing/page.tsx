"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { useCreateProperty } from "@/hooks/useProperties";
import { KENYA_COUNTIES, HOUSE_TYPES } from "@/lib/utils";

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

export default function AddListingPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - images.length);
    setImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, String(v)); });
    images.forEach((img) => fd.append("images", img));

    try {
      await createProperty.mutateAsync(fd);
      toast.success("Listing created! Pending verification.");
      router.push("/dashboard/listings");
    } catch {
      toast.error("Failed to create listing. Please try again.");
    }
  };

  const inputClass = (err?: boolean) =>
    `w-full border ${err ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-3 text-sm bg-white
     focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder:text-gray-400`;

  const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

  return (
    <div className="p-6 max-w-3xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="font-heading text-xl font-bold text-gray-900 mb-1">Add New Listing</h2>
        <p className="text-gray-500 text-sm mb-8">Fill in the details below. Your listing will be reviewed within 24 hours.</p>

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
                <textarea {...register("description")} rows={4} placeholder="Describe the property, nearby amenities, and what makes it great..."
                  className={inputClass(!!errors.description)} />
                <ErrorMsg msg={errors.description?.message} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Rent (KES) *</label>
                  <input type="number" {...register("rent")} placeholder="8000" className={inputClass(!!errors.rent)} />
                  <ErrorMsg msg={errors.rent?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deposit (KES)</label>
                  <input type="number" {...register("deposit")} placeholder="8000" className={inputClass(!!errors.deposit)} />
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
                <input {...register("town")} placeholder="e.g. Westlands" className={inputClass(!!errors.town)} />
                <ErrorMsg msg={errors.town?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estate</label>
                <input {...register("estate")} placeholder="e.g. Parklands" className={inputClass()} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street / Address</label>
                <input {...register("address")} placeholder="e.g. Mpaka Rd, House No. 4" className={inputClass()} />
              </div>
            </div>
          </section>

          {/* Photos */}
          <section>
            <h3 className="font-semibold text-gray-900 text-sm mb-4 pb-2 border-b border-gray-100">
              Photos (max 8)
            </h3>

            {/* Upload zone */}
            <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer
                              hover:border-brand-400 hover:bg-brand-50/30 transition-all mb-4">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — Max 5MB each</p>
              <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute bottom-1 left-1 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Primary
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 8 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center
                                    justify-center cursor-pointer hover:border-brand-400 transition-colors">
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Add more</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                  </label>
                )}
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()}
              className="flex-1 btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProperty.isPending}
              className="flex-2 btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {createProperty.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createProperty.isPending ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
