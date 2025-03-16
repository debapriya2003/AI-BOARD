"use client";

import { JSX, useState } from "react";
import axios from "axios";
import { Tldraw } from "tldraw";
import ReactMarkdown from "react-markdown";
import "tldraw/tldraw.css";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Card, CardContent, TextField, Button, Box } from "@mui/material";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DrawingChatbot(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const { data } = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-tiny",
          messages: [
            {
              role: "system",
              content:
                "You are an expert in mathematics, advanced calculus, data structures and algorithms (DSA), machine learning, and programming. Your task is to provide detailed, step-by-step explanations, well-formatted solutions  and clear, optimized code examples where needed. You should ensure accuracy, clarity, and completeness in your responses, helping users understand complex problems effectively"
            },
            { role: "user", content: input }
          ],
        },
        {
          headers: {
            Authorization: "Bearer ",
            "Content-Type": "application/json",
          },
        }
      );
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.choices[0].message.content }
      ]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Error fetching response." }]);
    }
  };

  return (
    <MathJaxContext>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} height="100vh" overflow="hidden">
        <Box flex={{ xs: 5, md: 3 }} borderRight={{ md: "1px solid #ddd" }} minHeight="50vh" overflow="auto">
          <Tldraw />
        </Box>
        <Box flex={{ xs: 5, md: 2 }} p={2} display="flex" flexDirection="column" overflow="hidden">
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              whiteSpace: "nowrap"
            }}
          >
            Mathematics Chatbot
          </h2>
          <Box
            flex={1}
            border="1px solid #ddd"
            p={2}
            mb={2}
            borderRadius={2}
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              whiteSpace: "pre-wrap"
            }}
          >
            {messages.map((msg, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent>
                  <strong>{msg.role === "user" ? "You: " : "Bot: "}</strong>
                  <MathJax>
                    <ReactMarkdown
                      components={{
                        code({ node, className, children, ...props }) {
                          return (
                            <code
                              style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word"
                              }}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        table({ node, ...props }) {
                          return (
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginBottom: "1rem"
                              }}
                              {...props}
                            />
                          );
                        },
                        th({ node, ...props }) {
                          return (
                            <th
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                backgroundColor: "#f4f4f4"
                              }}
                              {...props}
                            />
                          );
                        },
                        td({ node, ...props }) {
                          return (
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px"
                              }}
                              {...props}
                            />
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </MathJax>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box display="flex" flexDirection="column" gap={2}>
          <TextField
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a mathematics question..."
                fullWidth
                multiline
                maxRows={4}
                InputProps={{
                  style: { color: 'white' },
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
            <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </MathJaxContext>
  );
}




//fT6zRtXbsNQRbW1sWc0Uawv8kK1dwy0N
