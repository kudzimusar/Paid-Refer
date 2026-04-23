import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import type { Conversation } from "@/types";

export default function Chat() {
  const params = useParams();
  const conversationId = params.id || params.conversationId;
  const { user } = useAuthContext();

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations'],
  });

  const selectedConversation = conversationId 
    ? conversations.find((conv: Conversation) => conv.id === conversationId)
    : null;

  if (conversationId && selectedConversation) {
    return <ChatInterface conversation={selectedConversation} />;
  }

  return (
    <div className="min-h-screen pt-safe-top pb-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-full hover:bg-neutral-100">
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
          </Link>
          <h1 className="text-lg font-semibold text-neutral-900">Messages</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {conversations.length > 0 ? (
          <div className="space-y-3">
            {conversations.map((conversation: Conversation) => {
              const otherParticipant = conversation.customerId === user?.id 
                ? `Agent ${conversation.agentId.slice(-4)}`
                : `Customer ${conversation.customerId.slice(-4)}`;

              return (
                <Link key={conversation.id} href={`/chat/${conversation.id}`}>
                  <Card className="hover:bg-neutral-50 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                          <span className="text-neutral-600 font-medium">
                            {otherParticipant.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-neutral-900">
                              {otherParticipant}
                            </h4>
                            <span className="text-xs text-neutral-500">
                              {conversation.lastMessageAt 
                                ? new Date(conversation.lastMessageAt).toLocaleDateString()
                                : 'Recent'
                              }
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">
                            {conversation.isActive ? 'Active conversation' : 'Conversation ended'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No conversations yet</h3>
              <p className="text-neutral-600 mb-4">
                {user?.role === 'customer' 
                  ? "Start by submitting a request to connect with agents"
                  : "Accept leads to start conversations with customers"
                }
              </p>
              <Link href={user?.role === 'customer' ? '/search?action=new-request' : '/dashboard/leads'}>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium">
                  {user?.role === 'customer' ? 'Find Apartment' : 'View Leads'}
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
