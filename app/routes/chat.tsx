import * as pdfjsLib from 'pdfjs-dist';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, User, Atom, File } from 'lucide-react';
import AnimatedBackground from '~/components/UI/AnimatedBackground';
import GlassContainer from '~/components/UI/GlassContainer';
import { motion } from 'framer-motion';

const Chat = () => {
	const [isFocused, setIsFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [fileContent, setFileContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// async function extractFileData(file: File): Promise<string | null> {
	// 	try {
	// 			const reader = new FileReader();

	// 			return new Promise<string | null>((resolve, reject) => { // Use a Promise
	// 					reader.onload = async (event) => {
	// 							const fileContent = event.target?.result as string;

	// 							if (file.name.endsWith('.pdf') || file.name.endsWith('.PDF')) {
	// 									const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
	// 									try {
	// 											const pdf = await pdfjsLib.getDocument(typedarray).promise;
	// 											let pdfText = "";
	// 											for (let i = 1; i <= pdf.numPages; i++) {
	// 													const page = await pdf.getPage(i);
	// 													const text = await page.getTextContent();
	// 													pdfText += text.items.map(item => item.str).join(" ");
	// 											}
	// 											console.log("Extracted PDF Text:", pdfText);
	// 											resolve(pdfText); // Resolve with PDF text
	// 									} catch (pdfError) {
	// 											console.error("Error processing PDF:", pdfError);
	// 											reject("Error processing PDF"); // Reject on PDF error
	// 									}
	// 							} else if (file.name.endsWith('.txt') || file.name.endsWith('.text')) {
	// 								console.log("Extracted Text File Content:", fileContent);
	// 								resolve(fileContent); // Resolve with text content
	// 							} else {
	// 								console.log("Unsupported file type:", file.name);
	// 								resolve("Unsupported file type");
	// 							}
	// 					};

	// 					reader.onerror = (error) => {
	// 							console.error("File reading error:", error);
	// 							reject("Error reading file"); // Reject on file read error
	// 					};

	// 					if (file.name.endsWith('.pdf')) {
	// 							reader.readAsArrayBuffer(file);
	// 					} else {
	// 							reader.readAsText(file);
	// 					}
	// 			});

	// 	} catch (error) {
	// 			console.error("General error in extractFileData:", error);
	// 			return Promise.resolve("Error processing file"); // Return error string
	// 	}
	// }
	
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSearchQuery(file.name); 
			
			// const extractedText = await extractFileData(file);
			// if (extractedText) { // Check if extraction was successful
			// 	setFileContent(extractedText);
			// 	console.log("Extracted Data:", extractedText);
			// } else {
			// 		setFileContent("Error processing file"); // Handle error
			// }
		}
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom()
	}, [messages]);


	const constructPrompt = (query: string) => {
		return `You are a helpful AI assistant that helps the user who is a startup founder with business related tasks like market research and pitch deck creation and analysis. Respond to the user's query in under 50 words, if there is a document attatched assume the info in it to be something related to business and respond as if u have know the info in the document. DO NOT under any circumstances include the name of the document in your response or make it look like you are'nt aware of the contents of attatched file: "${query}"`;
	};

	const makeApiCall = async (query: string) => {
		try {
			const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": `Bearer fw_3ZiSSnWzBTmLi3NfDCMDbZAG`
				},
				body: JSON.stringify({
					model: "accounts/fireworks/models/deepseek-v3",
					max_tokens: 4096,
					top_p: 1,
					top_k: 40,
					presence_penalty: 0,
					frequency_penalty: 0,
					temperature: 0.7,
					messages: [
						...messages,
						{
							role: "user",
							content: constructPrompt(query)
						}
					]
				})
			});

			const data = await response.json();
			const textResponse = data.choices[0].message.content;

			return textResponse;
		} catch (error) {
			console.error('API Error:', error);
			throw error;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			setIsLoading(true);

			// Add user message to the messages array
			setMessages(prevMessages => [...prevMessages, { role: 'user', content: searchQuery }]);

			try {
				const result = await makeApiCall(searchQuery);

				// Add AI response to the messages array
				setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: result }]);
			} catch (error) {
				console.error("Error fetching AI response:", error);
				// Optionally add an error message to the chat
				setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
			} finally {
				setIsLoading(false);
				setSearchQuery(''); // Clear the input after sending
			}
		}
	};
	return (
		<AnimatedBackground className="min-h-screen flex items-center justify-center">
			<GlassContainer className="w-[90vw] h-[90vh] overflow-auto">
				<div className="p-6">
					<h1 className="text-4xl font-semibold mb-2 text-center font-subheading text-grey">
						UltraFounder.AI Chat
					</h1>
					<h3 className='text-lg font-subheading mb-8 text-center text-grey/50'>Analyse and Research on your Pitch Deck and Business Plan</h3>
					{/* Chat content will go here */}
					<div className="flex flex-col h-full">
						{/* Message Display Area */}
						<div className="flex-grow overflow-y-auto">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`
										flex
										items-start
										mb-4
										${message.role === 'user' ? 'justify-start' : 'justify-end'}
									`}
								>
									{message.role === 'user' && <User className="w-6 h-6 text-grey mr-2 mt-1" />}
									<motion.div
										className={`
											max-w-[60%]
											p-4
											rounded-xl
											${
												message.role === 'user'
													? 'bg-white/10 border border-white/20 text-grey font-subheading'
													: 'bg-gradient-to-r from-portage to-portage/70 border border-portage/50 text-white font-subheading'
											}
										`}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
									>
										{message.content}
									</motion.div>
									{message.role === 'assistant' && <Atom className="w-6 h-6 text-portage ml-2 mt-1" />}
								</div>
							))}
							{isLoading && (
								<div className="flex justify-end mb-4">
									<div className="max-w-[60%] p-4 rounded-xl bg-gradient-to-r from-portage to-portage/70 border border-portage/50 text-white flex items-center">
										<Loader className="animate-spin mr-2" /> Typing...
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Area */}
						<form
							onSubmit={handleSubmit}
							className={`
								relative
								mt-4
								backdrop-blur-xl
								bg-white/35
								rounded-xl
								border
								border-white/40
								transition-all
								duration-500
								before:absolute
								before:inset-0
								before:backdrop-blur-xl
								before:bg-white/5
								before:rounded-xl
								before:-z-10
								${isFocused ? 'shadow-[0_0_25px_rgba(255,255,255,0.6)] border-white/60' : 'hover:border-white/50 hover:bg-white/20'}
							`}
						>
							<div className="flex items-center px-6 py-4">
								
								<input
									type="text"
									placeholder="Type your message..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="
										w-full
										ml-4
										border-none
										bg-transparent
										font-subheading
										text-grey
										placeholder-grey/50
										focus:outline-none
										font-light
										text-lg
									"
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
								/>
								{/* File Input */}
								<label htmlFor="file-upload" className="cursor-pointer ml-2 relative group">
									<File className="w-6 h-6 text-white" />
									{/* Helper Container for File Upload */}
									<div className="absolute hidden group-hover:block bg-white/90 text-grey text-xs px-4 py-2 rounded-md shadow-lg -top-12 left-1/2 -translate-x-1/2 transition-all duration-300">
										upload file
									</div>
								</label>
								<input
									type="file"
									id="file-upload"
									className="hidden"
									onChange={handleFileChange}
								/>
								{/* End File Input */}
								<button
									type="submit"
									className="
										ml-4
										p-1.5
										rounded-full
										bg-white/10
										border
										border-white/20
										transition-all
										duration-300
										hover:bg-white/20
										hover:border-white/30
										hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
										group
										disabled:opacity-50
										disabled:cursor-not-allowed
										relative
									"
									disabled={!searchQuery.trim() || isLoading}
								>
									<Send
										className={`
											w-5
											h-5
											text-white
											group-hover:text-grey/70
											transition-colors
											duration-300
											${isLoading ? 'animate-pulse' : ''}
										`}
									/>
									{/* Helper Container for Send Button */}
									<div className="absolute hidden group-hover:block bg-white/90 text-grey text-xs px-4 py-2 rounded-md shadow-lg -top-12 left-1/2 -translate-x-1/2 transition-all duration-300">
										send
									</div>
								</button>
							</div>
						</form>
					</div>
				</div>
		</GlassContainer>
</AnimatedBackground>
	);
};

export default Chat;
