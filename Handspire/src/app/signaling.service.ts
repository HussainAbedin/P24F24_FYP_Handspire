import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc,
   collection,
  addDoc,
  query,
  orderBy
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  constructor(private firestore: Firestore) {}
  async sendMessage(roomId: string, msg: { sender: string, text: string, userId: string, timestamp: number }): Promise<void> {
  const messagesRef = collection(this.firestore, `rooms/${roomId}/messages`);
  console.log('🔁 Sending message to Firestore:', msg, 'in room:', roomId);
  try {
    await addDoc(messagesRef, msg);
  } catch (err) {
    console.error('❌ Firestore sendMessage failed:', err);
  }
}


  listenForMessages(roomId: string, callback: (msg: any) => void): () => void {
  const messagesRef = collection(this.firestore, `rooms/${roomId}/messages`);
  const q = query(messagesRef, orderBy('timestamp'));
  const unsubscribe = onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const msg = change.doc.data();
        console.log('📩 Firestore change added:', msg);
        callback(msg);
      }
    });
  });
  return unsubscribe;
}


  async createRoom(roomId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    const roomRef = doc(this.firestore, `rooms/${roomId}`);
    try {
      await setDoc(roomRef, {
        offer,
        callerCandidates: [],
        calleeCandidates: []
      });
      console.log(`Room "${roomId}" created`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  }

  async joinRoom(roomId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const roomRef = doc(this.firestore, `rooms/${roomId}`);
    try {
      const roomSnap = await getDoc(roomRef);
      if (!roomSnap.exists()) {
        console.error(`Room "${roomId}" does not exist!`);
        return;
      }
      await updateDoc(roomRef, { answer });
      console.log(`Joined room "${roomId}" and saved answer`);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  }

  listenForAnswer(roomId: string, callback: (answer: RTCSessionDescriptionInit) => void): () => void {
    const roomRef = doc(this.firestore, `rooms/${roomId}`);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.['answer']) {
        console.log('Answer received');
        callback(data['answer']);
      }
    });
    return unsubscribe;
  }

  listenForOffer(roomId: string, callback: (offer: RTCSessionDescriptionInit) => void): () => void {
    const roomRef = doc(this.firestore, `rooms/${roomId}`);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.['offer']) {
        console.log('Offer received');
        callback(data['offer']);
      }
    });
    return unsubscribe;
  }

  async addIceCandidate(roomId: string, role: 'caller' | 'callee', candidate: RTCIceCandidateInit): Promise<void> {
    const roomRef = doc(this.firestore, `rooms/${roomId}`);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) return;

    const data = roomSnap.data();
    const key = role === 'caller' ? 'callerCandidates' : 'calleeCandidates';
    const existing = data?.[key] || [];

    await updateDoc(roomRef, {
      [key]: [...existing, candidate]
    });
  }

  listenForIceCandidates(roomId: string, role: 'caller' | 'callee', callback: (candidate: RTCIceCandidate) => void): () => void {
    const roomRef = doc(this.firestore, `rooms/${roomId}`);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      const key = role === 'caller' ? 'calleeCandidates' : 'callerCandidates';
      const candidates = data?.[key] || [];
      candidates.forEach((c: RTCIceCandidateInit) => {
        callback(new RTCIceCandidate(c));
      });
    });
    return unsubscribe;
  }
}
