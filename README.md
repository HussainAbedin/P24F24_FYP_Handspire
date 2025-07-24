🤟 Handspire - Bridging Silence with Technology
Final Year Project | Department of Computer Science
Team Lead: Hussain Abedin
Team Members: Haider Ali,Mustafa Zohair
Supervisor: Ms.Tehniat Mirza
Session: 2021-2025

Project Overview
Handspire is an intelligent sign language translation system developed to bridge the communication gap between the hearing and speech-impaired community and the rest of the world. It primarily supports American Sign Language (ASL) and offers real-time translation of both alphabet gestures and conversational gestures.

Built with a modern and responsive Angular frontend, Handspire features custom-trained models, real-time video processing, and interactive chatbot support — making communication seamless, inclusive, and intelligent.

🎯 Objectives
To develop a system capable of translating ASL gestures (alphabets + common phrases).

To provide a real-time gesture recognition feature during video calls.

To enable natural interaction using a chatbot explaining project modules, dataset, and technical components.

To build a custom dataset for gesture recognition, ensuring high accuracy and adaptability.

To enhance inclusivity in digital communication through assistive AI technology.

🔧 Technologies Used
Domain	Tools & Frameworks
Frontend	Angular, TypeScript, Bootstrap
Backend	Python, Flask/FastAPI
Machine Learning	TensorFlow, Keras, OpenCV, MediaPipe
Dataset	Custom-built ASL Gesture Dataset (Alphabet + Conversation)
Realtime Communication	WebRTC
Bot Interaction	Dialogflow / Custom NLP Chatbot
Image Annotation	LabelImg, CVAT

✨ Key Features
🧠 Custom Trained Model
Built using our own dataset of ASL gestures.

Includes both alphabet-based signs and common conversational phrases.

📸 Real-Time Gesture Recognition
Recognizes hand gestures via webcam using OpenCV + MediaPipe.

Supports live translation during video calls using WebRTC.

💬 Interactive Chatbot
Ask anything about:

The dataset

Model architecture

Project goals

Feature demonstrations

Available 24/7 within the platform.

📞 Video Call with Gesture Translation
Initiate a peer-to-peer video call.

One user can sign using ASL; the system detects and translates gestures on the receiver’s screen in real-time.

🧪 Dataset Overview
Over X,000 images collected manually.

Multiple lighting conditions, backgrounds, and hand orientations included.

Labeled using tools like LabelImg and CVAT.

Trained on Convolutional Neural Network (CNN) architectures.

For conversational signs, LSTM was used to capture motion-based sequences.

🔍 Project Modules
mathematica
Copy
Edit
Level 1: Data & Computer Vision
- Image annotation
- Dataset training
- Hand detection (MediaPipe, OpenCV)

Level 2: Sign Language Translation
- Alphabet gestures (Static)
- Conversational gestures (Dynamic via LSTM)

Level 3: Real-Time Communication
- Webcam streaming
- WebRTC-based video calling
- On-stream hand translation

Level 4: Chatbot Interaction
- NLP/FAQ chatbot
- Project information, guidance, and tech stack

Frontend: User Interface
- Built in Angular with responsive design

Screenshots / Demo:
