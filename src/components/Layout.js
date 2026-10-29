import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ buildTag, loading, error }) => (
  <div className="layout" data-build={buildTag}>
    <NavBar />
    <main className="content">
      {loading ? (
        <p>Đang tải câu hỏi...</p>
      ) : error ? (
        <p>Không tải được câu hỏi.</p>
      ) : (
        <Outlet />
      )}
    </main>
  </div>
);

export default Layout;