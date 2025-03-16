export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    setselectedChatType: (selectedChatType) => set({ selectedChatType }),
    setselectedChatData: (selectedChatData) => set({ selectedChatData }),
    setselectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    addMessage:(message)=>{
        const selectedChatMessages= get().selectedChatMessages;
        const selectedChatType= get().selectedChatType;
        set({
            selectedChatMessages:[...selectedChatMessages,{
                ...message,
                reciever:message.reciever,
                sender:message.sender
            }]
        })
    },
    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [] }),
});