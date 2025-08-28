'use client';
import React, { useEffect, useState } from 'react';
import { Header } from './_components/header';
import { AdminPanel } from './_components/admin/admin-panel';
import { Dashboard } from './_components/dashboard';
import { Wallet } from './_components/wallet';
import { NavItem } from './_components/nav-item';
import { Bet, TelegramUser, TelegramWindow } from '@/types';

export default function Home() {
	const [activeRoute, setActiveRoute] = useState<
		'dashboard' | 'create' | 'wallet' | 'admin'
	>('dashboard');
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [bets, setBets] = useState<Bet[]>([]);
	const [wallet, setWallet] = useState({ balance: 120.5, currency: 'USD' });
	const [form, setForm] = useState({
		eventName: '',
		side: 'home',
		amount: 20,
		expiryMinutes: 60,
	});
	const [telegramUser, setTelegramUser] = useState<TelegramUser>({
		id: '',
		name: '',
	});

	useEffect(() => {
		// mock initial open bets
		setBets([
			{
				id: 'b1',
				event: 'Man City vs Chelsea',
				creator: 'alice',
				side: 'home',
				amount: 20,
				status: 'open',
				createdAt: Date.now() - 1000 * 60 * 5,
			},
			{
				id: 'b2',
				event: 'Lakers vs Celtics',
				creator: 'bob',
				side: 'away',
				amount: 50,
				status: 'open',
				createdAt: Date.now() - 1000 * 60 * 10,
			},
		]);

		// Attempt to read Telegram WebApp init data if running inside Telegram
		if (
			typeof window !== 'undefined' &&
			(window as TelegramWindow).Telegram &&
			(window as TelegramWindow)?.Telegram?.WebApp
		) {
			const tg = (window as TelegramWindow)?.Telegram?.WebApp;
			setTelegramUser({
				name: tg?.initDataUnsafe?.user?.first_name || '',
				id: tg?.initDataUnsafe?.user?.id.toString() || '',
			});
			// optionally set theme or mainButton etc
			try {
				tg?.MainButton.setText('Open Wallet');
				tg?.MainButton.show();
			} catch {
				/* ignore in preview */
			}
		}
	}, []);

	function openCreate() {
		setShowCreateModal(true);
		setActiveRoute('create');
	}

	function submitCreate() {
		// Mimic API call
		const newBet = {
			id: 'b' + (bets.length + 1),
			event: form.eventName || 'Custom Match',
			creator: telegramUser.name || 'you',
			side: form.side,
			amount: Number(form.amount),
			status: 'open',
			createdAt: Date.now(),
			expiryMinutes: Number(form.expiryMinutes),
		};
		setBets((s) => [newBet, ...s]);
		setShowCreateModal(false);
		setForm({
			eventName: '',
			side: 'home',
			amount: 20,
			expiryMinutes: 60,
		});
		// lock funds locally for preview
		setWallet((w) => ({
			...w,
			balance: Number((w.balance - newBet.amount).toFixed(2)),
		}));
	}

	function joinBet(betId: string) {
		setBets((prev) =>
			prev.map((b) =>
				b.id === betId ? { ...b, status: 'matched' } : b
			)
		);
		// in real app: call backend, lock funds, notify creators via Telegram bot
	}

	function renderLeftNav() {
		return (
			<div className="w-64 bg-white/80 backdrop-blur p-4 h-full border-r">
				<div className="mb-6">
					<div className="text-lg font-semibold">
						ZenP2P (Preview)
					</div>
					<div className="text-xs text-gray-500">
						Telegram WebApp UI
					</div>
				</div>

				<nav className="space-y-1">
					<NavItem
						label="Dashboard"
						active={activeRoute === 'dashboard'}
						onClick={() => {
							setActiveRoute('dashboard');
							setShowCreateModal(false);
						}}
					/>
					<NavItem
						label="Create Bet"
						active={activeRoute === 'create'}
						onClick={openCreate}
					/>
					<NavItem
						label="Wallet"
						active={activeRoute === 'wallet'}
						onClick={() => {
							setActiveRoute('wallet');
							setShowCreateModal(false);
						}}
					/>
					<NavItem
						label="Admin"
						active={activeRoute === 'admin'}
						onClick={() => {
							setActiveRoute('admin');
							setShowCreateModal(false);
						}}
					/>
				</nav>

				<div className="mt-6 pt-4 border-t">
					<div className="text-xs text-gray-500">
						Balance
					</div>
					<div className="text-2xl font-bold">
						{wallet.currency}{' '}
						{wallet.balance.toFixed(2)}
					</div>
					<button
						className="mt-3 px-3 py-2 rounded bg-indigo-600 text-white text-sm"
						onClick={() => setActiveRoute('wallet')}
					>
						Deposit / Withdraw
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 flex">
			{renderLeftNav()}

			<main className="flex-1 p-6">
				<Header
					telegramUser={telegramUser}
					onCreate={() => openCreate()}
				/>

				<div className="mt-6">
					{activeRoute === 'dashboard' && (
						<Dashboard
							bets={bets}
							onJoin={joinBet}
							onOpenCreate={openCreate}
						/>
					)}

					{activeRoute === 'wallet' && (
						<Wallet
							wallet={wallet}
							onDeposit={(amt: number) =>
								setWallet((w) => ({
									...w,
									balance: Number(
										(
											w.balance +
											amt
										).toFixed(2)
									),
								}))
							}
						/>
					)}

					{activeRoute === 'admin' && (
						<AdminPanel
							bets={bets}
							onSetResult={(id, result) =>
								alert(
									'Admin set result ' +
										result +
										' for ' +
										id
								)
							}
						/>
					)}
				</div>
			</main>

			{/* Create Bet Modal (simple) */}
			{showCreateModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setShowCreateModal(false)}
					/>
					<div className="relative bg-white rounded-2xl w-[420px] p-6 shadow-2xl">
						<h3 className="text-lg font-semibold mb-3">
							Create Bet
						</h3>
						<label className="text-xs text-gray-500">
							Event name
						</label>
						<input
							className="w-full border rounded p-2 mt-1 mb-3"
							value={form.eventName}
							onChange={(e) =>
								setForm({
									...form,
									eventName: e.target.value,
								})
							}
							placeholder="Man City vs Chelsea"
						/>

						<div className="flex gap-3 mb-3">
							<div>
								<label className="text-xs text-gray-500">
									Side
								</label>
								<select
									className="border rounded p-2 w-40"
									value={form.side}
									onChange={(e) =>
										setForm({
											...form,
											side: e.target
												.value,
										})
									}
								>
									<option value="home">
										Home
									</option>
									<option value="away">
										Away
									</option>
								</select>
							</div>

							<div>
								<label className="text-xs text-gray-500">
									Amount
								</label>
								<input
									type="number"
									className="border rounded p-2 w-28"
									value={form.amount}
									onChange={(e) =>
										setForm({
											...form,
											amount: Number(
												e.target
													.value
											),
										})
									}
								/>
							</div>

							<div>
								<label className="text-xs text-gray-500">
									Expiry (mins)
								</label>
								<input
									type="number"
									className="border rounded p-2 w-28"
									value={form.expiryMinutes}
									onChange={(e) =>
										setForm({
											...form,
											expiryMinutes:
												Number(
													e
														.target
														.value
												),
										})
									}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2">
							<button
								className="px-4 py-2 rounded border"
								onClick={() =>
									setShowCreateModal(false)
								}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 rounded bg-indigo-600 text-white"
								onClick={submitCreate}
							>
								Create Bet
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
