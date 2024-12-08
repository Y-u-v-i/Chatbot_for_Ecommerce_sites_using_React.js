import { useEffect, useState } from 'react';
import image from './image1.png'; 
import { inputIntents, model } from '../training data'; 

export default function Chatbot({ setActive }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedIntent, setSelectedIntent] = useState('');

    useEffect(() => {
        setTimeout(() => processInput("hello"), 1000);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages((messages) => [{ author: 'user', text: input }, ...messages]);
        setTimeout(() => processInput(input), 1000);
        setInput('');
    };

    function normalise(input) {
        return input.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, ' ').toLowerCase();
    }

    const generatedResponse = (intent) => {
        console.log("Generated response for intent:", intent); 
        if (model.responses && model.responses[intent]) {
            const responses = model.responses[intent];
            const randomIndex = Math.floor(Math.random() * responses.length);
            return responses[randomIndex].answer;
        }
        return "I'm sorry, I don't understand. Can you rephrase the question?";
    };

    const proceedResponse = () => {
             switch (selectedIntent) {
            case "orderTracking":
                return "Your order has been delivered.";
            case "shippingInformation":
                return "Your order has been shipped. It will be delivered in 3 days.";
            case "cancelOrder":
                return "Your order has been cancelled successfully.";
            case "feedbackSubmission":
                return "Your feedback has been submitted successfully.";
            default:
                return "I can't understand your response.";
        }
    };

    const queriesAnswered = () => {
        setTimeout(() => {
            setMessages((messages) => [
                { author: "bot", text: "Say hi to restart your chat" },
                { author: "bot", text: "Feel free to ping me if you have any other queries" },
                { author: "bot", text: "I hope your query had been resolved" },
                ...messages,
            ]);
            setTimeout(() => setActive(false), 5000); 
        }, 2000);
    };

    const processInput = (input) => {
        const normalised = normalise(input).toLowerCase();
        if (selectedIntent) {
            const response = proceedResponse();
            setMessages(messages => [{ author: "bot", text: response }, ...messages]);
            setSelectedIntent(""); 
            if (inputIntents.includes(selectedIntent)) {
                queriesAnswered(); 
            }
            return;
        }
        const intent = matchIntent(normalised);
        if (intent) {
            const response = generatedResponse(intent);
            setMessages(messages => [{ author: "bot", text: response }, ...messages]);
            if (inputIntents.includes(intent)) {
                setSelectedIntent(intent);
            }
            if (intent === 'bye') {
                queriesAnswered(); 
            }
        } else {
            setMessages(messages => [{ author: "bot", text: "I'm sorry, I didn't understand that." }, ...messages]);
        }
    };

    const arrayIncludeString = (arr, string) => {
        return arr.every(word => string.includes(word));
    };

    const matchIntent = (input) => {
        if (model.intents) {
            for (const [intent, patterns] of Object.entries(model.intents)) {
                for (const pattern of patterns) {
                    const array = pattern.split(" ");
                    if (arrayIncludeString(array, input)) {
                        return intent;
                    }
                }
            }
        }
        return null;
    };

    return (
        <div className='chatbot'>
            <div className='chatbot-header'>
                <img src={image} alt="Chatbot" className='chatbot-image' />
                Chatbot
            </div>
            <div className='messages'>
                {messages.map((message, index) => (
                    <div key={message.text + index} className={`message ${message.author}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
