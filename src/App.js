const BUILD_TAG = "tp-4186";
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/data/questions.json', {
          signal: controller.signal,
        });
        if (!Array.isArray(res.data)) {
          throw new Error('Dữ liệu không hợp lệ');
        }
        setQuestions(res.data);
        setError(false);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        setError(true);
        setLoading(false);
      }
    };
    fetchQuestions();
    return () => controller.abort();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout buildTag={BUILD_TAG} loading={loading} error={error} />}
      >
        <Route index element={<h2>Trang chủ</h2>} />
        <Route path="play" element={<h2>Màn hình chơi</h2>} />
        <Route path="result" element={<h2>Kết quả</h2>} />
        <Route path="history" element={<h2>Lịch sử</h2>} />
        <Route path="questions" element={<QuestionBank questions={questions} />} />
        <Route
          path="questions/:id"
          element={<QuestionDetail questions={questions} />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;