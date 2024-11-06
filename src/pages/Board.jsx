// board main

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../style/Board.scss';

const getPosts = async () => {
  const URL = 'http://127.0.0.1:8001/board';
  const resp = await axios.get(URL);
  return resp.data;
};

export default function Board() {
  const navigate = useNavigate();

  const {
    data: posts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['board'],
    queryFn: () => getPosts(),
    enabled: true,
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <div>Loading..⏳</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="b-wrap">
      <div className="b-title">게시판</div>
      <div className="addpost">
        <button className="write" onClick={() => navigate('/newpost')}>
          글쓰기
        </button>
      </div>
      <div className="b-main">
        <table>
          <thead className="bt-head">
            <tr className="bt-tr">
              <th>이름</th>
              <th>제목</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody className="bt-body">
            {posts.map((entry) => (
              <tr key={entry.id} className="bt-tr checkpost">
                <td>{entry.name}</td>
                <td
                  className="bt-title"
                  onClick={() => navigate(`/board/${entry.id}`)}
                >
                  {entry.title}
                </td>
                <td className="bt-date">{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
