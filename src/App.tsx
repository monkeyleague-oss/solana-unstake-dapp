import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Page } from './Page';
import { useForm } from 'react-hook-form';

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const LOCAL_STORAGE_RPC_URL_KEY = `__monkeyLeague_unstake_rpcUrl`;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    const [network, setNetwork] = useState<string>();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ url: string }>();

    useEffect(() => {
        const val = window.localStorage.getItem(LOCAL_STORAGE_RPC_URL_KEY);
        if (val) {
            setNetwork(val);
            setValue('url', val);
        }
    }, [setValue]);

    const endpoint = useMemo(() => network || clusterApiUrl(WalletAdapterNetwork.Mainnet), [network]);

    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    const NetworkSelector = () => (
        <form
            onSubmit={handleSubmit(({ url }) => {
                setNetwork(url);
                window.localStorage.setItem(LOCAL_STORAGE_RPC_URL_KEY, url);
            })}
        >
            <input
                type="text"
                {...register('url', {
                    required: 'URL is required',
                    validate: (value) => {
                        try {
                            new URL(value);
                            return true;
                        } catch {
                            return 'Invalid URL';
                        }
                    },
                })}
            />
            {errors.url && <p style={{ color: 'red' }}>{errors.url.message}</p>}
            <input type="submit" />
        </form>
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <NetworkSelector />
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const App: FC = () => {
    return (
        <Context>
            <div className="App">
                <Page />
            </div>
        </Context>
    );
};

export default App;
