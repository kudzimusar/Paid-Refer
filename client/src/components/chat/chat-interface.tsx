import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, Plus, Send, Image } from "lucide-react";
import { Link } from "wouter";
import type { Conversation, Message } from "@/types";

interface ChatInterfaceProps {
  conversation: Conversation;
}

export function ChatInterface({ conversation }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/conversation', conversation.id, 'messages'],
  });

  const { sendMessage } = useWebSocket((message) => {
    if (message.type === 'new_message' && message.data.conversationId === conversation.id) {
      queryClient.invalidateQueries({
        queryKey: ['/api/conversation', conversation.id, 'messages'],
      });
    }
    
    if (message.type === 'user_typing' && message.conversationId === conversation.id) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string; messageType?: string }) => {
      const response = await apiRequest('POST', `/api/conversation/${conversation.id}/message`, data);
      return response.json();
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({
        queryKey: ['/api/conversation', conversation.id, 'messages'],
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Join conversation room
    sendMessage({
      type: 'join_conversation',
      conversationId: conversation.id,
    });
  }, [conversation.id, sendMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessageMutation.mutate({
        content: messageText.trim(),
        messageType: 'text',
      });
    }
  };

  const handleTyping = () => {
    sendMessage({
      type: 'typing',
      conversationId: conversation.id,
      userId: user?.id,
    });
  };

  const otherParticipant = conversation.customerId === user?.id 
    ? `Agent ${conversation.agentId.slice(-4)}`
    : `Customer ${conversation.customerId.slice(-4)}`;

  const otherParticipantId = conversation.customerId === user?.id 
    ? conversation.agentId 
    : conversation.customerId;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-safe-top pb-20 bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center space-x-4">
          <Link href="/chat">
            <button className="p-2 -ml-2 rounded-full hover:bg-neutral-100">
              <ArrowLeft className="w-5 h-5 text-neutral-700" />
            </button>
          </Link>
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-600 font-medium text-sm">
                {otherParticipant.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">{otherParticipant}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-secondary/10 text-secondary text-xs">
                  Online
                </Badge>
                {isTyping && (
                  <span className="text-xs text-neutral-500">Typing...</span>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-neutral-100">
            <Phone className="w-5 h-5 text-neutral-700" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {messages.map((message: Message) => {
          const isOwn = message.senderId === user?.id;
          const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start space-x-3 max-w-xs">
                {!isOwn && (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-neutral-600 font-medium text-xs">
                      {otherParticipant.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className={`
                  p-3 rounded-xl ${
                    isOwn 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-sm'
                  }
                `}>
                  {message.messageType === 'property_share' && message.metadata ? (
                    <div className="space-y-2">
                      <div className="w-full h-24 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{message.metadata.title}</h4>
                        <p className="text-xs opacity-80">{message.metadata.description}</p>
                        <Button 
                          size="sm" 
                          className="w-full mt-2 bg-white text-primary hover:bg-neutral-50"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  <span className={`text-xs mt-1 block ${
                    isOwn ? 'text-white/70' : 'text-neutral-500'
                  }`}>
                    {messageTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-600 font-medium text-xs">
                {otherParticipant.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl rounded-bl-sm p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 bg-white border-t border-neutral-100">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button 
            type="button"
            className="p-2 text-neutral-500 hover:text-neutral-700"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <Input
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="w-full py-3 px-4 bg-neutral-100 border-none rounded-full focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="p-3 bg-primary text-white rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
