import { createBrowserHistory, Location } from 'history';

type LocationState = {
  from: Location;
};

//const history = createBrowserHistory<LocationState>();
const history = createBrowserHistory();


export default history;
