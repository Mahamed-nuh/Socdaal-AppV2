import { useContext } from "react";
import { TicketContext } from "@/context/TicketContext";


export const useTickets = () => {
    const TicketContext = useContext(TicketContext);
    if (!TicketContext) {
        throw new Error("useTickets must be used within a TicketProvider");
    }
    return TicketContext;
}