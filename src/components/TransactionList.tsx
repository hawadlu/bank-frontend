import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState, useCallback, useMemo} from "react";
import {ErrorState, LoadingState, Transaction} from "../utility/types.ts";
import axios from "axios";
import {checkAndGetToken} from "../utility/api.ts";

export const TransactionList = ({accountId}: {accountId: number}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);
    const [loading, setLoading] = useState<LoadingState>({ accountHolder: true, accounts: true , transactions: true });
    const [errors, setErrors] = useState<ErrorState>({});

    const handleAuthError = useCallback((error: any) => {
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
            localStorage.removeItem('token');
            navigate('/');
        }
    }, [navigate]);

    const usableTransactions: Transaction[] = useMemo(() => {
        if (!transactions) return []

        return transactions.filter((transaction: Transaction) => transaction.fromAccountId == accountId || transaction.toAccountId == accountId);
    }, [accountId, transactions])

    console.log(transactions);
    console.log(usableTransactions);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = checkAndGetToken(navigate);
            if (!token) return;

            try {
                const response = await axios.get(`http://localhost:8080/transaction/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                handleAuthError(error);
                setErrors(prev => ({ ...prev, transactions: 'Failed to load transactions' }));
            } finally {
                setLoading(prev => ({ ...prev, transactions: false }));
            }
        };

        fetchTransactions();
    }, [id, handleAuthError]); // Removed accountId from dependencies as it's not used in the effect

    if (loading.transactions) {
        return <div>Loading...</div>;
    }

    if (errors.transactions) {
        return (
            <div className="text-red-500">
                {errors.transactions && <p>{errors.transactions}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            {usableTransactions && usableTransactions.map((transaction) => (
                <div
                    key={transaction.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                >
                    <div className="p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">From Account</span>
                                <span className="font-medium">{transaction.fromAccountId}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">To Account</span>
                                <span className="font-medium">{transaction.toAccountId}</span>
                            </div>

                            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                                <span className="text-sm text-gray-500">Amount</span>
                                {transaction.toAccountId == accountId ? (
                                    <span className="text-lg font-semibold text-green-600">
                                        ${transaction.amount.toLocaleString()}
                                    </span>
                                ) : (
                                    <span className="text-lg font-semibold text-red-600">
                                        -${transaction.amount.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}