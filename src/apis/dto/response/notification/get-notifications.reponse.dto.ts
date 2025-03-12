export type GetNotificationsResponseDto = {
    notificationId: number;
    userId: string;
    message: string;
    notificationDate: string;
    notificationType: "MILEAGE_EARNED" | "REFUND_APPROVED" | "REFUND_DENIED" | "NEW_REFUND_REQUEST" | "MENTION" | "COMMENT_ON_POST" | "REPLY_TO_COMMENT" | "REPORT_RECEIVED";
    isRead: boolean;
    amount?: number; 
    additionalInfo?: string;
};
