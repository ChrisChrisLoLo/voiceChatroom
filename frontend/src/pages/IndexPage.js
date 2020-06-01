import React, {useEffect, useState} from "react";
import MessageBar from "../components/MessageBar";
import Container from "reactstrap/es/Container";
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import socketIOClient from "socket.io-client";
import ss from "socket.io-stream";
import ChatLog from "../components/ChatLog";
const ENDPOINT = "http://localhost:3001";
//Voices to load into the browser
let availableVoices = window.speechSynthesis.getVoices();
let audioContext = new AudioContext();

function IndexPage() {
  const [username, setUsername] = useState( );
  const [chatArr, setChatArr] = useState([]);
  let textSocket = socketIOClient(ENDPOINT+"/textData");
  textSocket.emit('newLanguage',{lang:'en-US',message:"FUn"})

  let ttsSocket = socketIOClient(ENDPOINT);

  useEffect(() => {
    textSocket.on('newMessage', data => {
      console.log("new message");
      console.log(data);
      readMessage(data.msg)
      setChatArr(chatArr=>chatArr.concat(data.msg));
    });

    ss(ttsSocket).on('track-stream', async (stream) => {
      console.log('SDFFSD')
      console.log(stream)
      let binaryString = ""
      let byteArr = []
      stream.on('data', function(data) {
        for(let i=0;i<data.length;i++) {
          binaryString+=String.fromCharCode(data[i]);
          byteArr.push(data[i]);
        }
      });
      stream.on('end', async (data) => {
        console.log(binaryString);
        console.log(byteArr);
        let uIntByteArr = new Uint8Array(byteArr)

        const audioBufferChunk = await audioContext.decodeAudioData(uIntByteArr.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBufferChunk;
        source.connect(audioContext.destination);
        source.start();
      });
    });
  }, []);

  // get available voices
  availableVoices = window.speechSynthesis.getVoices();
  if(availableVoices.length === 0) {
    // wait until voices are available to load
    window.speechSynthesis.addEventListener('voiceschanged', function() {
      availableVoices = window.speechSynthesis.getVoices();
    });
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>Chatroom</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChatLog chatArr={chatArr}/>
        </Col>
      </Row>
      <Row>
        <Col>
          <MessageBar sockets={[textSocket,ttsSocket]}/>
        </Col>
      </Row>
    </Container>
  );
}


function readMessage(msg) {
  const synth = window.speechSynthesis;

  let availableVoices = synth.getVoices();
  //get available voices
  if(synth.getVoices().length === 0) {
    synth.addEventListener('voiceschanged', function() {
      availableVoices = synth.getVoices();
    });
  }
  else {
    availableVoices = synth.getVoices();
  }

  // load voice that corresponds to the message language. Use the first one as a default
  const voice = availableVoices.find(el => el.lang === msg.lang) || availableVoices[0];
  const utter = new SpeechSynthesisUtterance();
  utter.rate = 1;
  utter.pitch = 1;
  utter.text = msg.message;
  utter.voice = voice;
  console.log(voice)
  synth.speak(utter);
}

export default IndexPage;