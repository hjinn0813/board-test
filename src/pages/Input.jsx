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
    password: '',
    title: '',
    content: '',
  });
  const MAX_LENGTH = 50; // 최대 글자수 제한

  /* 비밀번호 검증 로직 */
  const validatePw = async () => {
    // 비번 입력 여부 확인
    if (!formData.password) {
      alert('비밀번호를 입력해주세요!');
      return false;
      // 검증 실패하면 로직 종료
    }

    // 비번 길이 확인
    if (
      formData.password.length < 8 ||
      formData.password.length > 12 ||
      !/\d/.test(formData.password)
    ) {
      alert('비밀번호는 8~12자이며 숫자를 포함해야 합니다!');
      return false;
    }

    // 수정 모드 비번 검증
    if (isEdit) {
      try {
        const resp = await axios.post(`http://127.0.0.1:8001/verify_pw`, {
          post_id: id,
          password: formData.password,
        });
        if (!resp.data.success) {
          alert('비밀번호가 일치하지 않습니다!');
          return false;
        }
      } catch (error) {
        console.error('비밀번호 검증 중 오류 발생', error);
        alert('비밀번호 검증에 실패했습니다!');
        return false;
      }
    }
    return true;
  };

  /* 서버에서 기존 게시글 데이터 가져오기 */
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
        password: '',
        title: postData.title,
        content: postData.content,
      });
    }
  }, [postData, isEdit]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.length <= MAX_LENGTH ? value : prevData[name],
    }));
  };

  // 등록 및 수정 요청을 처리하는 mutation
  const mutation = useMutation({
    mutationFn: async () => {
      const resp = isEdit
        ? await axios.put(`http://127.0.0.1:8001/board/${id}`, formData) // 수정
        : await axios.post('http://127.0.0.1:8001/board/', formData); // 등록
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('posts'); // 게시글 목록 갱신
      if (isEdit) {
        navigate(`/board/${id}`); // 수정: 디테일 페이지로 이동
      } else {
        navigate('/board'); // 등록: 게시글 목록 페이지로 이동
      }
    },
  });

  /* 등록, 수정 버튼 핸들러 함수 */
  const handleSubmit = async () => {
    const isPwValid = await validatePw();
    if (isPwValid) {
      mutation.mutate();
      // 비번 검증 통과하면 useMutation 실행
    }
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
                <div className="char-count">
                  {formData.name.length}/{MAX_LENGTH}
                </div>
              </td>
            </tr>
            <tr>
              <th className="i-key">비밀번호</th>
              <td className="i-value">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="char-count">
                  {formData.password.length}/12
                  {/* 입력제한 12자 이하 */}
                </div>
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
                <div className="char-count">
                  {formData.title.length}/{MAX_LENGTH}
                </div>
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
                <div className="char-count">
                  {formData.content.length}/{MAX_LENGTH}
                </div>
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
