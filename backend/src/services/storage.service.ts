import * as Client from '@storacha/client';
import * as Signer from '@storacha/client/principal/ed25519';
import { StoreMemory } from '@storacha/client/stores/memory';

export class StorageService {
    preflightCheck(size: number) {
      throw new Error("Method not implemented.");
    }
    uploadFile(buffer: Buffer<ArrayBufferLike>, originalname: string, arg2: { mimeType: string; originalSize: number; }) {
      throw new Error("Method not implemented.");
    }
    downloadFile(pieceCid: string) {
      throw new Error("Method not implemented.");
    }
    getAccountInfo() {
      throw new Error("Method not implemented.");
    }
    setupAccount(depositAmount: any) {
      throw new Error("Method not implemented.");
    }
    private client: any;

    async init(privateKey: string, proof: string) {
        const principal = Signer.parse(privateKey);
        const store = new StoreMemory();
        
        this.client = await Client.create({ principal, store });
        
        const proofData = JSON.parse(proof);
        const space = await this.client.addSpace(proofData);
        await this.client.setCurrentSpace(space.did());
    }

    async upload(buffer: Buffer): Promise<string> {
        const blob = new Blob([buffer]);
        const result = await this.client.uploadFile(blob);
        return result.cid;
    }

    async download(cid: string): Promise<Uint8Array> {
        const result = await this.client.downloadFile(cid);
        return new Uint8Array(await result.arrayBuffer());
    }
}

export const storage = new StorageService();
