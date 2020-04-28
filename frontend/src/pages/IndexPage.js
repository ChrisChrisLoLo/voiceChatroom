import React, {useEffect, useState} from "react";
import MessageBar from "../components/MessageBar";
import Container from "reactstrap/es/Container";
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3001";
//Voices to load into the browser
let availableVoices = window.speechSynthesis.getVoices();

function IndexPage() {
  const [username, setUsername] = useState( );
  const [chatArr, setChatArr] = useState([]);
  let socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    socket.on('newMessage', msg => {
      console.log("new message");
      readMessage(msg)
      setChatArr(chatArr=>chatArr.concat(msg));
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
          <h1>hiii</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <MessageBar socket={socket}/>
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