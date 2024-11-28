import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ErrorState, LoadingState, Transaction} from "../utility/types.ts";
import axios from "axios";
import {checkAndGetToken} from "../utility/api.ts";

export const TransactionList = ({accountId}: {accountId: number}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);
    const [loading, setLoading] = useState<LoadingState>({ accountHolder: true, accounts: true , transactions: true });
    const [errors, setErrors] = useState<ErrorState>({});

    const handleAuthError = (error: any) => {
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = checkAndGetToken(navigate);
            if (!token) return;

            try {
                const response = await axios.get(`http://localhost:8080/transaction/${id}/${accountId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                console.log(response.data)
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
    }, [id, navigate]); // Dependencies array includes id and navigate

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
        <div className="p-4">
            {(transactions && transactions.length > 0) ? transactions.map((transaction: Transaction) => (
                <div>
                    <p>From Account: {transaction.fromAccountId}</p>
                    <p>To Account: {transaction.toAccountId}</p>
                    <p>Amount: ${transaction.amount}</p>
                </div>
            )) : <p>No transactions found.</p>}
        </div>
    );
}
