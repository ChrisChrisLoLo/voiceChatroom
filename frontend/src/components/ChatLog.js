import React, {useEffect} from 'react';
import ListGroup from "reactstrap/es/ListGroup";
import ListGroupItem from "reactstrap/es/ListGroupItem";
import "./css/ChatLog.css";

function ChatLog(props) {
  const messagesEndRef = React.createRef()
  const itemArr = props.chatArr.map(el =>
    <ListGroupItem>{el.message}</ListGroupItem>
  )
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({behavior:'smooth'});
  });
  return(
    <ListGroup className={"chat-list-group"}>
      {itemArr}
      <div ref={messagesEndRef} />
    </ListGroup>
  )
}

export default ChatLog;