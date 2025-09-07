import { formatDistanceToNow } from "date-fns";

export const timeAgo = (date: string | Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true})
}