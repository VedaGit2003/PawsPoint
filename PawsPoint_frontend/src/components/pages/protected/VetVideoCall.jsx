import React, { useEffect } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { useParams } from 'react-router-dom';
import { backend_url } from '../../../utils/Config';
import { useAuth } from '../../../context/AuthContext';

const appID = 43138822;
const serverSecret = '79be1882183c18f4ccae879fbb89b87f';
// const userID = auth.user._id || `user_${Date.now()}`; // fallback to timestamp if needed
// const userName = auth.user.user_Name || "Vet/User";

const VetVideoCall = () => {
  const [auth]=useAuth()
  const { appointmentId } = useParams();

  const userID = auth?.user?._id || `user_${Date.now()}`; // fallback to timestamp if needed
const userName = auth?.user?.user_Name || "Vet/User";

  useEffect(() => {
    const engine = new ZegoExpressEngine(appID, serverSecret);
    
    engine.createEngine().then(() => {
      engine.loginRoom(
        appointmentId, 
        { userID, userName },
        { userUpdate: true }
      );

      engine.enableCamera(true);
      engine.enableMic(true);

      engine.startPublishingStream('local', {
        camera: { video: true, audio: true },
      });

      engine.startPlayingStream('remote', {});

      return () => {
        engine.stopPublishingStream('local');
        engine.logoutRoom(appointmentId);
        engine.destroyEngine();
      };
    });
  }, [appointmentId]);

  return (
    <div>
      <h2>Video Call (Vet Side)</h2>
      <div id="local" />
      <div id="remote" />
    </div>
  );
};

export default VetVideoCall;
