import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../../api/agent";
import { v4 as uuidv4 } from 'uuid';
import { ActivityUpdateDto } from "../models/Dtos/ActivityUpdateDto";
import { ActivityCreateDto } from "../models/Dtos/ActivityCreateDto";

class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    private getActivity = async (id: string) => {
        return this.activityRegistry.get(id);
    };

    private setActivity = async (activity: Activity) => {
        activity.date = activity.date;
        this.activityRegistry.set(activity.id, activity);
    }
    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            Date.parse(a.date.toString()) - Date.parse(b.date.toString()));
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = Date.parse(activity.date.toString());
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        );
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            var response = await agent.Activities.list();
            runInAction(() => {
                response.forEach((activity) => {
                    if (activity) this.setActivity(activity);
                });
                this.setLoadingInitial(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingInitial(false);
            });
        }
    }
    loadActivity = async (id: string) => {
        let activity = await this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    if (activity) {
                        this.setActivity(activity);
                        this.selectedActivity = activity;
                    }
                    this.setLoadingInitial(false);
                });
                return activity;
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.loadingInitial = false;
                });
            }
        }
    }
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }
    createActivity = async (activity: ActivityCreateDto) => {
        this.loading = true;
        if(!activity.newId)
            {
                activity.newId = uuidv4();
            }
        const newActivity: Activity = {
            id: activity.newId,
            title: activity.title,
            description: activity.description,
            category: activity.category,
            date: activity.date,
            city: activity.city,
            venue: activity.venue,
            latitude: activity.latitude,
            longitude: activity.longitude,
        };
        try {
            await agent.Activities.create(newActivity);
            runInAction(() => {
                this.activityRegistry.set(newActivity.id, newActivity);
                this.selectedActivity = newActivity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }
    updateActivity = async (id: string, activity: ActivityUpdateDto) => {
        this.loading = true;
        var reqActivity = { ...activity, id };
        try {
            await agent.Activities.update(reqActivity);
            runInAction(() => {
                this.activityRegistry.set(id, reqActivity);
                this.selectedActivity = reqActivity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}

export default ActivityStore;