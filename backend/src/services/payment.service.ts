import { ethers } from 'ethers';
import PaymentABI from '../../contracts/artifacts/FilecoinPayment.json';

export class PaymentService {
    private contract: ethers.Contract;

    constructor(rpc: string, privateKey: string, contractAddress: string) {
        const provider = new ethers.JsonRpcProvider(rpc);
        const wallet = new ethers.Wallet(privateKey, provider);
        this.contract = new ethers.Contract(contractAddress, PaymentABI.abi, wallet);
    }

    async deposit(cid: string, amount: bigint, userAddress: string) {
        const tx = await this.contract.deposit(cid, amount);
        return await tx.wait();
    }

    async verify(cid: string, providerAddress: string) {
        const tx = await this.contract.verify(cid, providerAddress);
        return await tx.wait();
    }

    async getPayment(cid: string) {
        return await this.contract.getPayment(cid);
    }
}
