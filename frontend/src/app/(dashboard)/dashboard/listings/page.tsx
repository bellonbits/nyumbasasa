"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Edit2, Trash2, Eye, PlusCircle, Building2 } from "lucide-react";
import { useMyListings, useDeleteProperty } from "@/hooks/useProperties";
import { formatKES, houseTypeLabel, timeAgo } from "@/lib/utils";
import { getPrimaryImage } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

export default function MyListingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useMyListings(page);
  const deleteProperty = useDeleteProperty();

  const listings = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    try {
      await deleteProperty.mutateAsync(id);
      toast.success("Listing deleted");
      refetch();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      active:   "bg-green-100 text-green-700",
      pending:  "bg-yellow-100 text-yellow-700",
      archived: "bg-gray-100 text-gray-600",
      rejected: "bg-red-100 text-red-600",
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${styles[status] ?? styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-gray-900 text-xl">My Listings</h2>
          <p className="text-gray-400 text-sm mt-0.5">{meta?.total ?? 0} total properties</p>
        </div>
        <Link href="/dashboard/add-listing" className="btn-primary text-sm flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add Listing
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">No listings yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first listing to start receiving inquiries.</p>
          <Link href="/dashboard/add-listing" className="btn-primary text-sm inline-flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add New Listing
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-muted border-b border-gray-100">
                <tr>
                  {["Property", "Type", "Rent", "Status", "Views", "Listed", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {listings.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={getPrimaryImage(p.images)} alt={p.title} fill className="object-cover" />
                        </div>
                        <div>
                          <Link href={`/dashboard/listings/${p.id}`} className="font-medium text-gray-900 text-sm truncate max-w-[200px] hover:text-brand-600 transition-colors">{p.title}</Link>
                          <p className="text-gray-400 text-xs">{p.town.name}, {p.county.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{houseTypeLabel(p.houseType)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900 text-sm">{formatKES(p.rent)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        {p.viewCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {timeAgo(p.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/property/${p.id}`}
                          className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                          title="View">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/listings/${p.id}/edit`}
                          className="w-8 h-8 rounded-lg hover:bg-brand-50 flex items-center justify-center text-gray-400 hover:text-brand-500 transition-colors"
                          title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:border-brand-400 transition-colors">
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {meta.totalPages}</span>
              <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:border-brand-400 transition-colors">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
