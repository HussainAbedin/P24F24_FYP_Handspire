import cv2
import pickle
import numpy as np
import mediapipe as mp

from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room

# Load the trained model
model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

# Setup Flask and SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.3)

# Gesture labels
labels_dict = {
    0: 'Hello',
    1: 'How are you',
    2: 'Whats Up',
    3: 'You Good!!'
}

# Store connected room/user info
current_room = None
current_user = None


# Capture loop function
def capture_gesture():
    global current_room, current_user

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Camera not accessible.")
        return

    last_pred = ''
    print("Gesture recognition started...")

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

        if results.multi_hand_landmarks:
            x_, y_, data_aux = [], [], []

            for lm in results.multi_hand_landmarks[0].landmark:
                x_.append(lm.x)
                y_.append(lm.y)

            if len(x_) > 0 and len(y_) > 0:
                min_x, min_y = min(x_), min(y_)
                max_x, max_y = max(x_), max(y_)

                width = max_x - min_x
                height = max_y - min_y

                for x, y in zip(x_, y_):
                    norm_x = (x - min_x) / (width + 1e-6)
                    norm_y = (y - min_y) / (height + 1e-6)
                    data_aux.append(norm_x)
                    data_aux.append(norm_y)

                while len(data_aux) < 84:
                    data_aux.extend([0.0, 0.0])

                prediction = model.predict([np.asarray(data_aux)])
                predicted_character = labels_dict[int(prediction[0])]

                if predicted_character != last_pred:
                    print(f"Predicted: {predicted_character}")
                    last_pred = predicted_character

                    # Emit to all clients in the same room
                    socketio.emit('gesture', {
                        'user': current_user,
                        'gesture': predicted_character
                    }, room=current_room)

        # Optional: show frame
        # cv2.imshow('Gesture', frame)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    cap.release()
    cv2.destroyAllWindows()


# When someone joins a room
@socketio.on('join')
def handle_join(data):
    global current_room, current_user
    current_room = data['room']
    current_user = data['user']
    join_room(current_room)
    print(f"{current_user} joined room {current_room}")
    emit('joined', {'msg': f"{current_user} joined."}, room=current_room)


# When someone starts gesture detection
@socketio.on('start_gesture')
def handle_start(data):
    print("Starting gesture recognition...")
    socketio.start_background_task(capture_gesture)


# Basic route
@app.route('/')
def index():
    return "Gesture WebSocket Server Running"


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=4000)
