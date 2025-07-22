import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SignalingService } from '../signaling.service';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-vedio-chat',
  templateUrl: './vedio-chat.component.html',
  styleUrls: ['./vedio-chat.component.css']
})
export class VedioChatComponent implements OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  roomId: string = '';
  isCaller: boolean = false;
  connectionStatus: string = 'Disconnected';
  messages: { sender: string, text: string, userId: string, timestamp: number }[] = [];
  ringtone = new Audio('assets/Tune/Call-Ringtone.mp3');
  
  // Add unique user ID
  private userId: string = crypto.randomUUID();
  private userRole: string = ''; 

  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;
  private receivedCandidates = new Set<string>();
  private unsubscribeFunctions: (() => void)[] = [];
  private gestureFrames: string[] = [];
  private gestureIntervalSub?: Subscription;

  constructor(
    private signalingService: SignalingService,
    private http: HttpClient
  ) {}

  async initLocalStream(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      this.localVideo.nativeElement.srcObject = this.localStream;
      console.log('Local stream initialized');
      this.startGestureDetection();
    } catch (err) {
      console.error('Failed to access camera/mic:', err);
      alert('Please allow camera and microphone access to use video chat');
    }
  }

  startGestureDetection(): void {
    this.gestureIntervalSub = interval(300).subscribe(() => {
      this.captureFrameAndPredict();
    });
  }
async captureFrameAndPredict(): Promise<void> {
    try {
      if (!this.localVideo?.nativeElement) return;

      const video = this.localVideo.nativeElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg');
      this.gestureFrames.push(base64);

      // When enough frames (e.g., 20), send to API
      if (this.gestureFrames.length >= 20) {
        const framesToSend = [...this.gestureFrames];
        this.gestureFrames = []; // reset

        const res: any = await this.http.post('http://127.0.0.1:5000/predict_sequence', {
          frames: framesToSend
        }).toPromise();

        if (res?.prediction && res.prediction !== 'Low Confidence') {
          console.log('✋ Gesture detected:', res.prediction);
     const message = {
  sender: this.userRole === 'caller' ? 'Caller' : 'Callee',
  text: res.prediction,
  userId: this.userId,
  timestamp: Date.now()
};


this.messages.push(message); // Show it in your own UI
this.signalingService.sendMessage(this.roomId, message); // Send it to Firestore
        }
      }
    } catch (error) {
      console.error('Gesture prediction error:', error);
    }
  }

  listenForMessages(): void {
    if (!this.roomId) return;

    const unsubscribe = this.signalingService.listenForMessages(this.roomId, (msg) => {
      console.log('📩 New message from Firestore:', msg);
      
      // Only add message if it's from another user
      // ✅ Add message if it’s not already in the list (prevent duplicates)
if (!this.messages.some(m => m.userId === msg.userId && m.timestamp === msg.timestamp)) {
  this.messages.push(msg);
}

    });
    this.unsubscribeFunctions.push(unsubscribe);
  }

  createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject', credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject', credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443?transport=tcp',
          username: 'openrelayproject', credential: 'openrelayproject'
        }
      ],
      iceCandidatePoolSize: 10
    });

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      this.remoteVideo.nativeElement.srcObject = stream;
      this.connectionStatus = 'Connected';

       this.ringtone.pause();
  this.ringtone.currentTime = 0;
    };

    pc.oniceconnectionstatechange = () => {
      this.connectionStatus = pc.iceConnectionState;
      if (pc.iceConnectionState === 'failed') {
        alert('Connection failed. Please try again or check your network.');
      }
      if (pc.iceConnectionState === 'failed') {
  this.ringtone.pause();
  this.ringtone.currentTime = 0;
  alert('Connection failed. Please try again or check your network.');
}
    };

    return pc;
  }

  async createRoom(): Promise<void> {
    this.isCaller = true;
    this.userRole = 'caller';
    this.roomId = crypto.randomUUID();
    this.connectionStatus = 'Initializing...';
 this.ringtone.loop = true;
if (this.ringtone.paused) {
  this.ringtone.play().catch(err => {
    console.warn('🔇 Autoplay error:', err);
  });
}

    await this.initLocalStream();
    this.peerConnection = this.createPeerConnection();

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingService.addIceCandidate(this.roomId, 'caller', event.candidate.toJSON());
      }
    };

    this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    await this.signalingService.createRoom(this.roomId, offer);

    const unsubAnswer = this.signalingService.listenForAnswer(this.roomId, async (answer) => {
      if (!this.peerConnection.currentRemoteDescription) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
    this.unsubscribeFunctions.push(unsubAnswer);

    const unsubCandidates = this.signalingService.listenForIceCandidates(this.roomId, 'caller', candidate => {
      const key = JSON.stringify(candidate);
      if (!this.receivedCandidates.has(key)) {
        this.receivedCandidates.add(key);
        this.peerConnection.addIceCandidate(candidate);
      }
    });
    this.unsubscribeFunctions.push(unsubCandidates);

    this.listenForMessages();
  }

  async joinRoom(): Promise<void> {
    if (!this.roomId.trim()) {
      alert('Please enter a Room ID');
      return;
    }

    this.isCaller = false;
    this.userRole = 'callee';
    this.connectionStatus = 'Joining...';
    await this.initLocalStream();
    this.peerConnection = this.createPeerConnection();

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingService.addIceCandidate(this.roomId, 'callee', event.candidate.toJSON());
      }
    };

    this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));

    const unsubOffer = this.signalingService.listenForOffer(this.roomId, async (offer) => {
      if (!this.peerConnection.currentRemoteDescription) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        await this.signalingService.joinRoom(this.roomId, answer);
      }
    });
    this.unsubscribeFunctions.push(unsubOffer);

    const unsubCandidates = this.signalingService.listenForIceCandidates(this.roomId, 'callee', candidate => {
      const key = JSON.stringify(candidate);
      if (!this.receivedCandidates.has(key)) {
        this.receivedCandidates.add(key);
        this.peerConnection.addIceCandidate(candidate);
      }
    });
    this.unsubscribeFunctions.push(unsubCandidates);

    this.listenForMessages();
  }

  copyRoomId(): void {
    navigator.clipboard.writeText(this.roomId).then(() => {
      alert('Room ID copied to clipboard!');
    });
  }

  debugConnection(): void {
    console.log('ICE:', this.peerConnection?.iceConnectionState);
    console.log('Signaling:', this.peerConnection?.signalingState);
    console.log('Connection:', this.peerConnection?.connectionState);
    console.log('User ID:', this.userId);
    console.log('User Role:', this.userRole);
  }
  endCall(): void {
  if (confirm('Are you sure you want to end the call?')) {
    // Stop video/audio
    this.localStream?.getTracks().forEach(track => track.stop());
    const remoteStream = this.remoteVideo?.nativeElement?.srcObject as MediaStream;
    remoteStream?.getTracks().forEach(track => track.stop());

    // Close connection
    this.peerConnection?.close();
    this.connectionStatus = 'Disconnected';

    // Cleanup UI
    this.roomId = '';
    this.isCaller = false;
    this.userRole = '';
    this.messages = [];
    this.remoteVideo.nativeElement.srcObject = null;
    this.localVideo.nativeElement.srcObject = null;

    // Unsubscribe listeners
    this.unsubscribeFunctions.forEach(fn => fn());
    this.unsubscribeFunctions = [];

    // Stop gesture detection
    this.gestureIntervalSub?.unsubscribe();
    this.gestureFrames = [];

    this.ringtone.pause();
this.ringtone.currentTime = 0;
  }
}


  ngOnDestroy(): void {
    this.unsubscribeFunctions.forEach(fn => fn());
    this.localStream?.getTracks().forEach(t => t.stop());
    this.peerConnection?.close();
    this.gestureIntervalSub?.unsubscribe();

    this.ringtone.pause();
this.ringtone.currentTime = 0;
  }
}