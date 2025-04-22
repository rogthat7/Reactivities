import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../types/api/agent";
import { useLocation } from "react-router";
import { ActivityDetailsGetDto } from "../../app/models/Dtos/ActivityDetailsGetDto";
import { Activity } from "../../app/models/activity";
import { useAccount } from "./useAccount";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const {currentUser} = useAccount();
  const location = useLocation();
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
    enabled: !id && location.pathname === "/activities" && !!currentUser
  });
  const { data : activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const response = await agent.get<ActivityDetailsGetDto>(`/activities/${id}`);
      return response.data.data;
    },
    enabled: !!id && !!currentUser,
    onError: (error) => {
      console.error("Error fetching activity:", error);
    },
  });
  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await agent.post<Activity>("/activities", activity);
    
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
    onError: (error) => {
      console.error("Error creating activity:", error);
    },
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await agent.put<Activity>(
        `/activities/${activity.id}`,
        activity
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      const response = await agent.delete(`/activities/${id}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  return {
    activities,
    createActivity,
    updateActivity,
    deleteActivity,
    isLoading,
    isLoadingActivity,
    activity,
  };
};
