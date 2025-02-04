export interface RefundHistoryItem {
    transactionDate: string;
    amount: number;
    status: string;
}

export interface GetMileageResponseDto {
    code: string;
    message: string;
    totalMileage: number;
    totalRefundedMileage: number;
    refundHistory: RefundHistoryItem[];
}
