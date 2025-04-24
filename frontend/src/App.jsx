import "./App.css";
import {
  BrowserRouter,
  Form,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./Hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
import Room from "./pages/Room/Room";

function App() {
 
  const {loading}=useLoadingWithRefresh();
  
  const GuestRoute = ({ children, ...rest }) => {
    const {isAuth}=useSelector(state=>state.auth)
    const location = useLocation();
    return isAuth ? (
      <Navigate to="/rooms" state={{ from: location }} replace />
    ) : (
      children
    );
  };

  const SemiProtectedRoute=({children})=>{
    const {isAuth,user}=useSelector(state=>state.auth)
    const location=useLocation()
    if(!isAuth){
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (isAuth && !user.isActivated) {
      return children;
    }
  
    return <Navigate to="/rooms" state={{ from: location }} replace />;
  }

  const ProtectedRoute=({children})=>{
    const {isAuth,user}=useSelector(state=>state.auth)
    const location=useLocation();
    if(!isAuth){
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    if(isAuth && !user.isActivated){
      return <Navigate to="/activate" state={{from:location}} replace/>;
    }
    return (children);
  }

  return loading?<Loader message={"please wait while loading ...."}/> :(
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <GuestRoute>
                <Home />
              </GuestRoute>
            }
          />
          <Route
            path="/authenticate"
            element={
              <GuestRoute>
                <Authenticate />
              </GuestRoute>
            }
          />
          <Route path="/activate" element={
            <SemiProtectedRoute>
              <Activate/>
            </SemiProtectedRoute>
          }/>

          <Route path="/rooms" element={
            <ProtectedRoute>
              <Rooms/>
            </ProtectedRoute>
          }/>
          <Route path="/room/:roomId" element={
            <ProtectedRoute>
              <Room/>
            </ProtectedRoute>
          }/>
        </Routes>
          
      </BrowserRouter>
    </>
  );
}

export default App;
