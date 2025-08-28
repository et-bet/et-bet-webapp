'use client';
import { useState } from 'react';

// Define Wallet type
interface Wallet {
	currency: string;
	balance: number;
}

export function Wallet({
	wallet,
	onDeposit,
}: {
	wallet: Wallet;
	onDeposit: (amt: number) => void;
}) {
	const [amt, setAmt] = useState(10);

	return (
		<div className="max-w-xl">
			<div className="bg-white p-4 rounded-2xl border">
				<div className="text-xs text-gray-500">
					Wallet Balance
				</div>
				<div className="text-3xl font-bold">
					{wallet.currency} {wallet.balance.toFixed(2)}
				</div>

				<div className="mt-4 flex gap-2">
					<input
						type="number"
						className="border rounded p-2"
						value={amt}
						onChange={(e) =>
							setAmt(Number(e.target.value))
						}
					/>
					<button
						className="px-3 py-2 rounded bg-green-500 text-white"
						onClick={() => onDeposit(amt)}
					>
						Deposit (Stripe)
					</button>
				</div>

				<div className="mt-3 text-sm text-gray-500">
					{`Tip: This is a mock deposit button. In production, you'd open Stripe Checkout or Coinbase Commerce.`}
				</div>
			</div>

			<div className="mt-4 text-sm text-gray-600">
				Transactions will appear here in the real app (deposits,
				withdrawals, bets).
			</div>
		</div>
	);
}
