import {AccountDetails, Transaction} from "./types.ts";
import {useQuery} from "@tanstack/react-query";
import {checkAndGetToken} from "./api.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import Modal from "./Modal.tsx";
import { RenderTransaction } from "./RenderTransaction.tsx";

export const Account = ({account}: {account: AccountDetails}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showingTransaction, setShowingTransaction] = useState<boolean>(false);

    return (
        <div key={account.id} className="border p-2 rounded hover:bg-gray-400" onClick={()=> {
            console.log('To show transaction')
            setShowingTransaction(true)
        }}>
            <p>Account Number: {account.accountNumber}</p>
            <p>Balance: ${account.balance.toFixed(2)}</p>
            <p>Press to show transactions</p>
            <Modal isOpen={showingTransaction} onClose={() => {
                console.log("Modal close");
                setShowingTransaction(false)}}
                   title={'Transactions'}>
                <RenderTransaction accountId={account.id} />
            </Modal>
        </div>
    )
}