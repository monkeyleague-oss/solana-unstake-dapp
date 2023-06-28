import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { FC, ReactNode, useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    const network = useMemo(
        () => atob('aHR0cHM6Ly9zb2xhbmEtbWFpbm5ldC5nLmFsY2hlbXkuY29tL3YyL2FDRVFIZ2NzSkZIbzFBbW9Nbmk1M0VyZnZHTDRkSW9O'),
        []
    );
    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );
    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default Context;
