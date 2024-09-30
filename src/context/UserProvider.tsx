import { createContext, useState } from "react"

type UserContextValue = {
    title: string;
    setTitle: (title: any) => void
}
export const UserContext = createContext<UserContextValue>({
    title: "",
    setTitle: () => { }
})

export const UserProvider: React.FC = ({ children }) => {
    const [title, setTitle] = useState<string>("Keep clean your wallet by Burning unwanted/scam NFTs in few clicks");

    return (
        <UserContext.Provider
            value={{ title, setTitle }}>
            {children}
        </UserContext.Provider>
    )
}