import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesApi, dashboardApi } from "@/lib/api";
import type { SearchFilters } from "@/types";

export const PROPERTY_KEYS = {
  all:      ["properties"] as const,
  search:   (filters: SearchFilters) => ["properties", "search", filters] as const,
  detail:   (id: string) => ["properties", id] as const,
  featured: ["properties", "featured"] as const,
  myList:   (page: number) => ["dashboard", "listings", page] as const,
};

export function usePropertySearch(filters: SearchFilters) {
  return useQuery({
    queryKey: PROPERTY_KEYS.search(filters),
    queryFn: () => propertiesApi.search(filters).then((r) => r.data),
    placeholderData: (prev) => prev,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: PROPERTY_KEYS.detail(id),
    queryFn:  () => propertiesApi.getById(id).then((r) => r.data.data),
    enabled:  !!id,
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: PROPERTY_KEYS.featured,
    queryFn:  () => propertiesApi.getFeatured().then((r) => r.data.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useMyListings(page = 1) {
  return useQuery({
    queryKey: PROPERTY_KEYS.myList(page),
    queryFn:  () => dashboardApi.getMyListings(page).then((r) => r.data),
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => propertiesApi.create(data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => propertiesApi.update(id, data).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: PROPERTY_KEYS.detail(id) });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}
