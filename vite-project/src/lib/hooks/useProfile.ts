import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../types/api/agent";
import { Profile } from "../../app/models/Types/profile";
import { Photo } from "../../app/models/Types/photo";
import { useMemo, useState } from "react";
import { User } from "../types/User";
import { UserActivity } from "../../app/models/Types/userActivity";

export const useProfile = (id?: string, predicate?:string) => {
    const [filter, setFilter] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const {data: profile, isLoading: isLoadingProfile} = useQuery({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${id}`);
            return response.data;
        },
        enabled: !!id && !predicate,
    });

    const {data: photos, isLoading : isLoadingPhoto} = useQuery<Photo[]>({
        queryKey: ['photos', id],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
            return response.data;
        },
        enabled: !!id,
    });


    const updateFollowing = useMutation({
        mutationFn: async () => {
            await agent.post(`/profiles/${id}/follow`);
        },
        onSuccess: async () => {
            queryClient.setQueryData(['profile', id], (data?: Profile) => {
                queryClient.invalidateQueries({
                    queryKey : ['followings', id, 'followers']
                })
                if (!data || data.followersCount=== undefined) {
                    return data;
                }
                return {
                    ...data,
                    isFollowing: !data.isFollowing,
                    followersCount: data.isFollowing ? data.followersCount - 1 : data.followersCount + 1,
                };
            });

            
        }
    });
    const isCurrentUser = useMemo(() => {
        return id === queryClient.getQueryData<User>(['user'])?.id;
    }
    , [id, queryClient]);

    const {data: followings, isLoading: loadingFollowings} = useQuery<Profile[]>({
        queryKey: ['followings', id, predicate],
        queryFn: async () => {
            const response = await agent.get<Profile[]>(`/profiles/${id}/follow-list/?predicate=${predicate}`);
            return response.data;
        },
        enabled: !!id && !!predicate,
    })
    const { data: userActivities, isLoading: isLoadingUserActivities } = useQuery<UserActivity[]>({
        queryKey: ['user-activities', id, filter],
        queryFn: async () => {
            const response = await agent.get<UserActivity[]>(`/profiles/${id}/activities`, {params: {filter}});
            return response.data;
        },
        enabled: !!id && !!filter,
    });
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
    });
    const editProfile = useMutation({
        mutationFn: async (profile: Profile) => {
            await agent.put(`/profiles/${profile.id}/edit-profile`, profile);
        },
        onSuccess: async (_, profile) => {
            queryClient.setQueryData(['profile', id], (data?: Profile) => {
                if (!data) {
                    return data;
                }
                return {
                    ...data,
                    displayName: profile.displayName,
                    bio: profile.bio
                };
            })
            queryClient.setQueryData(['user'], (data?: User) => {
                if (!data) {
                    return data;
                }
                return {
                    ...data,
                    displayName: profile.displayName,
                };
            });
        },
    });
    return { profile
        , isLoadingProfile
        , photos
        , isLoadingPhoto
        , isCurrentUser  
        , uploadPhoto  
        , setMainPhoto    
        , deletePhoto
        , editProfile
        , updateFollowing
        , followings
        , loadingFollowings
        , userActivities
        , isLoadingUserActivities
        , setFilter
    };
}