import { TaskStatus } from "./task-status.enum";

export default class Task {
    id?: number;
    title: string = '';
    description: string = '';
    status?: TaskStatus;
    createdAt?: Date;
    deadline?: Date;
    userId: number = 0;
}