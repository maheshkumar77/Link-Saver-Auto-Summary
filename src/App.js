import { Routes, Route } from 'react-router-dom';
import HeroPage from "./compnent/Heropage";
import Navbar from "./compnent/Navcomp/Navbar";
import LoginPage from "./compnent/Usercredential/Loginpage";
import Register from "./compnent/Usercredential/Register";
import ForgotPassword from './compnent/Usercredential/ForgotPassword';
import AnalyzerPage from './compnent/AnalyzerPage';
import SavedUrlsPage from './compnent/SavedUrlsPage';
import AddBookmark from './compnent/AddBookmark';
import SaveLink from './compnent/Savelink';
import AboutPage from './compnent/AboutPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Main content area that grows to fill space */}
      <main className=' mt-12' >
        <Routes>
          <Route 
            path="/" 
            element={
              <div >
                <HeroPage />
              </div>
            } 
          />
          <Route 
            path="/login" 
            element={
              <div>
                <LoginPage />
              </div>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <div >
                <Register />
              </div>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <div >
              <ForgotPassword/>
              </div>
            } 
          />
           <Route 
            path="/analuze" 
            element={
              <div >
              <AnalyzerPage/>
              </div>
            } 
          />
           <Route
            path="/showlist" 
            element={
              <div >
             <SavedUrlsPage/>
              </div>
            } 
          />
           <Route
            path="/addbookmark" 
            element={
              <div >
             <AddBookmark/>
              </div>
            } 
          />
          <Route path='/savelink' element={<SaveLink/>}/>
          <Route path='/about' element={<AboutPage/>}/>
        </Routes>
        
      </main>
      
      {/* Simple footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 My App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;