export type AccountHolderDashboard = {
    id: number;
    name: string;
    email: string;
}

export type AccountDetails = {
    id: number;
    accountHolder: string;
    accountNumber: number;
    balance: number;
}

export type Transaction = {
    id: number;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    accountOwnerId: string;
}

export type LoadingState = {
    accountHolder: boolean;
    accounts: boolean;
    transactions: boolean;
}

export type ErrorState = {
    accountHolder?: string;
    accounts?: string;
    transactions?: string
}