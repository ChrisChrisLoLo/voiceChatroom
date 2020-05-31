import React, {useState} from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
} from 'reactstrap';

function MessageBar(props) {
  const socket = props.socket;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lang, setLang] = React.useState('en-US');
  const [message, setMessage] = React.useState('');

  const changeLang = (e) => {
    setLang(e.target.value);
  }

  const changeMessage = (e) => {
    setMessage(e.target.value);
  }

  const sendMessage = (e) => {
    console.log(lang);
    console.log(message);
    if(message === ''){
      return;
    }
    socket.emit('newMessage',{lang,message});
    setMessage('');
  }

  return (
    <InputGroup>
      <InputGroupAddon addonType='prepend'>
        <Input type='select' name='select' id='exampleSelect' value={lang} onChange={changeLang}>
          <option value={'en-US'}>English (US)</option>
          <option value={'en-GB'}>English (UK)</option>
          <option value={'fr-FR'}>Français</option>
          <option value={'es-ES'}>Español</option>
          <option value={'it-IT'}>Italiano</option>
          <option value={'ru-RU'}>русский</option>
          <option value={'ja-JP'}>日本語</option>
          <option value={'zh-CN'}>普通话</option>
        </Input>
      </InputGroupAddon>
      <Input
        value={message}
        placeholder='message'
        onChange={changeMessage}/>
      <InputGroupAddon addonType='append'><Button color='secondary' onClick={sendMessage}>Send</Button></InputGroupAddon>
    </InputGroup>
  );
}

export default MessageBar;