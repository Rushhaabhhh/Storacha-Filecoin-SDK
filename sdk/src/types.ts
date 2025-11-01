export interface UploadResult {
    cid: string;
    fileName: string;
    delegation: string;
}

export interface PaymentResult {
    transactionHash: string;
}

export interface PaymentStatus {
    status: number;
    amount: string;
}
