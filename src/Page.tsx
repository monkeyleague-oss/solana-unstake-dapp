import { FC, useEffect, useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createUnStakeService } from './unstake/service';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';

(window as any).Buffer = Buffer;

export const Page: FC = () => {
    const { connection } = useConnection();
    const walletState = useWallet();
    const service = useMemo(
        () =>
            walletState.publicKey
                ? createUnStakeService(connection, {
                      publicKey: walletState.publicKey,
                      signTransaction: walletState.signTransaction,
                      signAllTransactions: walletState.signAllTransactions,
                  })
                : null,
        [connection, walletState]
    );
    const [data, setData] = useState<{
        vaultTotal: string;
        userTotal: string;
        userRewards: string;
    }>();

    useEffect(() => {
        if (!service) {
            return;
        }
        service
            .getStakingOnChainData()
            .then((payload) => {
                setData(payload);
            })
            .catch((error) => {
                console.warn(error);
            });
    }, [service]);

    return (
        <div>
            <WalletMultiButton />
            <div>{data ? <pre style={{ color: 'white' }}>{JSON.stringify(data, null, 2)}</pre> : <></>}</div>
        </div>
    );
};
