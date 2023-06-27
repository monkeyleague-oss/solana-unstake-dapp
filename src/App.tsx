import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';
import { StakingWidget } from './components/StakingWidget';
import SolanaContext from './components/SolanaContext';
import monkeyLogo from "./components/assets/navbar-logo.png"
import { ZendeskWidget } from './zendesk';
import { handleZendeskPopup } from './zendesk-popup';
declare global {
    interface Window {
        zE: ZendeskWidget;
    }
}
const App: FC = () => {
    return (
        <SolanaContext network={undefined}>
            <div className="grid-container">
                <header className="header flex flex-row">
                    <a className='relative md:right-[93%] justify-center' href='https://www.monkeyleague.io' target='_blank' rel="noreferrer">
                        <img src={monkeyLogo} className='w-24 h-24' alt="monkey-league-logo" />
                    </a>
                </header>
                <main className="main">
                    <StakingWidget />
                    <div className='mt-6 px-16'>
                        <WalletMultiButton />
                    </div>
                </main>
                <footer className="footer bg-[#2a2a69] flex flex-col shadow-highlight md:h-fit h-[14rem]">
                    <div className="grid grid-cols-1 md:flex md:justify-center gap-1 font-sans items-baseline h-16">
                        <div className="flex flex-col text-lilac text-2xl leading-6 px-2 gap-6 md:gap-0 ">
                            <p className="text-sm mx-auto py-3">© {new Date().getFullYear()}. All Rights Reserved MonkeyLeague®.</p>
                            <div className="mx-auto grid grid-cols-2  md:grid-rows-1 tex md:grid-flow-col text-center gap-8 md:gap-11 text-xs text-white uppercase font-normal">
                                <a href="https://www.monkeyleague.io/legal/terms.html" target="_blank" rel="noreferrer" title="TERMS OF USe">TERMS OF USe</a>
                                <a href="https://www.monkeyleague.io/legal/disclaimers.html" target="_blank" rel="noreferrer" title="Disclaimers">Disclaimers</a>
                                <a href="https://www.monkeyleague.io/legal/privacy.html" target="_blank" rel="noreferrer" title="PRIVACY POLICY">PRIVACY POLICY</a>
                                <a href="https://www.monkeyleague.io/legal/aml.html" target="_blank" rel="noreferrer" title="AML">AML</a>
                                <a href="https://app.monkeyleague.io/staking/terms" rel="noreferrer" target="_blank" title="STAKING">STAKING</a>
                                <button title="SUPPORT" onClick={handleZendeskPopup}>SUPPORT</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </SolanaContext>
    );
};

export default App;
