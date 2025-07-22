from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# --- Initialize Flask ---
app = Flask(__name__)
CORS(app)

# --- Configure Gemini API ---
genai.configure(api_key="AIzaSyChCZ49zr5qTDcEQXHu5nKtqONZWpiYty0")
model = genai.GenerativeModel("models/gemini-1.5-flash")

# --- Help responses ---
help_topics = {
    "start detection": "Go to the **Hand Detection** page and click on **'Start Detection'** to begin recognizing hand signs.",
    "asl alphabet": "Visit the **ASL Alphabet** page. Click any letter A–Z to see its corresponding hand gesture.",
    "gesture converter": "The **Gesture Converter** is on the ASL Alphabet page. Click any letter to see its gesture image.",
    "detect sentence": "To detect full sentences, go to the **Hand Detection** page and switch to **'Sentence Mode'**.",
    "video chat": "Use the **Video Chat** page to communicate with another user using real-time hand gestures.",
    "start a call": "To start a call, go to the **Video Chat** page and click **'Start Call'**. Both users must have their cameras on.",
    "make a call": "Head to the **Video Chat** section and click **'Start Call'** to begin your conversation.",
    "how to call": "Navigate to the **Video Chat** page, then click on **'Start Call'** to begin the session.",
    "call": "You can start a call from the **Video Chat** page. Make sure your camera is on and permissions are granted.",
    "about us": "Check the **About Us** page to learn about our team and why we built Handspire.",
    "vision": "Visit the **Vision** page to explore our goals for making communication more inclusive.",
    "our mission": "You can find our goals and mission on the **Vision** page.",
    "feedback": "We’d love your feedback! Please email us at **support@handspire.com**.",
    "contact": "Have questions? Reach us anytime at **support@handspire.com**.",
    "how to use": "Start on the **ASL Alphabet** or **Hand Detection** pages to begin using Handspire.",
    "speak gesture": "Handspire converts detected gestures into **text and speech** for better accessibility.",
    "sign not detected": "Make sure your hand is within the frame, the lighting is good, and your background is clear.",
    "no output": "If you’re not seeing results, keep your hand steady and ensure it’s fully visible to the camera.",
    "camera not working": "Please allow camera permissions in your browser settings and refresh the page.",
    "voice not working": "Check your speaker and ensure your browser is allowed to play sound.",
    "what is handspire": "Handspire is an **AI-powered sign language translator** that turns gestures into text and speech for better communication.",
    "how to vedio call": "Go to navbar press start a call button and start your conversation.",
    "goodbye": "Goodbye! 👋 Thanks for using Handspire.",
    "okay bye": "Take care! See you again soon. 👋",
    "bye": "See you later! 👋 Thanks for visiting Handspire."
}

# --- Welcome message ---
welcome_message = "👋 Welcome to Handspire! Ask me anything about how to use the site — detection, gestures, video chat, and more."

# --- Improved keyword matching ---
def match_topic(message):
    msg = message.lower()
    # Try exact or partial keyword match (longest matches first)
    sorted_keywords = sorted(help_topics.keys(), key=len, reverse=True)
    for keyword in sorted_keywords:
        if keyword in msg or msg in keyword:
            return keyword
    return None

# --- Gemini fallback ---
def get_gemini_response(user_input):
    try:
        prompt = (
            "You are a helpful assistant for a website called 'Handspire'.\n"
            "Handspire is a sign language platform with these main pages:\n"
            "- Home\n"
            "- ASL Alphabet (with A–Z gesture converter)\n"
            "- Hand Detection (recognizes hand gestures and full sentences)\n"
            "- Video Chat (real-time gesture-based communication)\n"
            "- About Us and Vision\n\n"
            "Help the user clearly and simply based on what they're asking.\n"
            f"User: {user_input}\n"
        )
        result = model.generate_content(prompt)
        return result.text.strip()
    except Exception as e:
        print("Gemini error:", str(e))
        return "Sorry, I didn’t catch that. Try asking about gestures, detection, video chat, or our mission."

# --- Chat route ---
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").strip()
    if not user_message:
        return jsonify({"response": "Please enter a message to begin."})

    msg_lower = user_message.lower()
    if msg_lower in ["hi", "hello", "hey"]:
        return jsonify({"response": welcome_message})

    # Check keyword match
    matched = match_topic(user_message)
    if matched:
        return jsonify({"response": help_topics[matched]})

    # Otherwise, use Gemini AI
    gemini_reply = get_gemini_response(user_message)
    return jsonify({"response": gemini_reply})

# --- Run the Flask server ---
if __name__ == '__main__':
    app.run(debug=True, port=5002)
