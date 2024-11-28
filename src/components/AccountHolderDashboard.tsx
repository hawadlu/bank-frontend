import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {AccountHolderDashboard, ErrorState} from "../utility/types.ts";
import {Accounts} from "./Accounts.tsx";
import {checkAndGetToken} from "../utility/api.ts";
import {useQuery} from "@tanstack/react-query";

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
                setErrors({accountHolder: "Failed to fetch accountHolder"});
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

    if (errors.accountHolder) {
        return (
            <div className="text-red-500">
                {errors.accountHolder && <p>{errors.accountHolder}</p>}
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-300 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Account Holder Details</h2>
            {accountDetails && (
                <div className="mb-4">
                    <p>Name: {accountDetails.name}</p>
                </div>
            )}
            <Accounts/>
            <button onClick={() => navigate('/')}><p className="text-red-500">Logout</p></button>
        </div>
    );
};