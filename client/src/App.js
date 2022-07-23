import './App.css';
import io, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const sock = io.connect("http://localhost:3001");

function App() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const sendMessage = () => {
    sock.emit('chat message', message, nickname);
  };

  useEffect(() => {
    sock.on('show message', (result) => {
      const listItems = result.map((result) =>
        <ListItem>
          <ListItemText
            primary={result.nickname}
            secondary = {result.content + " " + new Date(result.sentAt).toLocaleTimeString()}
          />
          </ListItem>
);

      setMessageReceived(listItems);
    })
  }, [sock])
  return (
    <div className="App">
      <h1>Чат</h1>
      <List sx={{width: '100%', bgcolor: 'background.paper', overflow: 'auto',
        maxHeight: 400}}>
        {messageReceived}
      </List>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          '& button': {m: 1 },
        }}
        noValidate
        autoComplete="off"
        >
      <div>
        <TextField
        label="Имя"
        id="inName"
        size="small"
        onChange={(event) => {
          setNickname(event.target.value);
        }}
        />
      </div>
      <div>
      <TextField
        label="Сообщение"
        id="inMessage"
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        />
      </div>
      <div className='SendButton'>
      <Button 
      variant="contained" 
      onClick={sendMessage}
      type="submit">Отправить</Button>
      </div>
      </Box>
    </div>
  );
}

export default App;
