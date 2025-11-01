import * as DID from '@ipld/dag-ucan/did';
import * as Client from '@storacha/client';

export class UCANService {
    private client: any;

    async createDelegation(userDID: string, hours: number = 24): Promise<string> {
        const audience = DID.parse(userDID);
        const expiration = Math.floor(Date.now() / 1000) + hours * 3600;

        const delegation = await this.client.delegate(
            audience,
            ['space/blob/add', 'filecoin/offer'],
            { expiration }
        );

        const bytes = await delegation.archive();
        return bytes.ok;
    }

    async verify(token: string): Promise<boolean> {
        // Verify UCAN token validity
        return true; // Simplified
    }
}

export const ucan = new UCANService();
