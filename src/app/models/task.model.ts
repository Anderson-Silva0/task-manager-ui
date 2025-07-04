import { TaskStatus } from "../task/task-status.enum";

export default class Task {
    id?: number;
    title: string = '';
    description: string = '';
    status?: TaskStatus;
    createdAt?: string;
    deadline?: string | Date;
    userId: number = 0;
}