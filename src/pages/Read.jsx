// 특정 게시글 조회 시의 페이지
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import '../style/Board.scss';

const getPostDetail = async (id) => {
  const postURL = `http://127.0.0.1:8001/board/${id}`;
  const resp = await axios.get(postURL);
  return resp.data;
};

export default function Read() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: post,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostDetail(id),
  });

  /* 수정 선택하면 비번 입력창으로 연결 */
  const handleEdit = () => {
    navigate(`/valid_pw/${id}?mode=edit`);
  };

  /* 게시글 삭제로 연결 */
  const handleDelete = async () => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (confirmed) {
      navigate(`/valid_pw/${id}?mode=delete`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="r-wrap">
      <div className="r-title">{post.title}</div>
      <table className="r-table">
        <tbody className="rt-body">
          <tr>
            <td className="r-key">이름</td>
            <td className="r-value">{post.name}</td>
          </tr>
          <tr>
            <td className="r-key">내용</td>
            <td className="r-value">
              {post.content.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="r-btns">
        <button className="rb-rewind" onClick={() => navigate('/board')}>
          목록
        </button>
        <button className="rb-edit" onClick={handleEdit}>
          수정
        </button>
        <button className="rb-delete" onClick={handleDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}
