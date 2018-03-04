import { environment } from '../environments/environment';

var base_url = 'http://' + environment.host + ':' + environment.ws_port;

export const getRooms = async (query) => {
  return fetch(base_url + '/rooms?q='+query, {
              method: "GET",
              headers: {
                'Content-Type': 'application/json'
              }
          }).then(function(response) {
              return response.json();
          }, function(error) {
              console.log(error);
          });
};