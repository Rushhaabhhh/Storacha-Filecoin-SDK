import axios, { AxiosInstance } from 'axios';
import fs from 'fs/promises';
import { UploadResult, PaymentResult, PaymentStatus } from './types';

export class StorachaClient {
    private client: AxiosInstance;

    constructor(backendUrl: string = 'http://localhost:3000') {
        this.client = axios.create({ baseURL: backendUrl });
    }

    async uploadFile(filePath: string, userDID: string): Promise<UploadResult> {
        const buffer = await fs.readFile(filePath);
        const form = new FormData();
        form.append('file', new Blob([buffer]));
        form.append('userDID', userDID);

        const { data } = await this.client.post('/upload', form);
        return data;
    }

    async deposit(cid: string, amount: string, userAddress: string): Promise<PaymentResult> {
        const { data } = await this.client.post('/payment/deposit', { cid, amount, userAddress });
        return data;
    }

    async getPaymentStatus(cid: string): Promise<PaymentStatus> {
        const { data } = await this.client.get(`/payment/status/${cid}`);
        return data;
    }

    async healthCheck(): Promise<boolean> {
        try {
            await this.client.get('/health');
            return true;
        } catch {
            return false;
        }
    }
}

export default StorachaClient;
