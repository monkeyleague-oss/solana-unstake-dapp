import { FC, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

require('@solana/wallet-adapter-react-ui/styles.css');

const LOCAL_STORAGE_RPC_URL_KEY = `__monkeyLeague_unstake_rpcUrl`;

const NetworkSelector: FC<{ onNetworkChange: (network: string) => void }> = ({ onNetworkChange }) => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<{ url: string }>();
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const val = window.localStorage.getItem(LOCAL_STORAGE_RPC_URL_KEY);
        if (val) {
            onNetworkChange(val);
            setValue('url', val);
            setIsSubmitted(true);
        }
    }, [setValue, onNetworkChange]);

    return (
        <form
            onSubmit={handleSubmit(({ url }) => {
                onNetworkChange(url);
                window.localStorage.setItem(LOCAL_STORAGE_RPC_URL_KEY, url);
                setIsSubmitted(true);
            })}
        >
            <Controller
                name="url"
                control={control}
                defaultValue=""
                rules={{
                    required: 'URL is required',
                    validate: (value) => {
                        try {
                            new URL(value);
                            return true;
                        } catch {
                            return 'Invalid Solana RPC URL';
                        }
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        type="text"
                        error={Boolean(errors.url)}
                        helperText={errors?.url?.message}
                        label="solana rpc url"
                        variant="outlined"
                        fullWidth={true}
                    />
                )}
            />
        </form>
    );
};

export default NetworkSelector;
