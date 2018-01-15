const io = require('socket.io-client');
import { environment } from '../environments/environment';

export const initSocket = () => {
    // initialize a web socket connection
    // make a socket.io connection to the server
    // make sure we are using web sockets instead of long polling
    return io('http://'+ environment.host + ':' + environment.socket_port, 
            { transports: ['websocket'], upgrade: false });
}// end function initSocket