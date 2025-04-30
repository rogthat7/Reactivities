import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../types/api/agent";
import { Profile } from "../../app/models/Types/profile";
import { Photo } from "../../app/models/Types/photo";
import { useMemo } from "react";
import { User } from "../types/User";

export const useProfile = (id?: string) => {
    const queryClient = useQueryClient();
    const {data: profile, isLoading: isLoadingProfile} = useQuery({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
    const {data: photos, isLoading : isLoadingPhoto} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data;
        },
        enabled: !!id,
    });
    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id;
    }
    , [id, queryClient]);

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append('file', file);
            const response =  await agent.post<Photo>('/profiles/add-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: async (photo : Photo) => {
            await queryClient.invalidateQueries({
                queryKey: ['photos', id],
            });
            queryClient.setQueryData(['user'], (data?: User) => {
                if (!data) {
                    return data;
                }
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url,
                };
            });
            queryClient.setQueryData(['profile', id], (data?: Profile) => {
                if (!data) {
                    return data;
                }
                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url,
                };
            })
    }})
    const setMainPhoto = useMutation({
        mutationFn: async (photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/set-main-photo`);
        },
        onSuccess: async (_, photo) => {
            await queryClient.invalidateQueries({
                queryKey: ['photos', photo.id],
            });
            queryClient.setQueryData(['user'], (data?: User) => {
                if (!data) {
                    return data;
                }
                return {
                    ...data,
                    imageUrl: photo.url,
                };
            });
            queryClient.setQueryData(['profile', id], (data?: Profile) => {
                if (!data) {
                    return data;
                }
                return {
                    ...data,
                    imageUrl: photo.url,
                };
            })
        },
    });
    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`);
        },
        onSuccess: async (_,photoId) => {
            queryClient.setQueryData(['photos', id], (photos?: Photo[]) => {
                return photos?.filter((photo) => photo.id !== photoId);
            })
        },
    })
    return { profile
        , isLoadingProfile
        , photos
        , isLoadingPhoto
        , isCurrentUser  
        , uploadPhoto  
        , setMainPhoto    
        , deletePhoto
    };
}