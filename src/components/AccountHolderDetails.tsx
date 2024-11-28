import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    const [accountHolder, setAccountHolder] = useState<AccountHolderDetails | undefined>(undefined);
    const [holderAccounts, setHolderAccounts] = useState<AccountDetails[] | undefined>(undefined);
    const [transactions, setTransactions] = useState<Transaction[] | undefined>(undefined);

    useEffect(() => {
        const fetchAccountHolder = async () => {
            try {
                return await axios.get(`/accountHolder/${id}`);
            } catch (error) {
                console.error('Error fetching account holder:', error);
            }
        };

        const fetchAccounts = async () => {
            console.log('Fetching accounts:', id);
            try {
                return await axios.get(`/account/${id}`);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        const fetchTransactions = async () => {
            console.log('Fetching transaction:', id);
            try {
                return await axios.get(`/transaction/${id}`);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };


        fetchAccountHolder().then(response => {
            if (!response) return
            setAccountHolder(response.data)
        });

        fetchAccounts().then(response => {
            if (!response) return
            setHolderAccounts(response.data)
        });

        fetchTransactions().then(response => {
            if (!response) return
            console.log('Transaction data: ' + JSON.stringify(response))
            setTransactions(response.data)
        });
    }, [id]);

    return accountHolder ? (
        <div>
            <h2>Account Holder Details</h2>
            <p>Name: {accountHolder.name}</p>
            <p>Email: {accountHolder.email}</p>

            {
                holderAccounts?.map(account => {
                    return JSON.stringify(account)
                })
            }

            {
                transactions?.map(account => {
                    return JSON.stringify(account)
                })
            }
        </div>
    ) : (
        <p>Loading...</p>
    );
};
