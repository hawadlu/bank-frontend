import {AccountDetails, Transaction} from "./types.ts";
import React, {useState, ChangeEvent} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {checkAndGetToken} from "./api.ts";
import {useNavigate, useParams} from "react-router-dom";
import {Account} from "./Account.tsx";
import axios from "axios";

export const Accounts = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [fromAccountId, setFromAccountId] = useState<number>();
    const [toAccountId, setToAccountId] = useState<number>();
    const [amount, setAmount] = useState<number>();

    const queryClient = useQueryClient();

    const {
        data: accounts,
    } = useQuery({
        queryKey: ['accounts'],
        queryFn: async () => {
            const token = checkAndGetToken(navigate);
            if (!token) return;

            const url = `http://localhost:8080/account/${id}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Simply use response.json() instead of manual stream reading
            return response.json() as Promise<AccountDetails[]>;
        },
        retry: false
    });

    const handleCreateTransaction = async (accountOwnerId: string) => {
        const token = checkAndGetToken(navigate);
        if (!token || !fromAccountId || !toAccountId || !amount) return;

        const transactionData = {
            fromAccountId: fromAccountId,
            toAccountId: toAccountId,
            amount: amount,
            accountOwnerId: accountOwnerId
        };

        console.log(transactionData);

        try {
            const response = await axios({
                url: 'http://localhost:8080/transaction',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                data: transactionData
            });

            console.log('Got response:', response);
            await queryClient.resetQueries();
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    const handleFromAccountChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFromAccountId(Number(e.target.value));
    };

    const handleToAccountChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setToAccountId(Number(e.target.value));
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Accounts</h3>
            <div className="space-y-2">
                {accounts && accounts.map(account => (
                    <Account key={account.id} account={account} />
                ))}
            </div>
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Make a transaction</h3>
                <div className="space-y-4">
                    <div>
                        <p>From</p>
                        <select
                            onChange={handleFromAccountChange}
                            className="mt-1 block w-full"
                        >
                            <option value="">Select account</option>
                            {accounts && accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p>To</p>
                        <select
                            onChange={handleToAccountChange}
                            className="mt-1 block w-full"
                        >
                            <option value="">Select account</option>
                            {accounts && accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p>Amount</p>
                        <input
                            type="number"
                            onChange={handleAmountChange}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <button
                        onClick={() => handleCreateTransaction(id!)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};