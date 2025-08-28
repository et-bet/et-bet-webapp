'use client';
import React, { useState } from 'react';
import { Wallet } from '../_components/wallet';

const Page = () => {
	const [wallet, setWallet] = useState({ balance: 120.5, currency: 'USD' });
	return (
		<div className=" h-screen px-2 flex items-center justify-center">
			<Wallet
				wallet={wallet}
				onDeposit={(amt: number) =>
					setWallet((w) => ({
						...w,
						balance: Number(
							(w.balance + amt).toFixed(2)
						),
					}))
				}
			/>
		</div>
	);
};

export default Page;
