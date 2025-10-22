// import supabase from "./supabase-client";
import "./App.css";
import Header from "./components/Header";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import Feed from "./components/Feed";

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <div className="content-wrapper">
          <Profile />
          <div className="main-content">
            <CreatePost />
            <Feed />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
