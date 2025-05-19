import { useContext } from "react";
import { TicketContext } from "@/context/TicketContext";

// Rename the hook to useTickets to avoid naming conflict with the context
export function useTickets() {
    const context = useContext(TicketContext);


    if (!context) {
        throw new Error("useTickets must be used within a TicketProvider");
    }

    return context;
}