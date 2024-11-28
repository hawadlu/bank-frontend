import {AccountDetails} from "../utility/types.ts";
import {useState} from "react";
import Modal from "./Modal.tsx";
import { TransactionList } from "./TransactionList.tsx";

/**
 * Display an individual account
 */
export const Account = ({account}: {account: AccountDetails}) => {
    const [showingTransaction, setShowingTransaction] = useState<boolean>(false);

    return (
        <div key={account.id} className="border p-2 rounded hover:bg-gray-400" onClick={()=> {
            setShowingTransaction(true)
        }}>
            <p>Account Number: {account.accountNumber}</p>
            <p>Balance: ${account.balance.toFixed(2)}</p>
            <p>Press to show transactions</p>
            <Modal isOpen={showingTransaction} onClose={() => {
                console.log("Modal close");
                setShowingTransaction(false)}}
                   title={'Transactions'}>
                <TransactionList accountId={account.id} />
            </Modal>
        </div>
    )
}