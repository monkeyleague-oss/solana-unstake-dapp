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
        Content = <h2 className="default-content">Connect Your Wallet...</h2>;
    } else if (stakingOnChainData && 'error' in stakingOnChainData) {
        Content = (
            <div className="error-content">
                <h2>Something went wrong...</h2>
                {stakingOnChainData.error}
            </div>
        );
    } else {
        const amount = new BN(stakingOnChainData?.userTotal || '0').mul(MBS_DECIMALS_MULTIPLE);
        Content = (
            <>
                <h2>Staking Program Details</h2>
                <ul className="staking-data-cards">
                    {[
                        { t: 'Vault Total', v: stakingOnChainData?.vaultTotal?.toString() },
                        { t: 'User Total', v: stakingOnChainData?.userTotal?.toString() },
                        { t: 'User Rewards', v: stakingOnChainData?.userRewards?.toString() },
                    ].map(({ t, v }) => (
                        <li key={t}>
                            <span style={{ fontWeight: 'bold' }}>{t}: </span>
                            <h3 style={{ color: 'green' }}>{v ? `${v} MBS` : 'loading...'}</h3>
                        </li>
                    ))}
                </ul>
                <Button
                    type="button"
                    disabled={false === amount.gt(new BN(0))}
                    variant="contained"
                    color="primary"
                    onClick={() => service?.unStake(amount)}
                    size="large"
                >
                    Unstake
                </Button>
            </>
        );
    }

    return Content;
};
