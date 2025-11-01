import { Router } from 'express';
import { ethers } from 'ethers';
import { PaymentService } from '../services/payment.service';

const router = Router();
const payment = new PaymentService(
    process.env.FILECOIN_RPC!,
    process.env.FILECOIN_PRIVATE_KEY!,
    process.env.PAYMENT_CONTRACT_ADDRESS!
);

router.post('/deposit', async (req, res) => {
    try {
        const { cid, amount } = req.body;
        const result = await payment.deposit(cid, ethers.parseUnits(amount, 18), req.body.userAddress);
        res.json({ transactionHash: result.hash });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status/:cid', async (req, res) => {
    try {
        const p = await payment.getPayment(req.params.cid);
        res.json({ status: p.status, amount: p.amount.toString() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
