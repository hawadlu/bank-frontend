import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

type AccountHolderDetails = {
    id: number
    name: string;
    email: string;
}

type AccountDetails = {
    id: number;
    accountHolder: string;
    accountNumber: number;
    balance: number
}

type Transaction = {
    id: number;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
}

export const AccountHolderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [accountHolder, setAccountHolder] = useState<AccountHolderDetails | undefined>(undefined);
    const [holderAccounts, setHolderAccounts] = useState<AccountDetails[] | undefined>(undefined);
    const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);

    const fetchAccountHolder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token exists
            navigate('/');
            return;
        }

        try {
            const response = await axios.get(`/accountHolder/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                setAccountHolder(response.data);
            }
        } catch (error) {
            console.error('Error fetching account holder:', error);
            // If we get a 401 or 403, redirect to login
            if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };
    const fetchAccounts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token exists
            navigate('/');
            return;
        }

        try {
            const response = await axios.get(`/account/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                setHolderAccounts(response.data);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            // If we get a 401 or 403, redirect to login
            if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };
    // const fetchTransactions = async () => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         // Redirect to login if no token exists
    //         navigate('/');
    //         return;
    //     }
    //
    //     try {
    //         const response = await axios.get(`/transaction/${id}/1`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //
    //         if (response.data) {
    //             setTransactions(response.data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching account transactions:', error);
    //         // If we get a 401 or 403, redirect to login
    //         if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
    //             localStorage.removeItem('token');
    //             navigate('/');
    //         }
    //     }
    // };

    useEffect(() => {
        fetchAccountHolder();
        fetchAccounts();
        // fetchTransactions()
    }, [fetchAccountHolder, fetchAccounts, id]); // Remove fetchAccountHolder from dependencies to avoid infinite loop

    return accountHolder ? (
        <div>
            <h2>Account Holder Details</h2>
            <p>{JSON.stringify(accountHolder)}</p>

            <p>Accounts</p>
            {holderAccounts?.map(acc => JSON.stringify(acc))}
            <p>Transaction</p>
            {transactions?.map(acc => JSON.stringify(acc))}
        </div>
    ) : (
        <p>Loading...</p>
    );
};