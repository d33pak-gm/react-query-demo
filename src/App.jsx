import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PostsRQ from "./components/PostsRQ";
import Home from "./components/Home";
import PostsTradional from "./components/PostsTradional";
import PostDetails from "./components/PostDetails";
import PaginatedQueries from "./components/PaginatedQueries";
import InfiniteQueries from "./components/InfiniteQueries";
import InfiniteQueriesNoBtn from "./components/InfiniteQueriesNoBtn";
import PostsRqMutation from "./components/PostsRqMutation";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/posts">Traditional Posts</Link>
            </li>
            <li>
              <Link to="/rq-posts">RQ Posts</Link>
            </li>
            <li>
              <Link to="/rq-mutation">RQ Mutation</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/posts" element={<PostsTradional />} />
          <Route exact path="/rq-posts" element={<PostsRQ />} />
          <Route exact path="/rq-posts/:postId" element={<PostDetails />} />
          <Route exact path="/rq-mutation" element={<PostsRqMutation/>} />
          <Route
            exact
            path="/paginated-fruits"
            element={<PaginatedQueries />}
          />
          <Route exact path="/infinte-queries" element={<InfiniteQueries />} />
          <Route
            exact
            path="/infinte-queries-no-btn"
            element={<InfiniteQueriesNoBtn />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
