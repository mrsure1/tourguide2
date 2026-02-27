import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all messages involving the current user
    const { data: rawMessages, error } = await supabase
        .from('messages')
        .select(`
            id,
            content,
            created_at,
            is_read,
            sender_id:profiles!messages_sender_id_fkey (id, full_name, avatar_url, role),
            receiver_id:profiles!messages_receiver_id_fkey (id, full_name, avatar_url, role)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error);
    }

    const messages = rawMessages || [];

    // Grouping logic
    const conversationsMap = new Map();

    messages.forEach((msg: any) => {
        // Find the other user
        const isSender = msg.sender_id.id === user.id;
        const otherUser = isSender ? msg.receiver_id : msg.sender_id;

        if (!conversationsMap.has(otherUser.id)) {
            conversationsMap.set(otherUser.id, {
                contact: otherUser,
                messages: []
            });
        }

        conversationsMap.get(otherUser.id).messages.push({
            id: msg.id,
            text: msg.content,
            isMe: isSender,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: msg.created_at
        });
    });

    // Convert map to array and sort by latest message
    const conversations = Array.from(conversationsMap.values()).sort((a, b) => {
        const lastA = a.messages[a.messages.length - 1];
        const lastB = b.messages[b.messages.length - 1];
        return new Date(lastB.createdAt).getTime() - new Date(lastA.createdAt).getTime();
    });

    // Provide a list of profiles for 'new chat' search if needed
    // Not heavily optimized, but ok for MVP
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url, role');

    return (
        <MessagesClient
            clientId={user.id}
            conversations={conversations}
            profiles={profiles || []}
        />
    );
}
