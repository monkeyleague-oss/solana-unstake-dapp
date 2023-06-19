import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export const MBS = new PublicKey('Fm9rHUTF5v3hwMLbStjZXqNBBoZyGriQaFM6sTFz3K8A');

export const PROGRAM_ID = new PublicKey('MLnE7HFVmVdVTqGQEYWyBPhNQisb7RVUfKdU8cgAzET');

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

export const MBS_DECIMALS_MULTIPLE = new BN(BigInt(10 ** 6).toString());
