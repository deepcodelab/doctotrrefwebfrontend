// src/pages/CallRoom.tsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "webrtc-adapter";

type SignalMsg =
  | { type: "offer"; sdp: any; clientId: string }
  | { type: "answer"; sdp: any; clientId: string }
  | { type: "candidate"; candidate: any; clientId: string }
  | { type: "hangup"; clientId: string };

export default function CallRoom() {
  const { room } = useParams<{ room: string }>();
  const navigate = useNavigate();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const clientIdRef = useRef<string>(uuidv4());

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [, setIsCaller] = useState<boolean>(false);


  // Build websocket URL from env or current host
  const getWsUrl = () => {
    const backend = import.meta.env.VITE_REACT_APP_BACKEND_WS || `${window.location.protocol}//${window.location.host}`;
    const wsProtocol = backend.startsWith("https") ? "wss" : "ws";
    // backend may include protocol; normalize:
    const host = backend.replace(/^https?:\/\//, "");
    return `${wsProtocol}://${host}/ws/call/${room}/`;
  };

  useEffect(() => {
    if (!room) {
      alert("Missing room ID");
      navigate("/");
      return;
    }

    let mounted = true;

    const start = async () => {
      // open WS
      wsRef.current = new WebSocket(getWsUrl());

      wsRef.current.onopen = () => {
        console.log("WS open");
      };
      wsRef.current.onclose = () => {
        console.log("WS closed");
        setConnected(false);
      };
      wsRef.current.onerror = (e) => {
        console.error("WS error", e);
      };

      // create RTCPeerConnection
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // handle remote track
      pcRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // handle local ICE -> send candidate
      pcRef.current.onicecandidate = (ev) => {
        if (ev.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const msg: SignalMsg = { type: "candidate", candidate: ev.candidate, clientId: clientIdRef.current };
          wsRef.current.send(JSON.stringify(msg));
        }
      };

      // get local media
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localStreamRef.current = localStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        // add tracks to connection
        localStream.getTracks().forEach((t) => pcRef.current!.addTrack(t, localStream));
      } catch (err) {
        console.error("getUserMedia failed:", err);
        alert("Cannot access camera/microphone. Please allow permissions.");
        return;
      }

      // handle incoming WS messages
      wsRef.current.onmessage = async (ev) => {
        if (!mounted || !pcRef.current) return;
        try {
          const data: SignalMsg = JSON.parse(ev.data);

          // ignore own messages
          if ((data as any).clientId && (data as any).clientId === clientIdRef.current) return;

          if (data.type === "offer") {
            console.log("Got offer -> setRemote & createAnswer");
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            wsRef.current!.send(JSON.stringify({ type: "answer", sdp: pcRef.current!.localDescription, clientId: clientIdRef.current }));
            setConnected(true);
          } else if (data.type === "answer") {
            console.log("Got answer -> setRemote");
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
            setConnected(true);
          } else if (data.type === "candidate") {
            try {
              await pcRef.current.addIceCandidate(data.candidate);
            } catch (e) {
              console.warn("addIceCandidate error", e);
            }
          } else if (data.type === "hangup") {
            console.log("Remote hangup");
            endCallLocal();
            alert("Call ended by other participant.");
          }
        } catch (e) {
          console.error("WS message parsing error", e);
        }
      };
    };

    start();

    return () => {
      mounted = false;
      // cleanup
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
      } catch {}
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const startCall = async () => {
    if (!pcRef.current || !wsRef.current) return;
    setIsCaller(true);

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    const payload: SignalMsg = { type: "offer", sdp: pcRef.current.localDescription!, clientId: clientIdRef.current };
    wsRef.current.send(JSON.stringify(payload));
  };

  const toggleMic = () => {
    const s = localStreamRef.current;
    if (!s) return;
    s.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((p) => !p);
  };

  const toggleCam = () => {
    const s = localStreamRef.current;
    if (!s) return;
    s.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((p) => !p);
  };

  const endCallLocal = () => {
    // send hangup then cleanup
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "hangup", clientId: clientIdRef.current }));
      }
    } catch {}
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setConnected(false);
    // optional navigate back
    // navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Call Room: {room}</h2>
          <div className="text-sm text-gray-500">You: {clientIdRef.current.slice(0, 8)}</div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">Local</div>
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-64 bg-black rounded" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">Remote</div>
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-64 bg-black rounded" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={startCall}
            disabled={connected}
            className={`px-4 py-2 rounded ${connected ? "bg-gray-300 text-gray-700" : "bg-green-600 text-white"}`}
          >
            {connected ? "Connected" : "Start Call"}
          </button>

          <button onClick={toggleMic} className="px-4 py-2 rounded bg-white border">
            {micOn ? "Mute" : "Unmute"}
          </button>

          <button onClick={toggleCam} className="px-4 py-2 rounded bg-white border">
            {camOn ? "Camera Off" : "Camera On"}
          </button>

          <button onClick={endCallLocal} className="ml-auto px-4 py-2 rounded bg-red-600 text-white">
            End Call
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Note: This page uses your backend WebSocket signaling endpoint. Make sure your Django Channels consumer is available at <code>/ws/call/:room/</code>.
        </div>
      </div>
    </div>
  );
}
