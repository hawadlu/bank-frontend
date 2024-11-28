import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {AccountDetails, AccountHolderDashboard, ErrorState, LoadingState, Transaction} from "./types.ts";
import {Accounts} from "./Accounts.tsx";
import {checkAndGetToken} from "./api.ts";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";

export const AccountHolderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState<ErrorState>({});

    const {
        data: accountDetails,
    } = useQuery({
        queryKey: ['accountHolder'],
        queryFn: async () => {
            const token = checkAndGetToken(navigate);
            if (!token) return;

            const url = `http://localhost:8080/accountHolder/${id}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle the readable stream
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No readable stream available');

            let result = '';
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                // Convert the Uint8Array to text
                result += new TextDecoder().decode(value);
            }

            console.log(result)
            return JSON.parse(result) as AccountHolderDashboard;
        },
        retry: false
    });

    const handleAuthError = (error: any) => {
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    if (errors.accountHolder || errors.accounts) {
        return (
            <div className="text-red-500">
                {errors.accountHolder && <p>{errors.accountHolder}</p>}
                {errors.accounts && <p>{errors.accounts}</p>}
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Account Holder Details</h2>
            {accountDetails && (
                <div className="mb-4">
                    <p>Name: {accountDetails.name}</p>
                </div>
            )}
            <Accounts />
        </div>
    );
};