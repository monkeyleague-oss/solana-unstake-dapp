import { FC, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';
import { Button } from '@mui/material';
import { StakingProgramData, createUnStakeService } from '../unstake/service';
import BN from 'bn.js';
import { MBS_DECIMALS_MULTIPLE } from '../unstake/constants';

(window as any).Buffer = Buffer;

require('./StakingWidget.css');

export const StakingWidget: FC = () => {
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
    const [stakingOnChainData, setStakingOnChainData] = useState<StakingProgramData | { error: string }>();
    const [txnSignature, setTxnSignature] = useState<string>();

    useEffect(() => {
        if (!service) {
            setStakingOnChainData(undefined);
            return;
        }
        service
            .getStakingOnChainData()
            .then((payload) => {
                setStakingOnChainData(payload);
            })
            .catch((error) => {
                setStakingOnChainData({ error: error.message });
            });
    }, [service]);

    let Content: JSX.Element | undefined;
    if (!walletState.publicKey) {
        Content = <h1 className="default-content">Connect Your Wallet...</h1>;
    } else if (stakingOnChainData && 'error' in stakingOnChainData) {
        Content = (
            <div className="error-content">
                <h1>Something went wrong...</h1>
                {stakingOnChainData.error}
            </div>
        );
    } else {
        const amount = new BN(stakingOnChainData?.userTotal || '0').mul(MBS_DECIMALS_MULTIPLE);
        Content = (
            <>
                <h1>Staking Program Details</h1>
                <ul className="staking-data-cards">
                    {[
                        { t: 'User Total (MBS)', v: stakingOnChainData?.userTotal?.toString() },
                        { t: 'User Rewards (MBS)', v: stakingOnChainData?.userRewards?.toString() },
                        { t: 'Vault Total (MBS)', v: stakingOnChainData?.vaultTotal?.toString() },
                        ...Object.entries(stakingOnChainData?.accounts || {}).map(([t, addr]) => ({
                            t,
                            v: addr.toBase58(),
                        })),
                    ].map(({ t, v }) => (
                        <li key={t}>
                            <span style={{ fontWeight: 'bold' }}>{t}: </span>
                            <p style={{ color: 'green' }}>{v ? v : 'loading...'}</p>
                        </li>
                    ))}
                </ul>
                {txnSignature ? (
                    <>
                        <h2>Unstake succeeded! </h2>
                        <p>
                            See transaction record: <a href={`https://solscan.io/tx/${txnSignature}`}>{txnSignature}</a>
                        </p>
                    </>
                ) : (
                    <button
                        type="button"
                        disabled={false === amount.gt(new BN(0))}
                        onClick={() =>
                            service
                                ?.unStake(amount)
                                .then((sig) => setTxnSignature(sig))
                                .catch(console.error)
                        }
                        className="button"
                    >
                        Unstake
                    </button>
                )}
            </>
        );
    }

    return Content;
};
