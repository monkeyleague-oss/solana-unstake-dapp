import { FC, useEffect } from 'react';
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

    useEffect(() => {
        const val = window.localStorage.getItem(LOCAL_STORAGE_RPC_URL_KEY);
        if (val) {
            onNetworkChange(val);
            setValue('url', val);
        }
    }, [setValue, onNetworkChange]);

    return (
        <form
            style={{ display: 'flex' }}
            onSubmit={handleSubmit(({ url }) => {
                onNetworkChange(url);
                window.localStorage.setItem(LOCAL_STORAGE_RPC_URL_KEY, url);
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
                        sx={{ width: 300 }}
                    />
                )}
            />
            <Button type="submit" variant="contained" color="primary">
                Save
            </Button>
        </form>
    );
};

export default NetworkSelector;
