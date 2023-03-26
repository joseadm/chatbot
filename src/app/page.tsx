'use client'

import React, { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState<any>('')

  const sendMessage = async () => {
    if (!inputValue) {
      return
    }

    // add user message to message history
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: inputValue, author: 'user' },
    ])

    // send user message to ChatGPT API
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: inputValue }],
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      )

      // add ChatGPT response to message history
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: response.data.choices[0].message.content,
          author: 'chatbot',
        },
      ])
    } catch (error) {
      console.error(error)
    }

    // clear input field
    setInputValue('')
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Container className="border rounded shadow-sm mt-5 mb-5">
          <Row className="align-items-center py-3 px-2">
            <Col xs={2} className="text-center">
              <p>Persona</p>
            </Col>
            <Col xs={10}>
              <h5 className="m-0">Chatbot</h5>
            </Col>
          </Row>
          <div className="bg-white p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  message.author === 'user' ? 'text-end' : ''
                }`}
              >
                <div
                  className={`rounded p-2 ${
                    message.author === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-light'
                  }`}
                >
                  {message.message}
                </div>
              </div>
            ))}
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Type your message here"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button variant="primary" onClick={sendMessage}>
                Record
              </Button>
              <Button variant="primary" onClick={sendMessage}>
                Send
              </Button>
            </InputGroup>
          </div>
        </Container>
      </div>
    </main>
  )
}
