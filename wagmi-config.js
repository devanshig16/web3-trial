import { configureChains, createConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains([bsc], [publicProvider()]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

export { chains };
