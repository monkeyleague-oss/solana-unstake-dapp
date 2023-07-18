import { FC, useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Buffer } from 'buffer';
import { StakingProgramData, createUnStakeService } from '../unstake/service';
import BN from 'bn.js';
import { MBS_DECIMALS_MULTIPLE } from '../unstake/constants';

(window as any).Buffer = Buffer;

require('./StakingWidget.css');

const bg = 'https://app.monkeyleague.test/build/_assets/primary-button-bg-desktop-CDCVH4XJ.png';
export const pinkPropsStyle: React.CSSProperties = {
    backgroundImage: `url(${bg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
    width: '33rem',
    marginTop: '2rem',
    position: 'relative',
    fontStyle: 'normal',
    fontSize: '2.25rem',
    fontWeight: 600,
    bottom: '0.5rem',
    fontFamily: 'Bebas Neue',
    height: '4.5rem',
    boxShadow: '0 2px 6px 0 #110f2c, inset 0 1px 0 0 #e83c8d, inset 0 -1px 0 0 rgba(0, 0, 0, 0.5)',
};

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
        Content = (
            <>
                <h1 className="font-promt text-3xl md:text-6xl text-cream uppercase mr-auto md:mx-auto tracking-widest">
                    Staking
                </h1>
                <span className="text-[#c5c4ff] text-sm text-left md:text-center">
                    Connect your wallet in order to see your staking data and to unstake
                </span>
            </>
        );
    } else if (stakingOnChainData && 'error' in stakingOnChainData) {
        Content = (
            <div className="error-content font-semibold">
                <h1 className="default-content font-promt text-3xl md:text-6xl text-cream uppercase mr-auto md:mx-auto py-3">
                    Something went wrong...
                </h1>
                {stakingOnChainData.error ? 'There is an error with the RPC. Please contact support' : ''}
            </div>
        );
    } else {
        const unstakeAmount = stakingOnChainData?.userPoolSharesAmount || new BN(0);

        const splitAmountWithCommas = (amount: string | undefined) => {
            const balanceSplit = amount?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return balanceSplit?.split('.')[0];
        };

        Content = (
            <>
                <h1 className="font-promt text-3xl md:text-6xl text-cream uppercase mr-auto md:mx-auto tracking-widest">
                    Staking Program Details
                </h1>
                <ul className=" py-10 staking-data-cards uppercase text-[#d2ceff] font-extrabold text-center">
                    {[
                        { t: 'User Locked (MBS)', v: splitAmountWithCommas(stakingOnChainData?.userTotal?.toString()) },
                        {
                            t: 'User Rewards (MBS)',
                            v: splitAmountWithCommas(stakingOnChainData?.userRewards?.toString()),
                        },
                        {
                            t: 'Total program locked (MBS)',
                            v: splitAmountWithCommas(stakingOnChainData?.vaultTotal.toString()),
                        },
                    ].map(({ t, v }) => (
                        <li key={t} className="bg-[#454190]">
                            <span className="font-bold min-h-[3rem] block">{t}: </span>
                            <p className="text-white">{v ? v : 'loading...'}</p>
                        </li>
                    ))}
                </ul>
                {txnSignature ? (
                    <>
                        <h2 className="default-content font-promt text-3xl md:text-6xl text-cream uppercase mr-auto md:mx-auto">
                            Unstake succeeded!{' '}
                        </h2>
                        <p>
                            See transaction record: <a href={`https://solscan.io/tx/${txnSignature}`}>{txnSignature}</a>
                        </p>
                    </>
                ) : (
                    <button
                        onClick={() =>
                            service
                                ?.unStake(unstakeAmount)
                                .then((sig) => setTxnSignature(sig))
                                .catch(console.error)
                        }
                        disabled={false === unstakeAmount.gt(new BN(0))}
                        className="flex flex-col text-5xl font-action font-bold italic shadow-highlight cursor-pointer bg-[#e83c8d] select-none w-[18rem] h-[5rem] text-center text-sunny uppercase"
                        style={{
                            ...pinkPropsStyle,
                            cursor: false === unstakeAmount.gt(new BN(0)) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <p className="m-auto leading-[2rem] pb-1 text-[#ffcf00]">Unstake</p>
                    </button>
                )}
            </>
        );
    }

    return Content;
};
