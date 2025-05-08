import { useLocalObservable } from "mobx-react-lite";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { ChatComment } from "../types/ChatComment";
import { runInAction } from "mobx";

export const useComments = (activityId?: string) => {
    const created = useRef(false);
    const commentStore = useLocalObservable(() => ({
        comments: [] as ChatComment[],
        hubConnection: null as HubConnection | null,
        setHubConnection(activityId: string)  {
            if(!activityId) return;
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_COMMENTS_URL}?activityId=${activityId}`,{
                    withCredentials: true,
                })
                .withAutomaticReconnect()
                .build();
            this.hubConnection.start().catch((err) => console.error('Error Establishing Hub Connection: ',err));
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {
                    this.comments = comments;
                });
            });
            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    this.comments.unshift(comment);
                });
            });
        },
        stopHubConnection() {
            if (this.hubConnection && this.hubConnection.state === "Connected") {
                this.hubConnection.stop().catch((err) => console.error('Error Stopping Hub Connection: ', err));
            }
        }
    }));
    useEffect(() => {
        if (activityId && !created.current) {
            created.current = true; // Prevents multiple connections from being created
            commentStore.setHubConnection(activityId);
        }
        return () => {
            commentStore.stopHubConnection();
            commentStore.comments = []; // Clear comments on unmount
        };
    }, [activityId]);
    return {
        commentStore,
    }

}