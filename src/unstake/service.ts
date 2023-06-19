import { AnchorProvider, BN, IdlAccounts, Program } from '@project-serum/anchor';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { IDL, MonkeyStaking } from './idl';
import {
    PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    MBS,
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    MBS_DECIMALS_MULTIPLE,
} from './constants';
import { AccountLayout, RawAccount } from '@solana/spl-token';

type MonkeyIdlAccounts = IdlAccounts<MonkeyStaking>;

type StakingMBSDataAccounts = {
    vault: RawAccount;
    stakingAccount: MonkeyIdlAccounts['StakingAccount'];
    userAccount?: MonkeyIdlAccounts['UserStakingAccount'];
};

const findPDA = (seeds: Array<Buffer | Uint8Array>, programId: PublicKey): [PublicKey, number] =>
    PublicKey.findProgramAddressSync(seeds, programId);

function getProvider(
    connection: Connection,
    anchorWallet: Partial<AnchorProvider['wallet']> & { publicKey: PublicKey }
): AnchorProvider {
    return new AnchorProvider(
        connection,
        {
            signTransaction() {
                throw new Error('signTransaction not provided by UnStakeService consumer');
            },
            signAllTransactions() {
                throw new Error('signAllTransactions not provided by UnStakeService consumer');
            },
            ...anchorWallet,
        },
        {}
    );
}

function getProgram(
    connection: Connection,
    anchorWallet: Partial<AnchorProvider['wallet']> & { publicKey: PublicKey }
): Program<MonkeyStaking> {
    const provider = getProvider(connection, anchorWallet);
    return new Program(IDL, PROGRAM_ID, provider);
}

function getStakingAccountAddress(): [PublicKey, number] {
    return findPDA([Buffer.from('staking', 'utf8')], PROGRAM_ID);
}

function findAssociatedTokenAddress(walletAddress: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), MBS.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    );
}

function getVaultAccountAddress(): [PublicKey, number] {
    return findPDA([MBS.toBuffer()], PROGRAM_ID);
}

function getUserStakingAccountAddress(
    anchorWallet: Partial<AnchorProvider['wallet']> & { publicKey: PublicKey }
): [PublicKey, number] {
    return findPDA([anchorWallet.publicKey.toBuffer()], PROGRAM_ID);
}

export type StakingProgramData = {
    vaultTotal: BN;
    userTotal: BN;
    userRewards: BN;
    accounts: {
        program: PublicKey;
        staking: PublicKey;
        userStaking: PublicKey;
        vault: PublicKey;
    };
};

export function createUnStakeService(
    connection: Connection,
    anchorWallet: Partial<AnchorProvider['wallet']> & { publicKey: PublicKey }
) {
    const program = getProgram(connection, anchorWallet);
    const [stakingAddress, stakingBump] = getStakingAccountAddress();
    const [userStakingAddress, userStakingBump] = getUserStakingAccountAddress(anchorWallet);
    const [vaultAddress] = getVaultAccountAddress();
    const [tokenTo] = findAssociatedTokenAddress(anchorWallet.publicKey);

    function parseStakingAccount(accountInfo: AccountInfo<Buffer>): MonkeyIdlAccounts['StakingAccount'] {
        return (
            (program.account as any).stakingAccount as (typeof program.account)['StakingAccount']
        ).coder.accounts.decode('StakingAccount', accountInfo.data);
    }

    function parseUserStakingAccount(accountInfo: AccountInfo<Buffer>): MonkeyIdlAccounts['UserStakingAccount'] {
        return (
            (program.account as any).userStakingAccount as (typeof program.account)['UserStakingAccount']
        ).coder.accounts.decode('UserStakingAccount', accountInfo.data);
    }

    async function unStake(amount: BN) {
        return await program.methods
            .unstake(stakingBump, userStakingBump, amount)
            .accounts({
                tokenMint: MBS,
                tokenTo,
                tokenVault: vaultAddress,
                stakingAccount: stakingAddress,
                userStakingAccount: userStakingAddress,
            })
            .rpc();
    }

    async function getStakingOnChainData(): Promise<StakingProgramData> {
        const addresses: PublicKey[] = [vaultAddress, stakingAddress, userStakingAddress];
        const { value } = await connection.getMultipleAccountsInfoAndContext(addresses);
        const [vaultData, stakingAccountData, userAccountData] = value;
        if (!vaultData) throw new Error('Missing vault account');
        if (!stakingAccountData) throw new Error('Missing stakingAccount');
        const accounts: StakingMBSDataAccounts = {
            vault: AccountLayout.decode(vaultData.data),
            stakingAccount: parseStakingAccount(stakingAccountData),
            userAccount: userAccountData ? parseUserStakingAccount(userAccountData) : undefined,
        };
        const vaultTotal = new BN(accounts.vault.amount.toString()).div(MBS_DECIMALS_MULTIPLE);
        const userTotal = accounts.userAccount?.amount.div(MBS_DECIMALS_MULTIPLE) || new BN('0');
        const userRewards = new BN(accounts.vault.amount.toString())
            .mul(new BN(accounts.userAccount?.poolSharesAmount as any))
            .div(new BN(accounts.stakingAccount.totalPoolShares as any))
            .sub(new BN(accounts.userAccount?.amount as any))
            .div(new BN(MBS_DECIMALS_MULTIPLE));
        return {
            vaultTotal,
            userTotal,
            userRewards,
            accounts: {
                program: PROGRAM_ID,
                staking: stakingAddress,
                userStaking: userStakingAddress,
                vault: vaultAddress,
            },
        };
    }

    return {
        unStake,
        getStakingOnChainData,
    };
}
