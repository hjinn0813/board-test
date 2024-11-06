// board form (추가, 수정 모두 가능)

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import '../style/Board.scss';

export default function Input() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams(); // 게시글 ID를 URL 파라미터에서 가져옴
  const isEdit = !!id; // ID가 있으면 수정 모드, 없으면 등록 모드
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
  });

  // 서버에서 기존 게시글 데이터 가져오기
  const { data: postData, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const postURL = `http://127.0.0.1:8001/board/${id}`;
      const { data } = await axios.get(postURL);
      return data;
    },
    enabled: isEdit, // 수정 모드일 때만 실행
  });

  // formData 초기화 (수정 모드일 때만 postData를 사용)
  useEffect(() => {
    if (isEdit && postData) {
      setFormData({
        name: postData.name,
        title: postData.title,
        content: postData.content,
      });
    }
  }, [postData, isEdit]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 등록 및 수정 요청을 처리하는 mutation
  const mutation = useMutation({
    mutationFn: async () => {
      if (isEdit) {
        return await axios.put(`http://127.0.0.1:8001/board/${id}`, formData); // 수정 요청
      } else {
        return await axios.post('http://127.0.0.1:8001/board/', formData); // 등록 요청
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('posts'); // 게시글 목록 데이터 갱신
      navigate('/board'); // 게시판 메인으로 이동
    },
  });

  // 등록 또는 수정 버튼 클릭 시 실행
  const handleSubmit = () => {
    mutation.mutate(); // 등록 또는 수정 mutation 실행
  };

  if (isLoading) return <div>Loading... ⏳</div>;

  return (
    <div className="i-wrap">
      <div className="i-title">{isEdit ? '글 수정하기' : '글 작성하기'}</div>
      <div className="i-area">
        <table className="i-form">
          <tbody>
            <tr>
              <th className="i-key">이름</th>
              <td className="i-value">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th className="i-key">제목</th>
              <td className="i-value">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th className="i-key">내용</th>
              <td className="i-value">
                <textarea
                  name="content"
                  cols="30"
                  rows="10"
                  value={formData.content}
                  onChange={handleChange}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="submit">
          <button className="i-btn" type="button" onClick={handleSubmit}>
            {isEdit ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
