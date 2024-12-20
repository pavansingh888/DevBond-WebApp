import Body from "./components/Body";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Body/>}>
       <Route path="/" ></Route>
       <Route  path='/login' element={<Login/>}></Route>
       <Route  path='/profile' element={<Profile/>}></Route>
       <Route  path='/connections' element={<Connections/>}></Route>
      </Route>
    </Routes> 
    </BrowserRouter>
</>
  )
}

export default App
