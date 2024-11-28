import React, { useEffect, useState } from 'react';
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

    // const handleTransaction = async () => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         navigate('/');
    //         return;
    //     }
    //
    //     try {
    //         const response = await axios.post('/transaction', {
    //             fromAccountId: 1,
    //             toAccountId: 2,
    //             amount: 10
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error creating transaction:', error);
    //         if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
    //             localStorage.removeItem('token');
    //             navigate('/');
    //         }
    //         throw error;
    //     }
    // }

    useEffect(() => {
        fetchAccountHolder();
    }, [fetchAccountHolder, id]); // Remove fetchAccountHolder from dependencies to avoid infinite loop

    return accountHolder ? (
        <div>
            <h2>Account Holder Details</h2>
            <p>{JSON.stringify(accountHolder)}</p>

            <p>Transactions</p>
            <p>stuff</p>
        </div>
    ) : (
        <p>Loading...</p>
    );
};