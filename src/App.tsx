import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useState } from 'react';
import { StakingWidget } from './components/StakingWidget';
import NetworkSelector from './components/NetworkSelector';
import SolanaContext from './components/SolanaContext';

const App: FC = () => {
    const [network, setNetwork] = useState<string>();
    return (
        <div className="grid-container">
            <header className="header">
                <NetworkSelector onNetworkChange={setNetwork} />
            </header>
            <main className="main">
                <SolanaContext network={network}>
                    <WalletMultiButton />
                    <StakingWidget />
                </SolanaContext>
            </main>
            <footer className="footer">
                <div>
                    <a className="link-item" href="https://github.com/monkeyleague-oss/solana-unstake-dapp">
                        Github
                    </a>
                    <a className="link-item" href="/solana-unstake-dapp/legal.html">
                        Terms Of Use
                    </a>
                </div>
                <p>© 2023. All Rights Reserved MonkeyLeague®.</p>
            </footer>
        </div>
    );
};

export default App;
