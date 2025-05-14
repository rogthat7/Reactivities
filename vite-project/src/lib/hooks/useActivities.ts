import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import agent from "../types/api/agent";
import { useLocation } from "react-router";
import { Activity } from "../../app/models/Types/activity";
import { useAccount } from "./useAccount";
import { PagedList } from "../../app/models/Types/pagedList";
import { useStore } from "./useStore";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAccount();
  const location = useLocation();
  const {activityStore:{filter, startDate}} = useStore();

  const {
    data: activitiesGroup,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PagedList<Activity, string>>({
    queryKey: ["activities",filter, startDate],
    queryFn: async ({ pageParam = null }) => {
      const response = await agent.get<PagedList<Activity, string>>(
        "/activities",
        {
          params: {
            cursor: pageParam,
            pageSize: 3,
            filter,
            startDate
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    enabled: !id && location.pathname === "/activities" && !!currentUser,

    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.map((activity) => {
          const host = activity.attendees.find((x) => x.id === activity.hostId);
          return {
            ...activity,
            isHost: currentUser?.id === activity.hostId,
            isGoing: activity.attendees.some((x) => x.id === currentUser?.id),
            hostImageUrl: host?.imageUrl || "",
          };
        }),
      })),
    }),
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled: !!id && !!currentUser,
    select: (data) => {
      const host = data.attendees.find((x) => x.id === data.hostId);
      return {
        ...data,
        isHost: currentUser?.id === data.hostId,
        isGoing: data.attendees.some((x) => x.id === currentUser?.id),
        hostImageUrl: host?.imageUrl,
      };
    },
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

  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      const response = await agent.post(`/activities/${id}/attend`, {});
      return response.data;
    },
    onMutate: async (activityId: string) => {
      await queryClient.cancelQueries({ queryKey: ["activities", activityId] });
      const previousActivity = queryClient.getQueryData<Activity>([
        "activities",
        activityId,
      ]);

      queryClient.setQueryData<Activity>(
        ["activities", activityId],
        (oldActivity) => {
          if (!oldActivity || !currentUser) return oldActivity;

          const isHost = currentUser.id === oldActivity.hostId;
          const isGoing = oldActivity.attendees.some(
            (x) => x.id === currentUser.id
          );

          return {
            ...oldActivity,
            isCancelled: isHost
              ? !oldActivity.isCancelled
              : oldActivity.isCancelled,
            attendees: isGoing
              ? isHost
                ? oldActivity.attendees
                : oldActivity.attendees.filter((x) => x.id !== currentUser.id)
              : [
                  ...oldActivity.attendees,
                  {
                    id: currentUser.id,
                    displayName: currentUser.displayName,
                    imageUrl: currentUser.imageUrl,
                    username: currentUser.email || "",
                    following: false,
                    followersCount: 0,
                    followingCount: 0,
                  },
                ],
          };
        }
      );
      return { previousActivity };
    },
    onError: (error, activityId, context) => {
      console.error("Error updating attendance:", error);
      if (context?.previousActivity) {
        queryClient.setQueryData<Activity>(
          ["activities", activityId],
          context?.previousActivity
        );
      }
    },
  });

  return {
    activitiesGroup,
    createActivity,
    updateActivity,
    deleteActivity,
    isLoading,
    isLoadingActivity,
    activity,
    updateAttendance,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};
