import { FC, useEffect, useMemo, useState } from 'react';
import { createUnStakeService } from '../unstake/service';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';

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
    const [stakingOnChainData, setStakingOnChainData] = useState<
        | {
              vaultTotal: string;
              userTotal: string;
              userRewards: string;
          }
        | { error: string }
    >();

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
        Content = (
            <>
                <h2>Staking Program Details</h2>
                <ul className="staking-data-cards">
                    {[
                        { t: 'Vault Total', v: stakingOnChainData?.vaultTotal },
                        { t: 'User Total', v: stakingOnChainData?.userTotal },
                        { t: 'User Rewards', v: stakingOnChainData?.userRewards },
                    ].map(({ t, v }) => (
                        <li>
                            <span style={{ fontWeight: 'bold' }}>{t}: </span>
                            <h3 style={{ color: 'green' }}>{v ? `${v} MBS` : 'loading...'}</h3>
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    return Content;
};
