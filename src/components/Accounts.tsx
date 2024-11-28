import {AccountDetails, ErrorState} from "../utility/types.ts";
import {useState, ChangeEvent, useMemo} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {checkAndGetToken} from "../utility/api.ts";
import {useNavigate, useParams} from "react-router-dom";
import {Account} from "./Account.tsx";
import axios from "axios";

export const Accounts = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [fromAccountId, setFromAccountId] = useState<number>();
    const [toAccountId, setToAccountId] = useState<number>();
    const [amount, setAmount] = useState<number>();
    const [errors, setErrors] = useState<ErrorState>({});

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
                setErrors({accounts: "Error fetching accounts..."});
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json() as Promise<AccountDetails[]>;
        },
        retry: false
    });

    // Sort accounts using useMemo to avoid unnecessary re-sorting
    const sortedAccounts = useMemo(() => {
        if (!accounts) return [];
        return [...accounts].sort((a, b) => a.accountNumber - b.accountNumber);
    }, [accounts]);

    const handleCreateTransaction = async (accountOwnerId: string) => {
        // Reset any transaction errors
        setErrors({})

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
        } catch {
            setErrors({transactions: "Error creating transaction..."});
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

    if (errors.accountHolder) {
        return (
            <div className="text-red-500">
                {errors.accountHolder && <p>{errors.accountHolder}</p>}
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Accounts</h3>
            <div className="space-y-2">
                {sortedAccounts.map(account => (
                    <Account key={account.id} account={account} />
                ))}
            </div>
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Make a transaction</h3>
                <div className="max-w-6xl mx-auto p-6">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 space-y-6 lg:space-y-0">
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium text-gray-700">From</p>
                            <select
                                onChange={handleFromAccountChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select account</option>
                                {sortedAccounts.map(account => (
                                    <option key={account.accountNumber} value={account.accountNumber}>
                                        {account.accountNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium text-gray-700">To</p>
                            <select
                                onChange={handleToAccountChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select account</option>
                                {sortedAccounts.map(account => (
                                    <option key={account.accountNumber} value={account.accountNumber}>
                                        {account.accountNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium text-gray-700">Amount</p>
                            <input
                                type="number"
                                onChange={handleAmountChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <button
                            onClick={() => handleCreateTransaction(id!)}
                            className="w-full lg:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </div>
                {errors.transactions && (
                    <div className="text-red-500">
                        {errors.transactions && <p>{errors.transactions}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};