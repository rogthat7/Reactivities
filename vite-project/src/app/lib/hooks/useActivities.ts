import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity } from "../../models/activity";
import agent from "../types/api/agent";

export const useActivities =  (id?:string) => {
    const queryClient = useQueryClient();
    const { data : activities, isLoading } = useQuery({
        queryKey: ['activities'],
        queryFn: async () => {
          const response =  await agent.get<Activity[]>('/activities');
          return response.data;
        } 
      });
      const { data: activity, isLoading: isLoadingActivity } = useQuery({
        queryKey: ['activity',id],
        queryFn: async () => {
          const response =  await agent.get<Activity>(`/activities/${id}`);
          return response.data;
        },
        enabled: !!id,
        onError: (error) => {
            console.error("Error fetching activity:", error);
        }});
    const createActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            const response = await agent.post<Activity>('/activities', activity);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities'],
            });
        },
        onError: (error) => {
            console.error("Error creating activity:", error);
        }});
    
      const updateActivity = useMutation({
        mutationFn: async (activity: Activity) => {
            const response = await agent.put<Activity>(`/activities/${activity.id}`, activity);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities'],
            });
        },})

    const deleteActivity = useMutation({
        mutationFn: async (id: string) => {
            const response = await agent.delete(`/activities/${id}`);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['activities'],
            });
        },
        })

    return { activities, createActivity, updateActivity, deleteActivity, isLoading,isLoadingActivity, activity };
}